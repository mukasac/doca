
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PasskeyProvider } from "@teamhanko/passkeys-next-auth-provider";
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

import { identifyUser, trackAnalytics } from "@/lib/analytics";
import { sendWelcomeEmail } from "@/lib/emails/send-welcome";
import hanko from "@/lib/hanko";
import prisma from "@/lib/prisma";
import { CreateUserEmailProps, CustomUser } from "@/lib/types";
import { Resend } from 'resend';



const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const config = {
  maxDuration: 180,
};


const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  debug: true, // Add this during development
  logger: {
    error: (code, ...message) => {
      console.error(code, ...message)
    },
    warn: (code, ...message) => {
      console.warn(code, ...message)
    },
    debug: (code, ...message) => {
      console.debug(code, ...message)
    },
  },
  pages: {
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      debug: true  // Add this to get more detailed logs
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid profile email r_emailaddress r_liteprofile",
          response_type: "code",
        },
      },
      issuer: "https://www.linkedin.com",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      profile(profile, tokens) {
        console.log("LinkedIn Profile:", profile); // Add this debug line
        const defaultImage = "https://cdn-icons-png.flaticon.com/512/174/174857.png";
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture ?? defaultImage,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
    // LinkedInProvider({
    //   clientId: process.env.LINKEDIN_CLIENT_ID as string,
    //   clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    //   authorization: {
    //     params: { scope: "openid profile email" },
    //   },
    //   issuer: "https://www.linkedin.com",
    //   jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
    //   profile(profile, tokens) {
    //     const defaultImage = "https://cdn-icons-png.flaticon.com/512/174/174857.png";
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.picture ?? defaultImage,
    //     };
    //   },
    //   allowDangerousEmailAccountLinking: true,
    // }),
    EmailProvider({
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        try {
          const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev", // You can customize this after verifying your domain
            to: email,
            subject: "Sign in to Doctrack",
            html: `<p>Please click the following link to sign in to Doctrack:</p>
                  <p><a href="${url}">Sign in to Doctrack</a></p>`,
          });

          if (error) {
            throw new Error(error.message);
          }
        } catch (error) {
          console.error('Error sending verification email:', error);
          throw new Error('Error sending verification email');
        }
      },
      from: "onboarding@resend.dev", // Update this after verifying your domain
    }),
    PasskeyProvider({
      tenant: hanko,
      async authorize({ userId, token }) {
        if (!userId) return null;
        
        let user = await prisma.user.findUnique({ 
          where: { id: userId },
        });
    
        if (!user) {
          // Create user with temporary data
          user = await prisma.user.create({
            data: {
              id: userId,
              email: null, // Will be updated later
            },
          });
        }
    
        return user;
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    // PasskeyProvider({
    //   tenant: hanko,
    //   async authorize({ userId }) {
    //     const user = await prisma.user.findUnique({ where: { id: userId } });
    //     if (!user) return null;
    //     return user;
    //   },
    // }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: VERCEL_DEPLOYMENT ? ".papermark.io" : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (!token.email) {
        return {};
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      (session.user as CustomUser) = {
        id: token.sub,
        // @ts-ignore
        ...(token || session).user,
      };
      return session;
    },
  },
  events: {
    async createUser(message) {
      const params: CreateUserEmailProps = {
        user: {
          name: message.user.name,
          email: message.user.email,
        },
      };

      await identifyUser(message.user.email ?? message.user.id);
      await trackAnalytics({
        event: "User Signed Up",
        email: message.user.email,
        userId: message.user.id,
      });

      await sendWelcomeEmail(params);
    },
    async signIn(message) {
      await identifyUser(message.user.email ?? message.user.id);
      await trackAnalytics({
        event: "User Signed In",
        email: message.user.email,
      });
    },
  },

  
};

export default NextAuth(authOptions);