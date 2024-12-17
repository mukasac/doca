"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useState } from "react";

import { signInWithPasskey } from "@teamhanko/passkeys-next-auth-provider/client";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { LastUsed, useLastUsed } from "@/components/hooks/useLastUsed";
import Google from "@/components/shared/icons/google";
import LinkedIn from "@/components/shared/icons/linkedin";
import Passkey from "@/components/shared/icons/passkey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { validateEmail } from "@/lib/utils/validate-email";


export default function Login() {
  const { next } = useParams as { next?: string };

  const [lastUsed, setLastUsed] = useLastUsed();
  const authMethods = ["google", "email", "linkedin", "passkey"] as const;
  type AuthMethod = (typeof authMethods)[number];
  const [clickedMethod, setClickedMethod] = useState<AuthMethod | undefined>(
    undefined,
  );
  const [email, setEmail] = useState<string>("");
  const [emailButtonText, setEmailButtonText] = useState<string>(
    "Continue with Email",
  );

  const isValidEmail = email.length > 0 && validateEmail(email);

  return (
    <div className="flex h-screen w-full flex-wrap bg-cover bg-center"
    style={{
      backgroundImage: `url(https://img.freepik.com/free-photo/portrait-interracial-couple-reading-together_23-2148139357.jpg?t=st=1734425339~exp=1734428939~hmac=f2794a1c6692d069d0c09c3cf862ed9e53fab8c2b834e88ac6db0dbe4d72adad&w=740)`,
    }}
    >
      
      <div className="flex w-full justify-center"
      >
      
        <div
          className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        ></div>
        <div className="z-10 h-fit w-full max-w-screen overflow-hidden rounded-lg sm:mx-0">
          <div className="flex min-h-screen items-center justify-center">
             
          <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md" style={{ background: '#403e3cab',backgroundSize: 'cover'}}>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!isValidEmail) return;

                setClickedMethod("email");
                signIn("email", {
                  email: email,
                  redirect: false,
                  ...(next && next.length > 0 ? { callbackUrl: next } : {}),
                }).then((res) => {
                  if (res?.ok && !res?.error) {
                    setEmail("");
                    setLastUsed("credentials");
                    setEmailButtonText("Email sent - check your inbox!");
                    toast.success("Email sent - check your inbox!");
                  } else {
                    setEmailButtonText("Error sending email - try again?");
                    toast.error("Error sending email - try again?");
                  }
                  setClickedMethod(undefined);
                });
              }}
            >
                <div className="flex flex-col items-center justify-center space-y-3 px-4 text-center ">
           
              <h3 className=" text-2xl font-semibold ">
                Welcome to Doctrack
              </h3>
           
            <h6 className="text-balance text-sm">
            <small><i>  Share documents. Not attachments.</i></small>
            </h6>
          </div>
              <Label className="" htmlFor="email">
                Enter your email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={clickedMethod === "email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "flex h-10 w-full rounded-md border-0 bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-gray-200 transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
                  email.length > 0 && !isValidEmail ? "ring-red-500" : "ring-gray-200"
                )}
              />
              <div className="relative">
                <Button
                  type="submit"
                  loading={clickedMethod === "email"}
                  disabled={!isValidEmail || !!clickedMethod}
                  className={cn(
                    "focus:shadow-outline w-full transform rounded px-4 py-2 text-white transition-colors duration-300 ease-in-out focus:outline-none",
                    clickedMethod === "email" ? "bg-black" : "bg-gray-800 hover:bg-gray-900"
                  )}
                >
                  {emailButtonText}
                </Button>
                {lastUsed === "credentials" && <LastUsed />}
              </div>
            </form>
            <p className="py-4 text-center">or</p>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Button
                  onClick={() => {
                    setClickedMethod("google");
                    setLastUsed("google");
                    signIn("google", {
                      ...(next && next.length > 0 ? { callbackUrl: next } : {}),
                    }).then((res) => {
                      if (res?.status) {
                        setClickedMethod(undefined);
                      }
                    });
                  }}
                  loading={clickedMethod === "google"}
                  disabled={clickedMethod && clickedMethod !== "google"}
                  className="flex w-full items-center justify-center space-x-2 border border-gray-200 bg-gray-100 font-normal text-gray-900 hover:bg-gray-200"
                >
                  <Google className="h-5 w-5" />
                  <span>Continue with Google</span>
                  {clickedMethod !== "google" && lastUsed === "google" && <LastUsed />}
                </Button>
              </div>
              {/* <div className="relative">
                <Button
                  onClick={() => {
                    setClickedMethod("linkedin");
                    setLastUsed("linkedin");
                    signIn("linkedin", {
                      ...(next && next.length > 0 ? { callbackUrl: next } : {}),
                    }).then((res) => {
                      if (res?.status) {
                        setClickedMethod(undefined);
                      }
                    });
                  }}
                  loading={clickedMethod === "linkedin"}
                  disabled={clickedMethod && clickedMethod !== "linkedin"}
                  className="flex w-full items-center justify-center space-x-2 border border-gray-200 bg-gray-100 font-normal text-gray-900 hover:bg-gray-200"
                >
                  <LinkedIn />
                  <span>Continue with LinkedIn</span>
                  {clickedMethod !== "linkedin" && lastUsed === "linkedin" && (
                    <LastUsed />
                  )}
                </Button>
              </div> */}
              {/* <div className="relative">
                <Button
                  onClick={() => {
                    setLastUsed("passkey");
                    setClickedMethod("passkey");
                    signInWithPasskey({
                      tenantId: process.env.NEXT_PUBLIC_HANKO_TENANT_ID as string,
                    });
                  }}
                  variant="outline"
                  loading={clickedMethod === "passkey"}
                  disabled={clickedMethod && clickedMethod !== "passkey"}
                  className="flex w-full items-center justify-center space-x-2 border border-gray-200 bg-gray-100 font-normal text-gray-900 hover:bg-gray-200 hover:text-gray-900"
                >
                  <Passkey className="h-4 w-4" />
                  <span>Continue with a passkey</span>
                  {lastUsed === "passkey" && <LastUsed />}
                </Button>
              </div> */}
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              By clicking continue, you acknowledge that you have read and agree to
              Doctrack&apos;s{" "}
              <a
                href="https://www.papermark.io/terms"
                target="_blank"
                className="underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://www.papermark.io/privacy"
                target="_blank"
                className="underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        </div>
      </div>
      
    </div>
  );
}
