import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST || "smtp.ethereal.email";
const smtpPort = parseInt(process.env.SMTP_PORT || "587");
const smtpFrom = process.env.SMTP_FROM || "Tejomarg Job Portal <noreply@tejomarg.com>";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
});

export async function sendApplicationStatusEmail(
  candidateEmail: string,
  candidateName: string,
  jobTitle: string,
  status: string,
  companyName: string
) {
  const subject = `Application Status Update: ${jobTitle} at ${companyName}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563eb;">Application Status Update</h2>
      <p>Hello ${candidateName},</p>
      <p>We are writing to inform you that your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated.</p>
      <p style="font-size: 16px;">New Status: <span style="font-weight: bold; text-transform: capitalize; color: #2563eb; background-color: #eff6ff; padding: 4px 8px; border-radius: 4px;">${status}</span></p>
      <p>Please log in to your Candidate Dashboard to track details or coordinate next steps.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">This is an automated notification from Tejomarg Job Portal.</p>
    </div>
  `;

  if (!smtpUser) {
    console.log(`[MAIL MOCK] To: ${candidateEmail} | Subject: ${subject} | Status: ${status}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: candidateEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendRecruiterAppliedEmail(
  recruiterEmail: string,
  recruiterName: string,
  candidateName: string,
  jobTitle: string
) {
  const subject = `New Application Received: ${jobTitle}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563eb;">New Candidate Application</h2>
      <p>Hello ${recruiterName},</p>
      <p>A new candidate, <strong>${candidateName}</strong>, has applied for your job opening for <strong>${jobTitle}</strong>.</p>
      <p>Please log in to your Recruiter Hub dashboard to review their resume and complete status moderation.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">This is an automated notification from Tejomarg Job Portal.</p>
    </div>
  `;

  if (!smtpUser) {
    console.log(`[MAIL MOCK] To: ${recruiterEmail} | Subject: ${subject} | Candidate: ${candidateName}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: recruiterEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
