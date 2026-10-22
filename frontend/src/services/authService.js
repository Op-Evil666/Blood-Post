import { api } from "./api";

const registerUser = async (registerData) => {
  const response = await api.post("/auth/register", registerData);
  return response.data;
};

const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

const verifyUser = async (otpData) => {
  const response = await api.post("/auth/verify-otp", otpData);
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

export {
  registerUser,
  loginUser,
  verifyUser,
  refreshUser,
  logoutUser,
  getMe,
  getMyPosts,
  getMyComments,
};