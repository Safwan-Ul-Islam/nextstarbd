import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(
  email: string,
  otp: string,
  name: string,
  type: "signup" | "password_reset" = "signup"
) {
  const isReset = type === "password_reset";
  const verifyUrl = `https://nexstarbd.com/login?email=${encodeURIComponent(email)}&otp=${otp}&type=${type}`;

  await resend.emails.send({
    from: "NexStarBD <noreply@nexstarbd.com>",
    to: email,
    subject: isReset
      ? `${otp} is your NexStarBD password reset code`
      : `${otp} is your NexStarBD verification code`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a">

        <!-- Header -->
        <tr>
          <td style="background:#141414;padding:20px 32px;border-bottom:2px solid #F42A41;text-align:center">
            <img src="https://nexstarbd.com/banners/lnsbd.png" alt="NexStarBD" height="52" style="display:inline-block;vertical-align:middle;transform:translateY(-4px)" />
            <span style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:0.5px;vertical-align:middle;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif">
              NexStar<span style="color:#F42A41">B</span><span style="color:#006A4E">D</span>
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 32px">
            <p style="margin:0 0 6px 0;font-size:18px;font-weight:600;color:#f3f4f6">Hi ${name || "there"},</p>
            <p style="margin:0 0 28px 0;font-size:14px;color:#9ca3af;line-height:1.6">
              ${isReset
                ? `Use the code below to reset your password. This code expires in <strong style="color:#f3f4f6">10 minutes</strong>.`
                : `Use the code below to verify your email address and complete your registration. This code expires in <strong style="color:#f3f4f6">10 minutes</strong>.`
              }
            </p>

            <!-- OTP Box -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#0f0f0f;border:1px solid #2a2a2a;border-radius:12px;padding:28px 16px;text-align:center">
                  <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:3px;color:#6b7280;text-transform:uppercase">${isReset ? "Password Reset Code" : "Verification Code"}</p>
                  <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:12px;color:#F42A41;font-variant-numeric:tabular-nums">${otp}</p>
                </td>
              </tr>
            </table>

            <!-- Verify button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">
              <tr>
                <td align="center">
                  <a href="${verifyUrl}"
                    style="display:inline-block;background:#F42A41;color:#ffffff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif">
                    ${isReset ? "Reset Password →" : "Verify Email →"}
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:24px 0 0 0;font-size:12px;color:#4b5563;text-align:center;line-height:1.6">
              Button not working? Copy and enter the code manually on the website.
            </p>

            <p style="margin:20px 0 0 0;font-size:13px;color:#6b7280;line-height:1.6">
              If you didn't ${isReset ? "request a password reset" : "create an account"} on NexStarBD, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#141414;padding:16px 32px;border-top:1px solid #2a2a2a;text-align:center">
            <p style="margin:0;font-size:12px;color:#4b5563">© 2026 NexStarBD · <a href="https://nexstarbd.com" style="color:#F42A41;text-decoration:none">nexstarbd.com</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });
}
