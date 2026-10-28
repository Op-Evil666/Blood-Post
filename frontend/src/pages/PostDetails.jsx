
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostById, publishPost, deletePost } from "../services/postService";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import { useAuth } from "../context/useAuth";

function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useAuth();

  // Controls whether the three-dot menu is open.
  const [menuOpen, setMenuOpen] = useState(false);

  // Controls the two confirmation dialogs.
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch the requested post.
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: Boolean(postId),
    retry: false,
  });

  const post = data?.post;

  // Compare the logged-in user's ID with the post author's ID.
  const currentUserId = user?._id || user?.id || user?.userId;
  const authorId = post?.author?._id || post?.author;

  const isOwner =
    Boolean(currentUserId) &&
    Boolean(authorId) &&
    String(currentUserId) === String(authorId);

  const isAdmin = user?.role === "admin";
  const isDraft = post?.status === "draft";
  const isPublished = post?.status === "published";

  // An owner can manage their own post.
  // An admin can delete somebody else's published post.
  const canShowMenu = isOwner || (isAdmin && isPublished);
  const canEdit = isOwner;
  const canPublish = isOwner && isDraft;
  const canDelete =
    isOwner || (isAdmin && isPublished);

  // Publish mutation.
  const publishMutation = useMutation({
    mutationFn: () => publishPost(postId),

    onSuccess: async () => {
      setConfirmPublish(false);
      setMenuOpen(false);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["post", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["myPosts"],
        }),
      ]);
    },
  });

  // Delete mutation.
  const deleteMutation = useMutation({
    mutationFn: () => deletePost(postId),

    onSuccess: async () => {
      setConfirmDelete(false);
      setMenuOpen(false);

      // Remove cached data for the deleted post.
      queryClient.removeQueries({
        queryKey: ["post", postId],
        exact: true,
      });

      // Refresh lists that might contain this post or its comments.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["myPosts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["myComments"],
        }),
      ]);

      // Return to the user's profile after successful deletion.
      navigate("/profile", { replace: true });
    },
  });

  const publishError =
    publishMutation.error?.response?.data?.message ||
    publishMutation.error?.message;

  const deleteError =
    deleteMutation.error?.response?.data?.message ||
    deleteMutation.error?.message;

  // Loading screen.
  if (isPending) {
    return (
      <main className="min-h-screen bg-[#100609] px-4 py-24 text-center text-[#E1F3D8]">
        <p className="font-serif text-xl tracking-widest text-[#39FF14]">
          THE DARKNESS IS REVEALING ITS SECRETS...
        </p>
      </main>
    );
  }

  // Error screen.
  if (isError) {
    return (
      <main className="min-h-screen bg-[#100609] px-4 py-24 text-center text-[#E1F3D8]">
        <h1 className="font-horror-logo text-4xl text-[#E31B3F]">
          THE STORY IS LOST
        </h1>

        <p className="mt-4 text-[#C8B8BE]">
          {error.response?.data?.message ||
            "The darkness swallowed this story."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-6 rounded bg-[#A50928] px-5 py-3 font-semibold text-white hover:bg-[#C50C32] disabled:opacity-50"
        >
          {isFetching ? "Searching..." : "Try Again"}
        </button>

        <div>
          <Link
            to="/explore"
            className="mt-5 inline-block text-[#39FF14] hover:text-white"
          >
            ← Return to Explore
          </Link>
        </div>
      </main>
    );
  }

  // Handle an unexpected empty response.
  if (!post) {
    return (
      <main className="min-h-screen bg-[#100609] px-4 py-24 text-center text-[#E1F3D8]">
        <h1 className="font-horror-logo text-4xl text-[#E31B3F]">
          NOTHING LURKS HERE
        </h1>

        <Link
          to="/explore"
          className="mt-6 inline-block text-[#39FF14]"
        >
          ← Return to Explore
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#100609] px-4 py-12 text-[#E1F3D8] sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <Link
          to="/explore"
          className="text-sm font-semibold text-[#39FF14] hover:text-white"
        >
          ← Back to Explore
        </Link>

        <header className="relative mt-10 border-b border-[#E31B3F]/40 pb-8">
          {/* Three-dot actions menu */}
          {canShowMenu && (
            <div className="absolute right-0 top-0">
              <button
                type="button"
                aria-label="Post actions"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#64202D] bg-[#19090F] text-2xl text-[#E1F3D8] transition hover:border-[#E31B3F] hover:bg-[#350B16] hover:text-[#39FF14]"
              >
                ⋮
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-[#722033] bg-[#19090F] shadow-xl"
                >
                  {canEdit && (
                    <Link
                      to={`/posts/${postId}/edit`}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-[#E1F3D8] transition hover:bg-[#350B16] hover:text-[#39FF14]"
                    >
                      Edit Post
                    </Link>
                  )}

                  {canPublish && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        publishMutation.reset();
                        setConfirmPublish(true);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm text-[#B9F542] transition hover:bg-[#123D24]"
                    >
                      Publish Post
                    </button>
                  )}

                  {canDelete && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        deleteMutation.reset();
                        setConfirmDelete(true);
                      }}
                      className="block w-full border-t border-[#46202A] px-4 py-3 text-left text-sm text-[#FF7187] transition hover:bg-[#350B16]"
                    >
                      Delete Post
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#39FF14]">
            A Blood Post Story
          </p>

          <h1 className="break-words pr-12 font-serif text-4xl font-bold leading-tight text-[#E31B3F] sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#B9A8AF]">
            <span>
              By{" "}
              {post.author?.name
                ? post.author.name.charAt(0).toUpperCase() +
                  post.author.name.slice(1)
                : "Unknown Author"}
            </span>

            {post.createdAt && (
              <span>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            )}

            {/* Only show status to the owner or an admin. */}
            {(isOwner || isAdmin) && (
              <span
                className={
                  isDraft
                    ? "rounded-full border border-[#B9F542]/40 bg-[#123D24] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#B9F542]"
                    : "rounded-full border border-[#E31B3F]/40 bg-[#350B16] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FF7187]"
                }
              >
                {isDraft ? "Draft" : "Published"}
              </span>
            )}
          </div>
        </header>

        <div className="mt-10 whitespace-pre-wrap break-words text-base leading-8 text-[#E1D5D9] sm:text-lg">
          {post.content}
        </div>

      {isPublished && (
  <section
    aria-label="Post comments"
    className="mt-12 rounded-2xl border border-[#722033]
               bg-[#16080D] p-4 sm:p-6 lg:p-8"
  >
    <CommentForm postId={postId} />

    <div className="mt-8 border-t border-[#64202D] pt-6">
      <CommentList
        postId={postId}
        postAuthorId={post?.author?._id || post?.author}
      />
    </div>
  </section>
)}


        {/* Extra publish button for the owner of a draft. */}
        {canPublish && (
          <section className="mt-12 rounded-xl border border-[#722033] bg-[#19090F] p-5 sm:p-6">
            <h2 className="font-serif text-xl font-bold text-[#FF304F]">
              Ready to release your story?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#D0B5BD]">
              Publishing makes this post publicly visible. You cannot
              return it to draft status afterward.
            </p>

            <button
              type="button"
              onClick={() => {
                publishMutation.reset();
                setConfirmPublish(true);
              }}
              className="mt-5 rounded-lg border border-[#E31B3F] bg-[#A50928] px-6 py-3 font-bold text-white transition hover:bg-[#C8102E] hover:shadow-[0_0_20px_rgba(255,48,79,0.2)]"
            >
              Publish Story
            </button>
          </section>
        )}

        <footer className="mt-12 border-t border-[#E31B3F]/30 pt-6">
          <p className="font-serif italic text-[#B9A8AF]">
            The story ends here... or does it?
          </p>
        </footer>
      </article>

      {/* Publish confirmation dialog */}
      {confirmPublish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !publishMutation.isPending
            ) {
              setConfirmPublish(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="publish-dialog-title"
            className="w-full max-w-md rounded-2xl border border-[#722033] bg-[#16080D] p-6 shadow-[0_0_60px_rgba(165,9,40,0.2)] sm:p-8"
          >
            <div className="mb-4 text-3xl text-[#FF304F]" aria-hidden="true">
              ☠
            </div>

            <h2
              id="publish-dialog-title"
              className="font-horror-logo text-3xl text-[#FF304F]"
            >
              RELEASE YOUR STORY?
            </h2>

            <p className="mt-4 leading-7 text-[#E1D5D9]">
              Your story will become publicly visible once published.
              You can edit or delete it afterward, but you cannot turn
              it back into a draft.
            </p>

            {publishMutation.isError && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-[#A50928] bg-[#350B16] p-3 text-sm text-[#FF8A9B]"
              >
                {publishError ||
                  "The story could not be published. Please try again."}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={publishMutation.isPending}
                onClick={() => setConfirmPublish(false)}
                className="rounded-lg border border-[#64202D] px-5 py-3 font-semibold text-[#D0B5BD] transition hover:bg-[#260910] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={publishMutation.isPending}
                onClick={() => publishMutation.mutate()}
                className="rounded-lg border border-[#E31B3F] bg-[#A50928] px-5 py-3 font-bold text-white transition hover:bg-[#C8102E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishMutation.isPending
                  ? "Publishing..."
                  : "Publish"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleteMutation.isPending
            ) {
              setConfirmDelete(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="w-full max-w-md rounded-2xl border border-[#722033] bg-[#16080D] p-6 shadow-[0_0_60px_rgba(165,9,40,0.25)] sm:p-8"
          >
            <div className="mb-4 text-3xl text-[#FF304F]" aria-hidden="true">
              ☠
            </div>

            <h2
              id="delete-dialog-title"
              className="font-horror-logo text-3xl text-[#FF304F]"
            >
              DESTROY THIS STORY?
            </h2>

            <p
              id="delete-dialog-description"
              className="mt-4 leading-7 text-[#E1D5D9]"
            >
              This will permanently delete "{post.title}". This action cannot be undone.
            </p>

            {deleteMutation.isError && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-[#A50928] bg-[#350B16] p-3 text-sm text-[#FF8A9B]"
              >
                {deleteError ||
                  "The story could not be deleted. Please try again."}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-[#64202D] px-5 py-3 font-semibold text-[#D0B5BD] transition hover:bg-[#260910] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
                className="rounded-lg border border-[#E31B3F] bg-[#A50928] px-5 py-3 font-bold text-white transition hover:bg-[#C8102E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending
                  ? "Destroying..."
                  : "Delete Permanently"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default PostDetails;
