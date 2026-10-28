import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import {
  getOwnerDashboardStats,
  getVerifiedUsers,
  promoteAdmin,
  demoteAdmin,
} from "../services/ownerService";

const PAGE_SIZE = 10;

const panelClass =
  "rounded-xl border border-[#57202D] bg-[#16080D] shadow-[0_8px_28px_rgba(0,0,0,0.25)]";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(value ?? 0);

const capitalizeFirstLetter = (value) => {
  if (typeof value !== "string" || value.length === 0) {
    return value ?? "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatDate = (value) => {
  if (!value) return "Never";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function StatCard({ label, value, description, symbol }) {
  return (
    <article
      className={`${panelClass} group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-[#FF526B]/70`}
    >
      <div
        aria-hidden="true"
        className="absolute -right-5 -top-7 h-24 w-24 rounded-full bg-[#B51F3B]/10 blur-2xl transition group-hover:bg-[#B51F3B]/20"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#B7A7AC]">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-[#F8E9ED]">
            {value === undefined ? "—" : formatNumber(value)}
          </p>
          <p className="mt-2 text-xs text-[#B7A7AC]">{description}</p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#57202D] bg-[#250B13] text-xl text-[#FF637C]">
          {symbol}
        </span>
      </div>
    </article>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-[#B51F3B]/60 bg-[#350B16] p-4 text-sm text-[#FFB1BE]"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md border border-[#FF637C]/50 px-3 py-2 font-semibold text-[#FF9AAA] hover:bg-[#571020]"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function OwnerDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchName, setSearchName] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [roleConfirmation, setRoleConfirmation] = useState(null);

  const statsQuery = useQuery({
    queryKey: ["owner-dashboard-stats"],
    queryFn: getOwnerDashboardStats,
    staleTime: 30_000,
    retry: 1,
  });

  const usersQuery = useQuery({
    queryKey: ["owner-users", page, searchName],
    queryFn: () =>
      getVerifiedUsers({
        page,
        limit: PAGE_SIZE,
        name: searchName,
      }),
    staleTime: 15_000,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, action }) =>
      action === "promote"
        ? promoteAdmin(userId)
        : demoteAdmin(userId),

    onMutate: () => {
      setActionMessage("");
      setActionError("");
    },

    onSuccess: async (_, variables) => {
      setActionMessage(
        variables.action === "promote"
          ? "User promoted to Admin successfully."
          : "Admin demoted to User successfully."
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["owner-dashboard-stats"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["owner-users"],
        }),
      ]);
    },

    onError: (error) => {
      setActionError(
        error.response?.data?.message ||
          "The role change failed. Please try again."
      );
    },
  });

  const stats = statsQuery.data?.stats;
  const userResult = usersQuery.data;
  const users = userResult?.users ?? [];
  const pagination = userResult?.pagination;

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearchName(searchInput.trim());
    setActionMessage("");
    setActionError("");
  };

  const handleRoleChange = (targetUser, action) => {
  setRoleConfirmation({
    targetUser,
    action,
  });
};

  return (
    <main className="min-h-screen bg-[#100609] px-4 py-8 text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Dashboard heading */}
        <header className="relative overflow-hidden rounded-2xl border border-[#57202D] bg-gradient-to-br from-[#260B14] via-[#16080D] to-[#100609] p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#B51F3B]/15 blur-3xl"
          />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF637C]">
                Blood Post / Control Center
              </p>

              <h1 className="mt-3 font-horror-logo text-3xl text-[#F8E9ED] sm:text-4xl">
                Owner Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B7A7AC]">
                Monitor your platform, manage user roles, and keep the
                darkness under control.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-[#57202D] bg-[#100609]/80 px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#350B16] text-xl text-[#FF637C]">
                ☠
              </span>
              <div>
                <p className="text-xs text-[#B7A7AC]">Signed in as</p>
                <p className="font-bold text-[#FF9AAA]">
                  {capitalizeFirstLetter(user?.name || "Owner")}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-[#B7A7AC]">
                  Platform Owner
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section aria-labelledby="overview-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="overview-heading"
                className="text-xl font-bold text-[#F8E9ED]"
              >
                Platform Overview
              </h2>
              <p className="mt-1 text-sm text-[#B7A7AC]">
                Live counts from your database.
              </p>
            </div>

            <button
              type="button"
              onClick={() => statsQuery.refetch()}
              disabled={statsQuery.isFetching}
              className="rounded-lg border border-[#57202D] px-4 py-2 text-sm font-semibold text-[#FF9AAA] transition hover:bg-[#350B16] disabled:opacity-50"
            >
              {statsQuery.isFetching ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>

          {statsQuery.isPending ? (
            <div className={`${panelClass} p-6 text-sm text-[#B7A7AC]`}>
              Loading platform statistics...
            </div>
          ) : statsQuery.isError ? (
            <ErrorMessage
              message={
                statsQuery.error?.response?.data?.message ||
                "Could not load dashboard statistics."
              }
              onRetry={() => statsQuery.refetch()}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Total Users"
                value={stats?.users?.total}
                description="All registered accounts"
                symbol="♟"
              />
              <StatCard
                label="Verified Users"
                value={stats?.users?.verified}
                description="Accounts with verified email"
                symbol="✓"
              />
              <StatCard
                label="Unverified Users"
                value={stats?.users?.unverified}
                description="Awaiting email verification"
                symbol="◷"
              />
              <StatCard
                label="Total Posts"
                value={stats?.posts?.totalPosts}
                description="Published posts and drafts"
                symbol="▤"
              />
              <StatCard
                label="Published Posts"
                value={stats?.posts?.totalPublishedPosts}
                description="Posts visible to readers"
                symbol="✎"
              />
              <StatCard
                label="Private Drafts"
                value={stats?.posts?.totalDraftPosts}
                description="Draft count only; no draft content shown"
                symbol="▣"
              />
              <StatCard
                label="Total Comments"
                value={stats?.comments?.total}
                description="Comments recorded on the platform"
                symbol="☷"
              />
            </div>
          )}
        </section>

        {/* User management */}
        <section
          aria-labelledby="users-heading"
          className={`${panelClass} overflow-hidden`}
        >
          <div className="border-b border-[#57202D] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h2
                  id="users-heading"
                  className="text-xl font-bold text-[#F8E9ED]"
                >
                  User & Role Management
                </h2>
                <p className="mt-1 text-sm text-[#B7A7AC]">
                  Find verified accounts and manage Admin privileges.
                </p>
              </div>

              <form
                onSubmit={handleSearch}
                className="flex w-full gap-2 sm:max-w-md"
              >
                <label htmlFor="owner-user-search" className="sr-only">
                  Search users by name
                </label>

                <input
                  id="owner-user-search"
                  type="search"
                  maxLength={50}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by name..."
                  className="min-w-0 flex-1 rounded-lg border border-[#57202D] bg-[#100609] px-4 py-2.5 text-sm text-[#F8E9ED] outline-none placeholder:text-[#806C73] focus:border-[#FF526B] focus:ring-1 focus:ring-[#FF526B]"
                />

                <button
                  type="submit"
                  className="rounded-lg border border-[#D93650] bg-[#A50928] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C50C32]"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {actionMessage && (
            <div
              role="status"
              className="mx-5 mt-5 rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-300 sm:mx-6"
            >
              {actionMessage}
            </div>
          )}

          {actionError && (
            <div className="mx-5 mt-5 sm:mx-6">
              <ErrorMessage message={actionError} />
            </div>
          )}

          {usersQuery.isPending ? (
            <div className="p-8 text-sm text-[#B7A7AC]">
              Loading users...
            </div>
          ) : usersQuery.isError ? (
            <div className="p-5 sm:p-6">
              <ErrorMessage
                message={
                  usersQuery.error?.response?.data?.message ||
                  "Could not load users."
                }
                onRetry={() => usersQuery.refetch()}
              />
            </div>
          ) : (
            <>
              {usersQuery.isFetching && (
                <p className="px-5 pt-4 text-xs text-[#B7A7AC] sm:px-6">
                  Updating user list...
                </p>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="bg-[#210A12] text-xs uppercase tracking-wider text-[#B7A7AC]">
                    <tr>
                      <th scope="col" className="px-5 py-4 font-semibold">
                        User
                      </th>
                      <th scope="col" className="px-5 py-4 font-semibold">
                        Role
                      </th>
                      <th scope="col" className="px-5 py-4 font-semibold">
                        Verification
                      </th>
                      <th scope="col" className="px-5 py-4 font-semibold">
                        Registered
                      </th>
                      <th scope="col" className="px-5 py-4 font-semibold">
                        Last Login
                      </th>
                      <th scope="col" className="px-5 py-4 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#35131D]">
                    {users.map((targetUser) => {
                      const isAdmin = targetUser.role === "admin";
                      const isOwner = targetUser.role === "owner";

                      return (
                        <tr
                          key={targetUser._id || targetUser.id}
                          className="transition hover:bg-[#210A12]/60"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-[#F8E9ED]">
                              {capitalizeFirstLetter(targetUser.name)}
                            </p>
                            <p className="mt-1 text-xs text-[#806C73]">
                              ID: {String(targetUser._id || targetUser.id).slice(-8)}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                                isOwner
                                  ? "border-[#FF637C]/40 bg-[#350B16] text-[#FF9AAA]"
                                  : isAdmin
                                  ? "border-amber-700/50 bg-amber-950/30 text-amber-300"
                                  : "border-[#57202D] bg-[#100609] text-[#B7A7AC]"
                              }`}
                            >
                              {targetUser.role}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={
                                targetUser.isVerified
                                  ? "text-emerald-300"
                                  : "text-amber-300"
                              }
                            >
                              {targetUser.isVerified
                                ? "Verified"
                                : "Unverified"}
                            </span>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap text-[#B7A7AC]">
                            {formatDate(targetUser.createdAt)}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap text-[#B7A7AC]">
                            {formatDate(targetUser.lastLogin)}
                          </td>

                          <td className="px-5 py-4">
                            {isOwner ? (
                              <span className="text-xs text-[#806C73]">
                                Protected
                              </span>
                            ) : isAdmin ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRoleChange(targetUser, "demote")
                                }
                                disabled={roleMutation.isPending}
                                className="whitespace-nowrap rounded-md border border-amber-700/60 px-3 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-950/50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {roleMutation.isPending
                                  ? "Processing..."
                                  : "Demote to User"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRoleChange(targetUser, "promote")
                                }
                                disabled={roleMutation.isPending}
                                className="whitespace-nowrap rounded-md border border-[#FF526B]/60 px-3 py-2 text-xs font-bold text-[#FF9AAA] transition hover:bg-[#350B16] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {roleMutation.isPending
                                  ? "Processing..."
                                  : "Promote to Admin"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12 text-center text-[#B7A7AC]"
                        >
                          {searchName
                            ? "No verified users match that name."
                            : "No verified users found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-[#57202D] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-[#B7A7AC]">
                  Page {pagination?.page ?? page} of{" "}
                  {pagination?.totalPages ?? 0}
                  {" · "}
                  {formatNumber(pagination?.totalUsers)} verified users
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={
                      !pagination?.hasPreviousPage ||
                      usersQuery.isFetching ||
                      roleMutation.isPending
                    }
                    className="rounded-lg border border-[#57202D] px-4 py-2 text-sm font-semibold text-[#FF9AAA] transition hover:bg-[#350B16] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={
                      !pagination?.hasNextPage ||
                      usersQuery.isFetching ||
                      roleMutation.isPending
                    }
                    className="rounded-lg border border-[#57202D] px-4 py-2 text-sm font-semibold text-[#FF9AAA] transition hover:bg-[#350B16] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <footer className="pb-4 text-center text-xs text-[#806C73]">
          Blood Post Control Center · Handle privileges carefully.
        </footer>
      </div>
      {roleConfirmation && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-xl border border-[#8B2635] bg-[#16080D] p-6 shadow-[0_0_35px_rgba(139,38,53,0.25)]">
      <h2 className="text-xl font-bold text-[#F8E9ED]">
        {roleConfirmation.action === "promote"
          ? "Promote User?"
          : "Demote Admin?"}
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#C7ADB5]">
        Are you sure you want to{" "}
        {roleConfirmation.action === "promote" ? "promote" : "demote"}{" "}
        <span className="font-semibold text-[#E85D75]">
          {capitalizeFirstLetter(roleConfirmation.targetUser.name)}
        </span>
        {roleConfirmation.action === "promote"
          ? " to Admin?"
          : " to a regular User?"}
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setRoleConfirmation(null)}
          className="rounded-lg border border-[#57202D] px-4 py-2 text-sm text-[#C7ADB5] transition hover:bg-[#2A1018]"
        >
          Cancel
        </button>

        <button
  type="button"
  disabled={roleMutation.isPending}
  onClick={async () => {
    const { targetUser, action } = roleConfirmation;

    try {
      await roleMutation.mutateAsync({
        userId: targetUser._id || targetUser.id,
        action,
      });

      setRoleConfirmation(null);
    } catch {
      // Keep the modal open if the operation fails.
      // roleMutation.onError already displays the error.
    }
  }}
  className="rounded-lg bg-[#8B2635] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#A83245] disabled:cursor-not-allowed disabled:opacity-50"
>
  {roleMutation.isPending ? "Processing..." : "Confirm"}
</button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}

export default OwnerDashboard;
