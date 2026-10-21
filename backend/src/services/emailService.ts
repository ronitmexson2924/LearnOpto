import nodemailer from "nodemailer";

export interface SendLoginAlertOptions {
  toEmail: string;
  userName?: string;
  loginTime?: Date;
  userAgent?: string;
  ipAddress?: string;
}

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends a security login notification email to the user.
 * Runs asynchronously and catches all internal errors to guarantee
 * auth API routes are never interrupted or delayed by email operations.
 */
export const sendLoginAlertEmail = async (options: SendLoginAlertOptions): Promise<void> => {
  const { toEmail, userName, loginTime = new Date(), userAgent = "Unknown Device", ipAddress = "Unknown IP" } = options;

  try {
    const transporter = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || `"LearnOpto Security" <no-reply@learnopto.com>`;
    const formattedTime = loginTime.toUTCString();
    const displayName = userName || toEmail.split("@")[0];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
          .content { padding: 30px 25px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; }
          .alert-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .details-table td { padding: 10px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
          .details-table td.label { font-weight: 600; color: #6b7280; width: 35%; }
          .details-table td.value { color: #111827; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LearnOpto Security Alert</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${displayName},</div>
            <p>We noticed a successful sign-in to your LearnOpto account.</p>
            
            <div class="alert-box">
              <strong>Account Sign-In Confirmed</strong>
            </div>

            <table class="details-table">
              <tr>
                <td class="label">Date & Time</td>
                <td class="value">${formattedTime}</td>
              </tr>
              <tr>
                <td class="label">IP Address</td>
                <td class="value">${ipAddress}</td>
              </tr>
              <tr>
                <td class="label">Browser / Device</td>
                <td class="value">${userAgent}</td>
              </tr>
            </table>

            <p style="margin-top: 25px; font-size: 13px; color: #6b7280;">
              If this was you, no action is required. If you did not authorize this login, please secure your account immediately.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} LearnOpto. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    if (!transporter) {
      console.log(`\n[EMAIL SERVICE - DRY RUN MODE]`);
      console.log(`SMTP credentials not set in backend/.env.`);
      console.log(`Login alert email WOULD be sent to: ${toEmail}`);
      console.log(`Details: User=${displayName}, Time=${formattedTime}, Device=${userAgent}, IP=${ipAddress}\n`);
      return;
    }

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: "Security Notification: New Sign-In to LearnOpto",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Login notification email sent successfully to ${toEmail}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[EMAIL SERVICE ERROR] Failed to send login alert email to ${toEmail}:`, error);
  }
};
