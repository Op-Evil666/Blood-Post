
import { api } from "./api";

const registerUser = async (registerData) => {
  const response = await api.post("/auth/register", registerData);
  return response.data;
};

const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

const verifyUser = async (userId, otp) => {
  const response = await api.post(
    `/auth/verify-otp/${encodeURIComponent(userId)}`,
    { otp }
  );

  return response.data;
};

const resendVerificationOtp = async (userId) => {
  const response = await api.post(
    `/auth/resend-otp/${encodeURIComponent(userId)}`
  );

  return response.data;
};

const requestVerificationOtp = async (email) => {
  const response = await api.post("/auth/resend-verification", {
    email,
  });

  return response.data;
};

const refreshUser = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

const getMyPosts = async () => {
  const response = await api.get("/auth/me/posts");
  return response.data;
};

const getMyComments = async () => {
  const response = await api.get("/auth/me/comments");
  return response.data;
};

const verifyEmailOtp = async (email, otp) => {
    const response = await api.post("/auth/verify-email-otp", {
        email,
        otp,
    });

    return response.data;
};

const deleteProfile = async () =>{
  const response = await api.delete("/auth/me");
  return response.data;
}

export {
  registerUser,
  loginUser,
  verifyUser,
  resendVerificationOtp,
  requestVerificationOtp,
  refreshUser,
  logoutUser,
  getMe,
  getMyPosts,
  getMyComments,
  verifyEmailOtp,
  deleteProfile,
};
