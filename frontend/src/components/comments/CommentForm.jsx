import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../services/commentService";
import { useAuth } from "../../context/useAuth";

export default function CommentForm({ postId }) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const commentMutation = useMutation({
    mutationFn: () =>
      createComment(postId, { content: content.trim() }),

    onSuccess: async () => {
      setContent("");
      await queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || commentMutation.isPending) return;

    commentMutation.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-[#64202D] bg-[#200B12] p-5">
        <h3 className="font-semibold text-[#F5E9E9]">
          Join the discussion
        </h3>

        <p className="mt-2 text-sm text-[#C6AEB4]">
          Log in to leave a comment on this post.
        </p>

        <Link
          to="/login"
          className="mt-4 inline-flex rounded-lg bg-[#8F1838] px-4 py-2
                     font-semibold text-white transition hover:bg-[#B21F47]
                     focus:outline-none focus:ring-2 focus:ring-[#E85D75]"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-[#F5E9E9]">
          Leave a comment
        </h3>

        <p className="mt-1 text-sm text-[#BDA4AB]">
          Speak your mind. Keep it relevant.
        </p>
      </div>

      <label
        htmlFor="comment-content"
        className="sr-only"
      >
        Write your comment
      </label>

      <textarea
        id="comment-content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={1000}
        rows={4}
        placeholder="Write something..."
        required
        className="w-full resize-y rounded-xl border border-[#64202D]
                   bg-[#0D0609] p-4 text-[#F5E9E9] placeholder-[#80636C]
                   outline-none transition focus:border-[#D13A5B]
                   focus:ring-2 focus:ring-[#8F1838]/40"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-[#A88B93]">
          {content.length}/1000 characters
        </span>

        <button
          type="submit"
          disabled={!content.trim() || commentMutation.isPending}
          className="rounded-lg bg-[#8F1838] px-5 py-2.5 font-semibold
                     text-white transition hover:bg-[#B21F47]
                     disabled:cursor-not-allowed disabled:opacity-50
                     focus:outline-none focus:ring-2 focus:ring-[#E85D75]"
        >
          {commentMutation.isPending ? "Posting..." : "Post comment"}
        </button>
      </div>

      {commentMutation.isError && (
        <p role="alert" className="text-sm text-red-400">
          {commentMutation.error?.response?.data?.message ||
            "Could not post your comment. Please try again."}
        </p>
      )}
    </form>
  );
}
