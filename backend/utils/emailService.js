import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

/**
 * Returns a configured Nodemailer transporter dynamically reading latest env variables.
 */
function getTransporter() {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends a generic notification email with both HTML and plain text support.
 */
export async function sendEmail({ to, subject, text, html }) {
  const user = process.env.EMAIL_USER?.trim();
  const transporter = getTransporter();

  if (!transporter || !user) {
    console.warn(`ℹ️ Email skipped for <${to}>: EMAIL_USER or EMAIL_PASS not configured in .env`);
    return { skipped: true };
  }

  console.log(`📤 Sending email to <${to}>: "${subject}"`);
  try {
    const info = await transporter.sendMail({
      from: `"Auto Resume Shortlister" <${user}>`,
      to,
      subject,
      text,
      html: html || `<p>${text.replace(/\n/g, "<br>")}</p>`,
    });

    console.log(`✅ Email sent successfully to <${to}> (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email delivery failed for <${to}>:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Legacy wrapper for backward compatibility.
 */
export async function sendStatusEmail(to, subject, text, html) {
  return sendEmail({ to, subject, text, html });
}

/**
 * Sends confirmation email to candidate and alert to recruiter when a job application is submitted.
 */
export async function sendApplicationSubmittedEmails({
  candidateEmail,
  candidateName,
  jobTitle,
  recruiterEmail,
}) {
  const promises = [];

  // 1. Email to Candidate
  if (candidateEmail) {
    const candidateSubject = `Application Received: ${jobTitle}`;
    const candidateText = `Hi ${candidateName || "Candidate"},

Thank you for applying for the position of "${jobTitle}".
Your application and resume have been received by the hiring team. You will be notified of any updates regarding your application status.

Best regards,
The Auto Resume Shortlister Team`;

    const candidateHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #09090b; margin-top: 0;">Application Received</h2>
        <p>Hi <strong>${candidateName || "Candidate"}</strong>,</p>
        <p>Thank you for applying for the position of <strong>${jobTitle}</strong>.</p>
        <p>Your resume and details have been successfully delivered to the hiring team. Our automated shortlisting system will evaluate your qualifications, and you will receive updates as your application progresses.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a;">
          Auto Resume Shortlister • Automated Talent Matching
        </div>
      </div>
    `;

    promises.push(
      sendEmail({
        to: candidateEmail,
        subject: candidateSubject,
        text: candidateText,
        html: candidateHtml,
      })
    );
  }

  // 2. Email to Recruiter
  if (recruiterEmail) {
    const recruiterSubject = `New Applicant for ${jobTitle}: ${candidateName || "Candidate"}`;
    const recruiterText = `Hello,

A new application has been submitted for your job listing: "${jobTitle}".
Candidate: ${candidateName || "Candidate"} (${candidateEmail})

You can review and rank applicants in your Recruiter Dashboard.

– Auto Resume Shortlister`;

    const recruiterHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #09090b; margin-top: 0;">New Applicant Alert</h2>
        <p>A new application has been submitted for your position: <strong>${jobTitle}</strong>.</p>
        <ul style="line-height: 1.6; color: #3f3f46;">
          <li><strong>Candidate Name:</strong> ${candidateName || "Candidate"}</li>
          <li><strong>Email:</strong> ${candidateEmail}</li>
        </ul>
        <p>Log in to your Recruiter Dashboard to review the parsed resume and compute AI relevance scores.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a;">
          Auto Resume Shortlister • Recruiter Studio
        </div>
      </div>
    `;

    promises.push(
      sendEmail({
        to: recruiterEmail,
        subject: recruiterSubject,
        text: recruiterText,
        html: recruiterHtml,
      })
    );
  }

  return Promise.all(promises);
}
