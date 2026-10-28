import { api } from "./api";

export const getOwnerDashboardStats = async () => {
  const response = await api.get("/owner/dashboard/stats");
  return response.data;
};

export const getVerifiedUsers = async ({
  page = 1,
  limit = 10,
  name = "",
} = {}) => {
  const response = await api.get("/owner/users", {
    params: {
      page,
      limit,
      ...(name.trim() ? { name: name.trim() } : {}),
    },
  });

  return response.data;
};

export const promoteAdmin = async (userId) => {
  const response = await api.patch(
    `/owner/role/${encodeURIComponent(userId)}/promote`
  );
  return response.data;
};

export const demoteAdmin = async (userId) => {
  const response = await api.patch(
    `/owner/role/${encodeURIComponent(userId)}/demote`
  );
  return response.data;
};
