import PostCard from "./PostCard";

function FeaturedPosts() {

  // Temporary hardcoded data.
  // Later this will come from the backend through TanStack Query.
  const posts = [
    {
      id: 1,
      title: "Why Building Projects Matters",
      content:
        "Learning concepts is important, but building real projects is where those concepts start making sense.",
      author: "Alex",
      category: "Technology",
    },
    {
      id: 2,
      title: "Understanding Before Coding",
      content:
        "Good developers don't just write code. They understand why the code exists and what problem it solves.",
      author: "Sarah",
      category: "Programming",
    },
    {
      id: 3,
      title: "Ideas Need a Place to Grow",
      content:
        "Sometimes the best ideas begin as simple thoughts. Writing gives those thoughts somewhere to grow.",
      author: "John",
      category: "Creativity",
    },
  ];

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-10 text-center">

          <h2 className="text-3xl font-bold sm:text-4xl">
            Featured Posts
          </h2>

          <p className="mt-3 text-slate-600">
            Interesting thoughts from the Blood Post community.
          </p>

        </div>

        {/* Responsive card grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* 
            Instead of manually writing:

            <PostCard />
            <PostCard />
            <PostCard />

            we generate them from data.
          */}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default FeaturedPosts;