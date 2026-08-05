import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "school_management_secret_2026";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Simple authentication check or demo validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const token = jwt.sign(
    { id: "admin-1", email: email, role: "admin" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    success: true,
    token,
    user: {
      id: "admin-1",
      email: email,
      name: "School Administrator",
      role: "admin",
    },
  });
};

export const adminLogout = async (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  return res.json({
    success: true,
    message: `Password reset link has been sent to ${email || "your email"}`,
  });
};

export const resetPassword = async (req, res) => {
  return res.json({
    success: true,
    message: "Password reset successful. You can now log in with your new password.",
  });
};
