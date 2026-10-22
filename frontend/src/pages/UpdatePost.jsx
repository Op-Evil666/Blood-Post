import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostById, updatePost } from "../services/postService";
import { useAuth } from "../context/useAuth";

function UpdatePost() {
  const { postId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: Boolean(postId) && !authLoading,
    retry: false,
  });

  const post = data?.post;

  if (authLoading || isPending) {
    return (
      <main className="min-h-screen bg-[#100609] px-4 py-24 text-center text-[#E1F3D8]">
        <p className="animate-pulse font-serif text-xl tracking-widest text-[#39FF14]">
          RECOVERING YOUR STORY FROM THE DARKNESS...
        </p>
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="min-h-screen bg-[#100609] px-4 py-24 text-center text-[#E1F3D8]">
        <h1 className="font-horror-logo text-4xl text-[#E31B3F]">
          STORY NOT FOUND
        </h1>
        <p className="mt-4 text-[#D0B5BD]">
          {error?.response?.data?.message ||
            "This story could not be recovered."}
        </p>
        <Link
          to="/explore"
          className="mt-6 inline-block text-[#39FF14] hover:text-white"
        >
          ← Return to Explore
        </Link>
      </main>
    );
  }

  const currentUserId = user?._id || user?.id || user?.userId;
  const authorId = post.author?._id || post.author;
  const isOwner =
    Boolean(currentUserId) &&
    Boolean(authorId) &&
    String(currentUserId) === String(authorId);

  if (!isOwner) {
    return (
      <main className="min-h-screen bg-[#100609] px-4 py-24 text-center text-[#E1F3D8]">
        <h1 className="font-horror-logo text-4xl text-[#E31B3F]">
          ACCESS DENIED
        </h1>
        <p className="mt-4 text-[#D0B5BD]">
          Only the author of this story can change its words.
        </p>
        <Link
          to={`/posts/${postId}`}
          className="mt-6 inline-block text-[#39FF14] hover:text-white"
        >
          ← Return to Story
        </Link>
      </main>
    );
  }

  return (
    <UpdatePostForm
      key={post._id}
      post={post}
      postId={postId}
      onCancel={() => navigate(`/posts/${postId}`)}
      onUpdated={async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["post", postId] }),
          queryClient.invalidateQueries({ queryKey: ["posts"] }),
          queryClient.invalidateQueries({ queryKey: ["myPosts"] }),
        ]);

        navigate(`/posts/${postId}`, { replace: true });
      }}
    />
  );
}

