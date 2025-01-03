import TrialEndFinalReminderEmail from "@/components/emails/trial-end-final-reminder";

import { sendEmail } from "@/lib/resend";

export const sendTrialEndFinalReminderEmail = async (
  email: string,
  name: string | null,
) => {
  const emailTemplate = TrialEndFinalReminderEmail({ name });
  try {
    await sendEmail({
      to: email,
      subject: `Your pro trial expires in 24 hours`,
      react: emailTemplate,
      test:false,
      // test: process.env.NODE_ENV === "development",
      system: true,
    });
  } catch (e) {
    console.error(e);
  }
};
