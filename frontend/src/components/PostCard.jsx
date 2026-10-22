import { Link } from "react-router-dom";

function PostCard({
  id,
  title,
  content,
  author,
  category,
}) {
  const excerpt =
    typeof content === "string"
      ? content.length > 180
        ? `${content.slice(0, 180).trimEnd()}...`
        : content
      : "This story has left no words behind... yet.";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#E31B3F]/25 bg-[#19090F] p-6 shadow-[0_8px_25px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#E31B3F]/70 hover:shadow-[0_0_30px_rgba(227,27,63,0.13)]">
      {/* Crimson atmospheric glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#A50928]/10 blur-3xl transition group-hover:bg-[#E31B3F]/20" />

      <div className="relative flex flex-1 flex-col">
        {/* Category */}
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-[#39FF14]/25 bg-[#123D24]/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#B9F5A6]">
            {category || "Unclassified"}
          </span>

          <span className="text-xs tracking-[0.2em] text-[#8B727B]">
            BLOOD POST
          </span>
        </div>

        {/* Post title */}
        <h3 className="mt-5 font-serif text-xl font-bold leading-snug text-[#E31B3F] transition group-hover:text-[#FF536D] sm:text-2xl">
          {title || "Untitled Story"}
        </h3>

        {/* Decorative divider */}
        <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#E31B3F] to-transparent transition-all duration-300 group-hover:w-28" />

        {/* Post excerpt */}
        <p className="mt-4 flex-1 whitespace-pre-line break-words text-sm leading-7 text-[#C8B8BE] sm:text-base">
          {excerpt}
        </p>

        {/* Card footer */}
        <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#E31B3F]/20 pt-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B727B]">
              Written by
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#E1F3D8]">
              {typeof author === "string"
                ? author
                : author?.name || "Unknown Author"}
            </p>
          </div>

          <Link
            to={`/posts/${id}`}
            className="shrink-0 rounded-md border border-[#E31B3F]/50 bg-[#A50928]/20 px-3 py-2 text-sm font-bold text-[#FF7185] transition hover:border-[#E31B3F] hover:bg-[#A50928] hover:text-white"
          >
            Read More →
          </Link>
        </div>
      </div>

      {/* Toxic-green bottom accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#39FF14] transition-all duration-500 group-hover:w-full" />
    </article>
  );
}

export default PostCard;
