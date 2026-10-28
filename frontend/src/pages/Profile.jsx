
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMe,
  getMyPosts,
  getMyComments,
  deleteProfile,
} from "../services/authService";

import profileCrypt from "../assets/Profile-Crypt.png";
import { useAuth } from "../context/useAuth";
import PostCard from "../components/PostCard";

// Extract an array safely from the API response.
const getArray = (result, keys) => {
  for (const key of keys) {
    if (Array.isArray(result?.[key])) {
      return result[key];
    }
  }

  return [];
};

const getProfile = (result) => {
  return result?.user ?? result?.data ?? result;
};

// Capitalize the first letter of a string.
const capitalizeFirst = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const name = value.trim();

  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Handle author objects, string names, and missing names.
const getAuthorName = (author, fallback = "Unknown Writer") => {
  const name =
    typeof author === "string" ? author : author?.name;

  return (
    capitalizeFirst(name) ||
    capitalizeFirst(fallback) ||
    "Unknown Writer"
  );
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function SectionMessage({ children, error = false }) {
  return (
    <div
      className={`rounded-xl border p-6 text-center ${
        error
          ? "border-[#722033] bg-[#260910]/95 text-[#FF7188]"
          : "border-[#456522] bg-[#14200F]/95 text-[#E1F3D8]"
      }`}
    >
      {children}
    </div>
  );
}

function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const queryClient = useQueryClient();

  const [activeView, setActiveView] = useState("posts");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch profile details.
  const profileQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: Boolean(isAuthenticated),
    retry: false,
  });

  // Fetch the user's posts.
  const postsQuery = useQuery({
    queryKey: ["myPosts"],
    queryFn: getMyPosts,
    enabled: Boolean(isAuthenticated),
    retry: false,
  });

  // Fetch the user's comments.
  const commentsQuery = useQuery({
    queryKey: ["myComments"],
    queryFn: getMyComments,
    enabled: Boolean(isAuthenticated),
    retry: false,
  });

  // Delete the currently authenticated user's account.
  // No userId is needed: the backend identifies the account
  // through the authenticated request.
  const deleteMutation = useMutation({
    mutationFn: deleteProfile,

    onMutate: () => {
      setDeleteError("");
    },

    onSuccess: async () => {
      setShowDeleteModal(false);

      // Remove cached data belonging to the deleted account.
      queryClient.clear();

      // Clear the local authentication state.
      await logout();
    },

    onError: (error) => {
      setDeleteError(
        error.response?.data?.message ||
          "We couldn't delete your account. Please try again."
      );
    },
  });

  const profile = getProfile(profileQuery.data);
  const posts = getArray(postsQuery.data, ["posts", "data"]);
  const comments = getArray(commentsQuery.data, [
    "comments",
    "data",
  ]);

  const displayName =
    capitalizeFirst(profile?.name) || "Unknown Writer";

  const initial = displayName.charAt(0).toUpperCase();

  // Loading screen.
  if (loading) {
    return (
      <main className="min-h-screen bg-[#100609] px-6 py-20 text-center text-[#E1F3D8]">
        <p className="animate-pulse text-lg">
          Summoning your profile...
        </p>
      </main>
    );
  }

  // Login screen.
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#100609] px-6 py-20 text-center text-[#F4E7EB]">
        <h1 className="font-serif text-3xl font-bold text-[#FF304F]">
          YOUR CRYPT AWAITS
        </h1>

        <p className="mt-4 text-[#D0B5BD]">
          Sign in to access your profile, stories, and comments.
        </p>

        <Link
          to="/login"
          className="mt-7 inline-block rounded-lg bg-[#A50928] px-6 py-3 font-semibold text-white transition hover:bg-[#C8102E]"
        >
          Enter the Crypt
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-10 text-[#F4E7EB] sm:px-8"
      style={{
        backgroundColor: "#100609",
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(16, 6, 9, 0.35),
            rgba(16, 6, 9, 0.88)
          ),
          url("${profileCrypt}")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B9F542]">
            Your personal domain
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#FF304F] sm:text-5xl">
            THE CRYPT
          </h1>

          <p className="mt-3 text-[#F4E7EB]">
            Your identity. Your stories. Your mark on the darkness.
          </p>
        </header>

        {/* Profile card */}
        <section className="relative overflow-hidden rounded-2xl border border-[#722033] bg-gradient-to-br from-[#350B16]/95 via-[#260910]/95 to-[#19090F]/95 p-6 shadow-[0_12px_45px_rgba(0,0,0,0.5)] sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#A50928]/20 blur-3xl" />

          {profileQuery.isPending && (
            <p className="relative animate-pulse py-8 text-center text-[#D0B5BD]">
              Retrieving your identity...
            </p>
          )}

          {profileQuery.isError && (
            <div className="relative text-center">
              <h2 className="text-2xl font-bold text-[#FF304F]">
                Profile unavailable
              </h2>

              <p className="mt-2 text-[#D0B5BD]">
                We couldn't retrieve your profile details.
              </p>

              <button
                type="button"
                onClick={() => profileQuery.refetch()}
                className="mt-4 rounded-lg bg-[#A50928] px-5 py-2 font-semibold text-white hover:bg-[#C8102E]"
              >
                Try again
              </button>
            </div>
          )}

          {profileQuery.isSuccess && (
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[#FF304F] bg-[#100609] text-4xl font-bold text-[#B9F542] shadow-[0_0_25px_rgba(255,48,79,0.2)]">
                {initial}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9F542]">
                  Blood Post Member
                </p>

                <h2 className="mt-2 break-words text-3xl font-bold text-white">
                  {displayName}
                </h2>

                <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-[#E1D1D7]">
                  {profile?.bio ||
                    "This writer has left their story untold... for now."}
                </p>
              </div>

              <div className="self-start rounded-lg border border-[#B9F542]/40 bg-[#123D24]/90 px-4 py-3 sm:self-center">
                <span className="text-xs uppercase tracking-widest text-[#B9F542]">
                  Role
                </span>

                <p className="mt-1 font-semibold capitalize text-white">
                  {profile?.role || "Member"}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* User statistics */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#722033] bg-[#19090F]/95 p-5">
            <p className="text-sm text-[#D0B5BD]">
              Your stories
            </p>

            <p className="mt-2 text-3xl font-bold text-[#FF304F]">
              {postsQuery.isSuccess ? posts.length : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-[#456522] bg-[#14200F]/95 p-5">
            <p className="text-sm text-[#D0B5BD]">
              Your comments
            </p>

            <p className="mt-2 text-3xl font-bold text-[#B9F542]">
              {commentsQuery.isSuccess ? comments.length : "—"}
            </p>
          </div>
        </section>

        {/* Posts and comments toggle */}
        <div
          className="mt-8 grid grid-cols-2 gap-3 rounded-xl border border-[#722033] bg-[#19090F]/95 p-2"
          aria-label="Choose profile content"
        >
          <button
            type="button"
            onClick={() => setActiveView("posts")}
            aria-pressed={activeView === "posts"}
            className={`rounded-lg px-3 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#FF304F] sm:px-4 sm:text-base ${
              activeView === "posts"
                ? "bg-[#A50928] text-white shadow-lg shadow-[#A50928]/20"
                : "text-[#D0B5BD] hover:bg-[#350B16] hover:text-white"
            }`}
          >
            My Posts ({postsQuery.isSuccess ? posts.length : "—"})
          </button>

          <button
            type="button"
            onClick={() => setActiveView("comments")}
            aria-pressed={activeView === "comments"}
            className={`rounded-lg px-3 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B9F542] sm:px-4 sm:text-base ${
              activeView === "comments"
                ? "bg-[#456522] text-white shadow-lg shadow-[#456522]/20"
                : "text-[#D0B5BD] hover:bg-[#14200F] hover:text-white"
            }`}
          >
            My Comments ({commentsQuery.isSuccess ? comments.length : "—"})
          </button>
        </div>

        {/* User posts */}
        {activeView === "posts" && (
          <section className="mt-8 pb-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9F542]">
                  Your creations
                </p>

                <h2 className="mt-1 font-serif text-3xl font-bold text-[#FF304F]">
                  MY POSTS
                </h2>
              </div>

              <span className="rounded-full border border-[#722033] bg-[#260910]/95 px-4 py-2 text-sm text-[#F4E7EB]">
                {postsQuery.isSuccess ? posts.length : "—"} stories
              </span>
            </div>

            {postsQuery.isPending && (
              <SectionMessage>
                Gathering your stories...
              </SectionMessage>
            )}

            {postsQuery.isError && (
              <SectionMessage error>
                Your posts couldn't be loaded.

                <button
                  type="button"
                  onClick={() => postsQuery.refetch()}
                  className="ml-3 font-bold underline"
                >
                  Try again
                </button>
              </SectionMessage>
            )}

            {postsQuery.isSuccess && posts.length === 0 && (
              <SectionMessage>
                <h3 className="text-xl font-bold text-[#B9F542]">
                  No stories in your crypt.
                </h3>

                <p className="mt-2">
                  Every horror legend starts with a first story.
                </p>

                <Link
                  to="/home"
                  className="mt-5 inline-block rounded-lg bg-[#A50928] px-5 py-3 font-semibold text-white transition hover:bg-[#C8102E]"
                >
                  Explore Blood Post
                </Link>
              </SectionMessage>
            )}

            {postsQuery.isSuccess && posts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    id={post._id}
                    title={post.title}
                    content={post.content}
                    author={getAuthorName(post.author, displayName)}
                    category={post.category}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* User comments */}
        {activeView === "comments" && (
          <section className="mt-8 pb-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9F542]">
                  Your words left behind
                </p>

                <h2 className="mt-1 font-serif text-3xl font-bold text-[#B9F542]">
                  MY COMMENTS
                </h2>
              </div>

              <span className="rounded-full border border-[#456522] bg-[#14200F]/95 px-4 py-2 text-sm text-[#E1F3D8]">
                {commentsQuery.isSuccess ? comments.length : "—"} comments
              </span>
            </div>

            {commentsQuery.isPending && (
              <SectionMessage>
                Retrieving your whispers...
              </SectionMessage>
            )}

            {commentsQuery.isError && (
              <SectionMessage error>
                Your comments couldn't be loaded.

                <button
                  type="button"
                  onClick={() => commentsQuery.refetch()}
                  className="ml-3 font-bold underline"
                >
                  Try again
                </button>
              </SectionMessage>
            )}

            {commentsQuery.isSuccess && comments.length === 0 && (
              <SectionMessage>
                <h3 className="text-xl font-bold text-[#B9F542]">
                  Silence... for now.
                </h3>

                <p className="mt-2">
                  You haven't left any comments yet.
                </p>
              </SectionMessage>
            )}

            {commentsQuery.isSuccess && comments.length > 0 && (
              <div className="space-y-4">
                {comments.map((comment) => {
                  const postId =
                    typeof comment.post === "string"
                      ? comment.post
                      : comment.post?._id;

                  const postTitle =
                    typeof comment.post === "object"
                      ? comment.post?.title
                      : null;

                  return (
                    <article
                      key={comment._id}
                      className="rounded-xl border border-[#456522] bg-[#14200F]/95 p-5 transition hover:border-[#B9F542]/70"
                    >
                      <p className="whitespace-pre-wrap break-words leading-relaxed text-[#F4E7EB]">
                        {comment.content}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#456522]/60 pt-3 text-sm">
                        <span className="text-[#B9F542]">
                          {formatDate(comment.createdAt)}
                        </span>

                        {postId && (
                          <Link
                            to={`/posts/${postId}`}
                            className="font-semibold text-[#FF7188] transition hover:text-white"
                          >
                            {postTitle
                              ? `Read: ${capitalizeFirst(postTitle)} →`
                              : "Read the story →"}
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Danger Zone — hidden from Owner */}
        {user?.role !== "owner" && (
          <section className="mt-10 rounded-2xl border border-[#A50928] bg-[#19090F]/95 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF7188]">
              Danger Zone
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-[#FF304F]">
              Delete Your Account
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#D0B5BD]">
              Permanently erase your account, stories, and comments.
              This action cannot be undone.
            </p>

            {deleteError && (
              <p role="alert" className="mt-4 text-sm text-[#FF7188]">
                {deleteError}
              </p>
            )}

            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => {
                setDeleteError("");
                setShowDeleteModal(true);
              }}
              className="mt-5 rounded-lg border border-[#FF304F] bg-[#A50928] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C8102E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete My Account
            </button>
          </section>
        )}
      </div>

      {/* Horror-themed confirmation modal — never rendered for Owner */}
      {showDeleteModal && user?.role !== "owner" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleteMutation.isPending
            ) {
              setShowDeleteModal(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#FF304F]/70 bg-[#100609] shadow-[0_0_60px_rgba(255,0,40,0.3)]"
          >
            {/* Crimson glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#A50928]/30 blur-3xl"
            />

            <div className="relative border-b border-[#722033] bg-gradient-to-r from-[#350B16] via-[#19090F] to-[#350B16] px-6 py-7 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#FF304F]/60 bg-[#A50928]/20 text-4xl shadow-[0_0_25px_rgba(255,48,79,0.2)]">
                ☠
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.35em] text-[#FF7188]">
                Forbidden Ritual
              </p>

              <h2
                id="delete-modal-title"
                className="mt-2 font-serif text-3xl font-black text-[#FF304F] sm:text-4xl"
              >
                Abandon the Crypt?
              </h2>
            </div>

            <div className="relative p-6 sm:p-8">
              <p
                id="delete-modal-description"
                className="text-center leading-7 text-[#F0CBD5]"
              >
                Your account, stories, and comments will be permanently
                erased from Blood Post.
              </p>

              <p className="mt-3 text-center text-sm font-bold text-[#FF7188]">
                There is no resurrection after this.
              </p>

              {deleteError && (
                <p
                  role="alert"
                  className="mt-5 rounded-lg border border-[#FF304F]/50 bg-[#350B16] p-3 text-sm text-[#FF9AAA]"
                >
                  {deleteError}
                </p>
              )}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg border border-[#722033] bg-[#19090F] px-4 py-3 font-bold text-[#F0CBD5] transition hover:border-[#FF7188] hover:bg-[#350B16] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Keep My Soul
                </button>

                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}
                  className="rounded-lg border border-[#FF304F] bg-[#A50928] px-4 py-3 font-bold text-white shadow-lg shadow-[#A50928]/20 transition hover:bg-[#C8102E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteMutation.isPending
                    ? "Erasing Your Existence..."
                    : "Erase My Account"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Profile;
