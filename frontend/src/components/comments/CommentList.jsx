import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostComments,
  updateComment,
  deleteComment,
} from "../../services/commentService";
import DeleteCommentModal from "./DeleteCommentModal";
import { useAuth } from "../../context/useAuth";

function getId(value) {
  if (!value) return "";
  if (typeof value === "object") {
    return String(value._id || value.id || value.userId || "");
  }
  return String(value);
}

function formatDate(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function CommentItem({ comment, postId, postAuthorId }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content || "");
  const [actionError, setActionError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currentUserId = getId(user);
  const commentAuthorId = getId(comment.author);
  const isCommentAuthor =
    Boolean(currentUserId) && currentUserId === commentAuthorId;

  const isPostOwner =
    Boolean(currentUserId) &&
    currentUserId === getId(postAuthorId);

  const canDelete = isPostOwner || user?.role === "admin";

  const editMutation = useMutation({
    mutationFn: () =>
      updateComment(postId, comment._id, {
        content: content.trim(),
      }),

    onSuccess: async () => {
      setActionError("");
      setIsEditing(false);

      await queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },

    onError: (error) => {
      setActionError(
        error?.response?.data?.message || "Could not update this comment."
      );
    },
  });

  
const deleteMutation = useMutation({
  mutationFn: () => deleteComment(postId, comment._id),

  onSuccess: async () => {
    setActionError("");

    await queryClient.invalidateQueries({
      queryKey: ["comments", postId],
    });

    setShowDeleteModal(false);
  },

  onError: (error) => {
    console.error("Delete comment failed:", {
      message: error.message,
      status: error.response?.status,
      response: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    setActionError(
      error.response?.data?.message ||
        `Delete failed (${error.response?.status || "Network error"}). Check the console.`
    );
  },
});

  const handleEdit = (event) => {
    event.preventDefault();

    if (!content.trim() || editMutation.isPending) return;

    setActionError("");
    editMutation.mutate();
  };

  const handleDelete = () => {
  setActionError("");
  setShowDeleteModal(true);
};

const confirmDelete = () => {
  if (deleteMutation.isPending) return;

  setActionError("");

  deleteMutation.mutate(undefined, {
    onSuccess: () => {
      setShowDeleteModal(false);
    },
  });
};

  return (
    <article className="rounded-xl border border-[#49202B] bg-[#10070B] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[#F1DDE2]">
            {comment.author?.name
  ? comment.author.name.charAt(0).toUpperCase() +
    comment.author.name.slice(1)
  : "Unknown author"}
          </p>

          <p className="mt-1 text-xs text-[#9F8089]">
            {formatDate(comment.updatedAt || comment.createdAt)}
            {comment.updatedAt &&
              comment.createdAt &&
              new Date(comment.updatedAt).getTime() >
                new Date(comment.createdAt).getTime() + 1000 &&
              " · Edited"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isCommentAuthor && !isEditing && (
            <button
              type="button"
              onClick={() => {
                setContent(comment.content || "");
                setActionError("");
                setIsEditing(true);
              }}
              className="rounded-md border border-[#713044] px-3 py-1.5
                         text-sm text-[#E9B6C4] transition hover:bg-[#35101D]"
            >
              Edit
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="rounded-md border border-[#7F283A] px-3 py-1.5
                         text-sm text-red-300 transition hover:bg-[#3A0D18]
                         disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleEdit} className="mt-4 space-y-3">
          <label
            htmlFor={`edit-comment-${comment._id}`}
            className="sr-only"
          >
            Edit your comment
          </label>

          <textarea
            id={`edit-comment-${comment._id}`}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={1000}
            rows={4}
            required
            className="w-full rounded-lg border border-[#713044] bg-[#0A0508]
                       p-3 text-[#F5E9E9] outline-none focus:border-[#D13A5B]
                       focus:ring-2 focus:ring-[#8F1838]/40"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#A88B93]">
              {content.length}/1000 characters
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setContent(comment.content || "");
                  setIsEditing(false);
                  setActionError("");
                }}
                className="rounded-lg border border-[#64202D] px-4 py-2
                           text-sm text-[#D7BEC5] hover:bg-[#200B12]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!content.trim() || editMutation.isPending}
                className="rounded-lg bg-[#8F1838] px-4 py-2 text-sm
                           font-semibold text-white hover:bg-[#B21F47]
                           disabled:opacity-50"
              >
                {editMutation.isPending ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mt-4 whitespace-pre-wrap break-words leading-7 text-[#D8C6CC]">
          {comment.content}
        </p>
      )}

      {actionError && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {actionError}
        </p>
      )}
      <DeleteCommentModal
  isOpen={showDeleteModal}
  onCancel={() => {
    if (!deleteMutation.isPending) {
      setShowDeleteModal(false);
      setActionError("");
    }
  }}
  onConfirm={confirmDelete}
  isDeleting={deleteMutation.isPending}
  error={actionError}
/>
    </article>
  );
}

export default function CommentList({ postId, postAuthorId }) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getPostComments(postId),
    enabled: Boolean(postId),
    retry: false,
  });

  const comments = data?.data ?? [];

  if (isPending) {
    return (
      <div className="py-8 text-center text-[#BDA4AB]" aria-live="polite">
        Summoning comments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-[#64202D] bg-[#200B12] p-5">
        <p className="text-[#F0C6CE]">
          {error?.response?.data?.message ||
            "The comments could not be loaded."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-lg border border-[#8F1838] px-4 py-2
                     text-sm text-[#F5E9E9] hover:bg-[#35101D]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section aria-label="Comments">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-[#F5E9E9]">
          Comments <span className="text-[#D65B78]">({comments.length})</span>
        </h3>

        {isFetching && (
          <span className="text-xs text-[#A88B93]" aria-live="polite">
            Refreshing...
          </span>
        )}
      </div>

      {comments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#64202D] p-6 text-center">
          <p className="text-[#E6CDD4]">No comments yet.</p>
          <p className="mt-1 text-sm text-[#A88B93]">
            Be the first to leave a mark.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              postAuthorId={postAuthorId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
