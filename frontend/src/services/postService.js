import { api } from "./api";

const getPosts = async (params = {}) => {
  const response = await api.get("/posts", { params });
  return response.data;
};

const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

const createPost = async (postData) => {
  const response = await api.post("/posts", postData);
  return response.data;
};

const updatePost = async (postId, postData) => {
  const response = await api.put(`/posts/${postId}`, postData);
  return response.data;
};

const publishPost = async (postId) => {
  const response = await api.patch(`/posts/${postId}/publish`);
  return response.data;
};

const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

export {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  publishPost,
  deletePost,
};
