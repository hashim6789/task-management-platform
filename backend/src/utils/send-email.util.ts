import { transporter } from "@/configs";
import { env } from "@/configs/env.config";

export const sendResetPasswordEmail = async (email: string, token: string) => {
  try {
    const resetPasswordUrl = `${env.RESET_PASS_URL}?token=${token}`;

    const mailOptions = {
      from: env.SENDER_EMAIL,
      to: email,
      subject: "Reset Your Password - Task Manager",
      html: `
            
                <h1> Password Reset Request </h1>
                <p> You have requested to reset your password. Click the link below to proceed :  </p>
                <p> <a href="${resetPasswordUrl}" target="_blank" >Reset Password </a> </p>
                <p>If you did not request this, you can ignore this email.</p><br />
                <p>~ Task Manager</p>
            
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully", info.response);
  } catch (error) {
    console.error("Error sendResetPasswordEmail", error);
    throw new Error("Error sending reset pass email");
  }
};

export const sendCredentialsEmail = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    // console.log(email, username, password, env.SENDER_EMAIL);
    const mailOptions = {
      from: env.SENDER_EMAIL,
      to: email,
      subject: "Your Task Manager Account Credentials",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
            }
            .header img {
              max-width: 150px;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .credentials {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .credentials p {
              margin: 10px 0;
              font-size: 16px;
            }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              font-size: 16px;
              margin: 20px 0;
              text-align: center;
            }
            .warning {
              color: #d9534f;
              font-weight: bold;
              margin: 15px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #777;
            }
            @media only screen and (max-width: 600px) {
              .container {
                padding: 10px;
              }
              .button {
                width: 100%;
                box-sizing: border-box;
              }
            }
          </style>
        </head>
        <body>
        
          <div class="container">
            <div class="header">
              <img src="https://via.placeholder.com/150x50?text=Task Manager+Logo" alt="Task Manager Logo" />
            </div>
            <div class="content">
              <h2>Welcome to Task Manager!</h2>
              <p>Your account has been created successfully. Below are your login credentials:</p>
              <div class="credentials">
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Temporary Password:</strong> ${password}</p>
              </div>
              <p class="warning">Do not share these credentials with anyone. For security, please change your password after logging in.</p>
              <a href="${env.CLIENT_ORIGIN}" class="button">Log In to Your Account</a>
              <p>If you did not request this account, please contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>~ Task Manager Team</p>
              <p><a href="https://yourapp.com/support">Contact Support</a> | <a href="https://yourapp.com">Visit Task Manager</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Credentials email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending credentials email:", err);
    throw new Error("Error sending credentials email");
  }
};
