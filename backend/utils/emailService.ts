import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

// Create transporter with timeout configuration
const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
  });
};

const transporter = createTransporter();

// Verify email configuration on startup
if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.error("❌ SMTP configuration error:", error.message);
    } else {
      console.log("✅ Email service ready (SMTP)");
    }
  });
} else {
  console.log("⚠️  Email service disabled - No SMTP credentials configured");
}

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (
  email: string,
  otp: string,
  name: string
): Promise<boolean> => {
  // If email is not configured, log and return true to not block registration
  if (!transporter) {
    console.log(
      `⚠️  Email not configured - OTP would be sent to ${email}: ${otp}`
    );
    return true; // Return true to not block the registration flow
  }

  try {
    const htmlContent = `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to PlanIt</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding: 30px 0;">
      <tr>
        <td align="center">

          <!-- MAIN CONTAINER -->
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.08);">

            <!-- HEADER -->
            <tr>
              <td style="background-color:#4f46e5; padding: 25px; text-align:center;">
                <img src="https://yourdomain.com/logo.png" alt="PlanIt Logo" width="120" style="display:block; margin:0 auto 10px;">
                <h1 style="color:#ffffff; margin:0; font-size:26px;">Welcome to PlanIt 🎉</h1>
                <p style="color:#dbeafe; margin-top:8px; font-size:14px;">Your events. Smarter. Faster.</p>
              </td>
            </tr>

            <!-- BANNER IMAGE -->
            <tr>
              <td>
                <img src="https://yourdomain.com/banner.jpg" alt="PlanIt Banner" width="600" style="display:block; max-width:100%;">
              </td>
            </tr>

            <!-- BODY CONTENT -->
            <tr>
              <td style="padding: 30px; color:#333333;">

                <h2 style="color:#4f46e5; margin-top:0;">Hello ${name},</h2>

                <p style="font-size:16px; line-height:1.6;">
                  Welcome to <strong>PlanIt</strong>! We're excited to have you join our platform where you can easily discover events, book service providers, and manage everything in one place.
                </p>

                <p style="font-size:16px; line-height:1.6;">
                  To complete your registration, please confirm your email address using the verification code below:
                </p>

                <!-- OTP BOX -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5ff; border:2px dashed #4f46e5; border-radius:8px; margin:25px 0;">
                  <tr>
                    <td align="center" style="padding:20px;">
                      <p style="margin:0; font-weight:bold; font-size:14px; color:#333;">Your Verification Code</p>
                      <p style="font-size:36px; font-weight:bold; letter-spacing:8px; margin:10px 0; color:#4f46e5;">
                        ${otp}
                      </p>
                      <p style="margin:0; font-size:13px; color:#666;">This code expires in 10 minutes</p>
                    </td>
                  </tr>
                </table>

                <p style="font-size:15px; line-height:1.6;">
                  If you did not create a PlanIt account, you can safely ignore this email.
                </p>

                <p style="margin-top:25px; font-size:15px;">
                  Warm regards,<br>
                  <strong>The PlanIt Team</strong>
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background-color:#f9fafb; padding: 20px; text-align:center;">
                <p style="margin:0; font-size:13px; color:#666;">
                  © ${new Date().getFullYear()} PlanIt Events. All rights reserved.
                </p>
                <p style="margin-top:8px; font-size:12px; color:#999;">
                  Nairobi, Kenya
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
`;

    await transporter.sendMail({
      from: `"PlanIt Events" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email - PlanIt",
      html: htmlContent,
    });

    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
  } catch (error: any) {
    console.error("Error sending OTP email:", error.message || error);
    // Don't throw error - just log it and return false
    // This prevents the entire registration from failing
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  role: string
): Promise<boolean> => {
  // If email is not configured, log and return true
  if (!transporter) {
    console.log(
      `⚠️  Email not configured - Welcome email would be sent to ${email}`
    );
    return true;
  }

  try {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              border-radius: 10px;
              padding: 40px;
              color: white;
            }
            .logo {
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 30px;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              color: #333;
            }
            .btn {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 600;
            }
            .feature {
              margin: 15px 0;
              padding-left: 25px;
              position: relative;
            }
            .feature:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #10b981;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: rgba(255,255,255,0.8);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎉 PlanIt</div>
            <div class="content">
              <h1 style="color: #10b981; margin-top: 0;">Welcome to PlanIt, ${name}!</h1>
              <p style="font-size: 16px;">We're thrilled to have you join our community${
                role === "vendor"
                  ? " of professional event vendors"
                  : " of event planners"
              }!</p>
              
              ${
                role === "vendor"
                  ? `
              <h3 style="color: #333; margin-top: 30px;">As a Vendor, you can:</h3>
              <div class="feature">Showcase your services to thousands of potential clients</div>
              <div class="feature">Manage bookings and communicate with clients</div>
              <div class="feature">Build your reputation with reviews and ratings</div>
              <div class="feature">Grow your business with our platform</div>
              `
                  : `
              <h3 style="color: #333; margin-top: 30px;">As a Client, you can:</h3>
              <div class="feature">Browse verified vendors across Kenya</div>
              <div class="feature">Compare services and read reviews</div>
              <div class="feature">Book and manage your events effortlessly</div>
              <div class="feature">Connect directly with professionals</div>
              `
              }
              
              <div style="text-align: center;">
                <a href="${
                  process.env.FRONTEND_URL || "https://plan-it-delta.vercel.app"
                }/login" class="btn">Get Started</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                If you have any questions, our support team is here to help at 
                <a href="mailto:support@planit.ke" style="color: #10b981;">support@planit.ke</a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PlanIt Events. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    await transporter.sendMail({
      from: `"PlanIt Events" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to PlanIt! 🎉",
      html: htmlContent,
    });

    console.log(`✅ Welcome email sent successfully to ${email}`);
    return true;
  } catch (error: any) {
    console.error("Error sending welcome email:", error.message || error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  name: string
): Promise<boolean> => {
  // If email is not configured, log and return true
  if (!transporter) {
    console.log(
      `⚠️  Email not configured - Password reset would be sent to ${email}`
    );
    return true;
  }

  try {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    const htmlContent = `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:32px; font-weight:bold;">🔐 PlanIt</h1>
                <p style="color:rgba(255,255,255,0.95); margin:10px 0 0 0; font-size:16px;">Password Reset Request</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color:#1f2937; margin-top:0; font-size:24px;">Hi ${name},</h2>
                <p style="color:#4b5563; font-size:16px; line-height:1.6; margin: 20px 0;">
                  We received a request to reset your password for your PlanIt account. Click the button below to create a new password:
                </p>
                
                <div style="text-align:center; margin: 35px 0;">
                  <a href="${resetUrl}" style="display:inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color:#ffffff; text-decoration:none; padding:16px 40px; border-radius:8px; font-weight:bold; font-size:16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                    Reset Password
                  </a>
                </div>
                
                <p style="color:#6b7280; font-size:14px; line-height:1.6; margin: 25px 0;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="background-color:#f3f4f6; padding:12px; border-radius:6px; word-break:break-all; font-size:13px; color:#4b5563;">
                  ${resetUrl}
                </p>
                
                <div style="background-color:#f0fdf4; border-left:4px solid #10b981; padding:15px; margin:25px 0; border-radius:4px;">
                  <p style="color:#065f46; margin:0; font-size:14px; line-height:1.5;">
                    ⚠️ <strong>Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                  </p>
                </div>
                
                <p style="color:#6b7280; font-size:14px; line-height:1.6; margin-top:30px;">
                  Need help? Contact us at <a href="mailto:support@planit.ke" style="color:#10b981; text-decoration:none;">support@planit.ke</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f9fafb; padding:20px 30px; text-align:center; border-top:1px solid #e5e7eb;">
                <p style="color:#9ca3af; font-size:12px; margin:0;">
                  © ${new Date().getFullYear()} PlanIt Events. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `;

    await transporter.sendMail({
      from: `"PlanIt Events" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request - PlanIt",
      html: htmlContent,
    });

    console.log(`✅ Password reset email sent successfully to ${email}`);
    return true;
  } catch (error: any) {
    console.error(
      "Error sending password reset email:",
      error.message || error
    );
    // Don't throw error - just log it and return false
    return false;
  }
};

export default transporter;
