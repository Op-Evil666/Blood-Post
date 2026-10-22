
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  getMe,
  getMyPosts,
  getMyComments,
} from "../services/authService";

import { useAuth } from "../context/useAuth";
import PostCard from "../components/PostCard";

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
          ? "border-[#722033] bg-[#260910] text-[#FF7188]"
          : "border-[#456522] bg-[#14200F] text-[#E1F3D8]"
      }`}
    >
      {children}
    </div>
  );
}

function Profile() {
  const { isAuthenticated, loading } = useAuth();

  // 1. Fetch profile details from /auth/me
  const profileQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: Boolean(isAuthenticated),
    retry: false,
  });

  // 2. Fetch the authenticated user's posts
  const postsQuery = useQuery({
    queryKey: ["myPosts"],
    queryFn: getMyPosts,
    enabled: Boolean(isAuthenticated),
    retry: false,
  });

  // 3. Fetch the authenticated user's comments
  const commentsQuery = useQuery({
    queryKey: ["myComments"],
    queryFn: getMyComments,
    enabled: Boolean(isAuthenticated),
    retry: false,
  });

  const profile = getProfile(profileQuery.data);

  const posts = getArray(postsQuery.data, ["posts", "data"]);
  const comments = getArray(commentsQuery.data, ["comments", "data"]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#100609] px-6 py-20 text-center text-[#E1F3D8]">
        <p className="animate-pulse text-lg">
          Summoning your profile...
        </p>
      </main>
    );
  }

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

  const displayName = profile?.name
  ? profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
  : "Unknown Writer";

const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#100609] px-4 py-10 text-[#F4E7EB] sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B9F542]">
            Your personal domain
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#FF304F] sm:text-5xl">
            THE CRYPT
          </h1>

          <p className="mt-3 text-[#D0B5BD]">
            Your identity. Your stories. Your mark on the darkness.
          </p>
        </header>

        {/* Profile card: /auth/me */}
        <section className="relative overflow-hidden rounded-2xl border border-[#722033] bg-gradient-to-br from-[#350B16] via-[#260910] to-[#19090F] p-6 shadow-[0_12px_45px_rgba(0,0,0,0.35)] sm:p-8">
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

                <p className="mt-1 break-words text-[#F0CBD5]">
                  {profile?.email || "Email unavailable"}
                </p>

                <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-[#E1D1D7]">
                  {profile?.bio || "This writer has left their story untold... for now."}
                </p>
              </div>

              <div className="self-start rounded-lg border border-[#B9F542]/40 bg-[#123D24]/60 px-4 py-3 sm:self-center">
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
          <div className="rounded-xl border border-[#722033] bg-[#19090F] p-5">
            <p className="text-sm text-[#D0B5BD]">Your stories</p>

            <p className="mt-2 text-3xl font-bold text-[#FF304F]">
              {postsQuery.isSuccess ? posts.length : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-[#456522] bg-[#14200F] p-5">
            <p className="text-sm text-[#D0B5BD]">Your comments</p>

            <p className="mt-2 text-3xl font-bold text-[#B9F542]">
              {commentsQuery.isSuccess ? comments.length : "—"}
            </p>
          </div>
        </section>

        {/* User posts */}
        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9F542]">
                Your creations
              </p>

              <h2 className="mt-1 font-serif text-3xl font-bold text-[#FF304F]">
                MY POSTS
              </h2>
            </div>

            <span className="rounded-full border border-[#722033] bg-[#260910] px-4 py-2 text-sm text-[#F4E7EB]">
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
                  author={post.author?.name || displayName}
                  category={post.category}
                />
              ))}
            </div>
          )}
        </section>

        {/* User comments */}
        <section className="mt-14 pb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9F542]">
                Your words left behind
              </p>

              <h2 className="mt-1 font-serif text-3xl font-bold text-[#B9F542]">
                MY COMMENTS
              </h2>
            </div>

            <span className="rounded-full border border-[#456522] bg-[#14200F] px-4 py-2 text-sm text-[#E1F3D8]">
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

                return (
                  <article
                    key={comment._id}
                    className="rounded-xl border border-[#456522] bg-[#14200F] p-5 transition hover:border-[#B9F542]/70"
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
                          Read the story →
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Profile;
