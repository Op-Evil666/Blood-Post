
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../services/postService";

function CreatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myPosts"] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
      ]);

      const postId = response.post?._id;

      if (postId) {
        navigate(`/posts/${postId}`, { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    },
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

    const tags = [
      ...new Set(
        formData.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      ),
    ];

    createMutation.mutate({
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category.trim(),
      tags,
    });
  };

  const errorMessage =
    createMutation.error?.response?.data?.message ||
    createMutation.error?.message;

  const isSubmitting = createMutation.isPending;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100609] px-4 py-10 text-[#F4E7EB] sm:px-8 sm:py-14">
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(165,9,40,0.16),transparent_55%),linear-gradient(180deg,#100609_0%,#080306_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-[#39FF14]/[0.025] blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Back navigation */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#B9F542] transition hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Return to Home
        </Link>

        {/* Heading */}
        <header className="mb-8 mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B9F542]">
            Your words. Your darkness.
          </p>

          <h1 className="mt-3 font-horror-logo text-4xl text-[#FF304F] drop-shadow-[0_0_14px_rgba(255,48,79,0.2)] sm:text-6xl">
            CREATE A STORY
          </h1>

          <p className="mt-4 max-w-2xl leading-relaxed text-[#D0B5BD]">
            Every legend begins with a blank page. Give your thoughts a
            place in the darkness.
          </p>
        </header>

        {/* Draft notice */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#B9F542]/30 bg-[#123D24]/40 p-4">
          <span className="mt-0.5 text-xl text-[#B9F542]" aria-hidden="true">
            ◈
          </span>

          <div>
            <p className="font-bold text-[#B9F542]">
              Your story starts as a draft
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#E1F3D8]">
              Saving this form creates a private draft. You can review,
              edit, and publish it separately when you're ready.
            </p>
          </div>
        </div>

        {/* Creation form */}
        <section className="overflow-hidden rounded-2xl border border-[#722033] bg-[#16080D]/95 shadow-[0_12px_45px_rgba(0,0,0,0.4)]">
          <div
            aria-hidden="true"
            className="h-1 w-full bg-gradient-to-r from-transparent via-[#FF304F] to-transparent"
          />

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-9">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-bold text-[#B9F542]"
              >
                Story title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your story a name..."
                minLength={5}
                maxLength={200}
                required
                disabled={isSubmitting}
                className="w-full rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-3.5 text-[#F4E7EB] outline-none transition placeholder:text-[#80616C] hover:border-[#92243B] focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />

              <p className="mt-2 text-right text-xs text-[#A98B95]">
                {formData.title.length} characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-bold text-[#B9F542]"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Horror, Technology, Personal..."
                required
                disabled={isSubmitting}
                className="w-full rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-3.5 text-[#F4E7EB] outline-none transition placeholder:text-[#80616C] hover:border-[#92243B] focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-bold text-[#B9F542]"
              >
                Tags
                <span className="ml-2 font-normal text-[#A98B95]">
                  (optional)
                </span>
              </label>

              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="horror, mystery, storytelling"
                disabled={isSubmitting}
                className="w-full rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-3.5 text-[#F4E7EB] outline-none transition placeholder:text-[#80616C] hover:border-[#92243B] focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />

              <p className="mt-2 text-xs leading-relaxed text-[#A98B95]">
                Separate tags with commas. Duplicate tags are removed
                automatically.
              </p>
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-bold text-[#B9F542]"
              >
                Your story
              </label>

              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Let the words emerge from the darkness..."
                rows={14}
                required
                disabled={isSubmitting}
                className="w-full resize-y rounded-lg border border-[#64202D] bg-[#0D0509] px-4 py-4 leading-7 text-[#F4E7EB] outline-none transition placeholder:text-[#80616C] hover:border-[#92243B] focus:border-[#FF304F] focus:ring-2 focus:ring-[#FF304F]/20 disabled:opacity-60"
              />

              <p className="mt-2 text-right text-xs text-[#A98B95]">
                {formData.content.length} characters
              </p>
            </div>

            {/* API error */}
            {createMutation.isError && (
              <div
                role="alert"
                className="rounded-lg border border-[#A50928] bg-[#350B16] px-4 py-3 text-sm leading-relaxed text-[#FF8A9B]"
              >
                <span className="mr-2" aria-hidden="true">
                  ☠
                </span>
                {errorMessage || "Your story could not be saved. Please try again."}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#722033]/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/home"
                className="rounded-lg border border-[#64202D] px-5 py-3 text-center font-semibold text-[#D0B5BD] transition hover:border-[#92243B] hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative overflow-hidden rounded-lg border border-[#E31B3F] bg-[#A50928] px-7 py-3.5 font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_0_#570817] transition duration-300 hover:-translate-y-0.5 hover:bg-[#C8102E] hover:shadow-[0_4px_0_#570817,0_0_24px_rgba(255,48,79,0.2)] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving your draft..." : "Save Draft"}
              </button>
            </div>
          </form>
        </section>

        <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-[#80616C]">
          Nothing is published until you choose to publish it.
        </p>
      </div>
    </main>
  );
}

export default CreatePost;
