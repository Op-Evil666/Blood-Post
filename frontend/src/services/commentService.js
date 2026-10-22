import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/comments";

const getPostComments = async (postId) => {
  const response = await axios.get(
    `${API_URL}/post/${postId}/comments`,
    { withCredentials: true }
  );

  return response.data;
};

const createComment = async (postId, commentData) => {
  const response = await axios.post(
    `${API_URL}/post/${postId}/comment`,
    commentData,
    { withCredentials: true }
  );

  return response.data;
};

const updateComment = async (postId, commentId, commentData) => {
  const response = await axios.put(
    `${API_URL}/post/${postId}/comments/${commentId}`,
    commentData,
    { withCredentials: true }
  );

  return response.data;
};

const deleteComment = async (postId, commentId) => {
  const response = await axios.delete(
    `${API_URL}/post/${postId}/comments/${commentId}`,
    { withCredentials: true }
  );

  return response.data;
};

const getUserComments = async (userId) =>{
  const response = await axios.get(`${API_URL}/users/${userId}/comments`, { withCredentials: true });
  return response.data;
}

export {
  getPostComments,
  getUserComments,
  createComment,
  updateComment,
  deleteComment,
};
