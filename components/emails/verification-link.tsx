import React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const VerificationLinkEmail = ({
  url = "https://www.papermark.io",
}: {
  url: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Login to your Doctrack account with a secure link</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Text className="mx-0 mb-8 mt-4 p-0 text-center text-2xl font-bold tracking-tighter">
              Doctrack
            </Text>

            <Text className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Welcome to Doctrack
            </Text>

            <Text className="text-sm leading-6 text-black">
              We received a request to log in to your account. You can use the link below to securely access your account.
            </Text>

            <Section className="my-8 text-center">
              <Button
                className="rounded bg-black text-center text-xs font-semibold text-white no-underline"
                href={url}
                style={{ padding: "12px 20px" }}
              >
                Sign in to Doctrack
              </Button>
            </Section>
            <Text className="text-sm leading-6 text-black">
              If the button above doesn’t work, you can copy and paste the following link into your browser:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {url}
            </Text>

            <Text className="mt-8 text-sm leading-6 text-gray-500">
              If you didn’t request this login link, you can safely ignore this email. Only a person with access to this email can log in using the link.
            </Text>

            <Text className="mt-4 text-xs leading-5 text-gray-400">
              Need help? Contact us at support@doctrack.com
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationLinkEmail;
