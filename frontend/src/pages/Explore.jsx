import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/postService";

const PAGE_SIZE = 9;

function Explore() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPosts({
          page,
          limit: PAGE_SIZE,
        });

        if (!result.success || !Array.isArray(result.posts)) {
          throw new Error("Unexpected response from server.");
        }

        if (!cancelled) {
          setPosts(result.posts);
          setTotalPages(result.totalPages ?? 1);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load posts."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [page, retry]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">
          Explore Posts
        </h1>
        <p className="mt-3 text-slate-600">
          Discover stories, ideas, and perspectives from Blood Post.
        </p>
      </div>

      {loading && (
        <p className="py-12 text-center text-slate-600">
          Loading posts...
        </p>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p>{error}</p>
          <button
            onClick={() => setRetry((current) => current + 1)}
            className="mt-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No published posts yet. Check back soon!
        </p>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                title={post.title}
                content={post.content}
                author={
                post.author?.name
                ? post.author.name.charAt(0).toUpperCase() + post.author.name.slice(1)
                : "Unknown Author"
              }
                category={post.category}
              />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {page}
              {totalPages > 1 ? ` of ${totalPages}` : ""}
            </span>

            <button
              disabled={posts.length < PAGE_SIZE}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Explore;