import { api } from "./api";

const getPostComments = async (postId) => {
  const response = await api.get(
    `/post/${postId}/comments`,
    { withCredentials: true }
  );

  return response.data;
};

const createComment = async (postId, commentData) => {
  const response = await api.post(
    `/post/${postId}/comment`,
    commentData,
    { withCredentials: true }
  );

  return response.data;
};

const updateComment = async (postId, commentId, commentData) => {
  const response = await api.put(
    `/post/${postId}/comments/${commentId}`,
    commentData,
    { withCredentials: true }
  );

  return response.data;
};

const deleteComment = async (postId, commentId) => {
  const response = await api.delete(
    `/post/${postId}/comments/${commentId}`,
    { withCredentials: true }
  );

  return response.data;
};

const getUserComments = async () =>{
  const response = await api.get(`/users/comments`, { withCredentials: true });
  return response.data;
}

export {
  getPostComments,
  getUserComments,
  createComment,
  updateComment,
  deleteComment,
};