function UpdatePostForm({ post, postId, onCancel, onUpdated }) {
  // The form initializes from the loaded post without useEffect.
  const [formData, setFormData] = useState({
    title: post.title || "",
    content: post.content || "",
    category: post.category || "",
    tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
  });

  const [confirmUpdate, setConfirmUpdate] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (postData) => updatePost(postId, postData),
    onSuccess: onUpdated,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateMutation.reset();
    setConfirmUpdate(true);
  };

  const submitUpdate = () => {
    const tags = [
      ...new Set(
        formData.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      ),
    ];

    // Do not send status or author.
    // The backend must preserve status and enforce ownership.
    updateMutation.mutate({
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category.trim(),
      tags,
    });
  };

  const updateError =
    updateMutation.error?.response?.data?.message ||
    updateMutation.error?.message;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100609] px-4 py-10 text-[#F4E7EB] sm:px-8 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(165,9,40,0.16),transparent_55%),linear-gradient(180deg,#100609_0%,#080306_100%)]"
      />

      <div className="relative mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-[#B9F542] hover:text-white"
        >
          ← Return to Story
        </button>

        <header className="mb-8 mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B9F542]">
            THE STORY IS NOT FINISHED
          </p>
          <h1 className="mt-3 font-horror-logo text-4xl text-[#FF304F] sm:text-6xl">
            REWRITE YOUR STORY
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[#D0B5BD]">
            Refine your tale, sharpen its message, and make it your own.
          </p>
        </header>

        <div className="mb-6 rounded-xl border border-[#B9F542]/30 bg-[#123D24]/40 p-4">
          <p className="font-bold text-[#B9F542]">
            Current status: {post.status}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#E1F3D8]">
            Updating this story will not change its publication status.
            Drafts remain drafts, and published stories remain published.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#722033] bg-[#16080D]/95 shadow-[0_12px_45px_rgba(0,0,0,0.4)]">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FF304F] to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-9">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-bold text-[#B9F542]">
                Story title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                minLength={5}
                maxLength={200}
                required
                disabled={updateMutation.isPending}
                className="w-full rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-3.5 text-[#F4E7EB] outline-none transition focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />
              <p className="mt-2 text-right text-xs text-[#A98B95]">
                {formData.title.length} characters
              </p>
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-bold text-[#B9F542]">
                Category
              </label>
              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={updateMutation.isPending}
                className="w-full rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-3.5 text-[#F4E7EB] outline-none transition focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="tags" className="mb-2 block text-sm font-bold text-[#B9F542]">
                Tags <span className="font-normal text-[#A98B95]">(optional)</span>
              </label>
              <input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="horror, mystery, storytelling"
                disabled={updateMutation.isPending}
                className="w-full rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-3.5 text-[#F4E7EB] outline-none transition focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />
              <p className="mt-2 text-xs text-[#A98B95]">
                Separate tags with commas. Duplicate tags are removed.
              </p>
            </div>

            <div>
              <label htmlFor="content" className="mb-2 block text-sm font-bold text-[#B9F542]">
                Your story
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={14}
                required
                disabled={updateMutation.isPending}
                className="w-full resize-y rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-4 leading-7 text-[#F4E7EB] outline-none transition focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />
              <p className="mt-2 text-right text-xs text-[#A98B95]">
                {formData.content.length} characters
              </p>
            </div>

            {updateMutation.isError && (
              <div role="alert" className="rounded-lg border border-[#A50928] bg-[#350B16] px-4 py-3 text-sm text-[#FF8A9B]">
                {updateError || "Your changes could not be saved."}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-[#722033]/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-[#64202D] px-5 py-3 font-semibold text-[#D0B5BD] transition hover:border-[#92243B] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-lg border border-[#E31B3F] bg-[#A50928] px-7 py-3.5 font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_0_#570817] transition hover:-translate-y-0.5 hover:bg-[#C8102E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Review Changes
              </button>
            </div>
          </form>
        </section>
      </div>

      {confirmUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="update-dialog-title"
            className="w-full max-w-lg rounded-2xl border border-[#722033] bg-[#16080D] p-6 shadow-[0_0_60px_rgba(165,9,40,0.2)] sm:p-8"
          >
            <div className="mb-4 text-3xl text-[#B9F542]" aria-hidden="true">
              ✒
            </div>
            <h2 id="update-dialog-title" className="font-horror-logo text-3xl text-[#FF304F]">
              SAVE YOUR CHANGES?
            </h2>
            <p className="mt-4 leading-7 text-[#E1D5D9]">
              These changes will replace the existing content. Review your
              updated title and story before confirming.
            </p>

            <div className="mt-5 max-h-64 space-y-3 overflow-y-auto rounded-lg border border-[#46202A] bg-[#0D0509] p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#B9F542]">
                New title
              </p>
              <p className="break-words font-serif text-lg text-[#F4E7EB]">
                {formData.title}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#B9F542]">
                New content preview
              </p>
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#D0B5BD]">
                {formData.content.length > 500
                  ? `${formData.content.slice(0, 500)}...`
                  : formData.content}
              </p>
            </div>

            <p className="mt-4 text-sm text-[#A98B95]">
              Your post will remain {post.status}.
            </p>

            {updateMutation.isError && (
              <p role="alert" className="mt-4 rounded-lg border border-[#A50928] bg-[#350B16] p-3 text-sm text-[#FF8A9B]">
                {updateError || "The update failed. Please try again."}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={updateMutation.isPending}
                onClick={() => setConfirmUpdate(false)}
                className="rounded-lg border border-[#64202D] px-5 py-3 font-semibold text-[#D0B5BD] transition hover:bg-[#260910] hover:text-white disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={updateMutation.isPending}
                onClick={submitUpdate}
                className="rounded-lg border border-[#E31B3F] bg-[#A50928] px-5 py-3 font-bold text-white transition hover:bg-[#C8102E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving Changes..." : "Confirm Update"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default UpdatePost;
