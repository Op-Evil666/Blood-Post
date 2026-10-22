
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/postService";
import "./Home.css";

function Home() {
  /*
   * useQuery manages the entire data-fetching lifecycle.
   *
   * queryKey:
   *   Uniquely identifies this query in TanStack Query's cache.
   *   Different pagination values produce different cache entries.
   *
   * queryFn:
   *   The function that fetches the posts from our backend.
   *   getPosts should return the response data containing `posts`.
   *
   * isPending:
   *   True while there is no data available yet and the query is pending.
   *
   * isError and error:
   *   Describe a failed request and provide the error object.
   *
   * refetch:
   *   Lets us retry the request when the user clicks "Try again".
   *
   * isFetching:
   *   True whenever a request is currently running, including a refetch.
   *
   * No useEffect or manual setState is needed for fetching posts.
   */
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["posts", 1, 6],
    queryFn: () => getPosts({ page: 1, limit: 6 }),
  });

  /*
   * Extract posts from the API response.
   *
   * If data is not available yet, use an empty array so that
   * posts.map() never fails while the request is pending.
   */
  const posts = data?.posts ?? [];

  // Decorative symbols used by the horror-themed post cards.
  const symbols = ["☾", "✦", "☠"];

  /*
   * Choose a useful error message.
   * The backend's message is preferred; otherwise, show a fallback.
   */
  const errorMessage =
    error?.response?.data?.message ||
    "The darkness has swallowed the stories.";

  return (
    <div className="blood-home">
      {/* Atmospheric welcome banner */}
      <section className="home-hero">
        <div className="home-hero-glow" />

        <div className="home-hero-content">
          <p className="home-kicker">
            ✦ &nbsp; THE DOORS ARE OPEN &nbsp; ✦
          </p>

          <h1>
            Stories from
            <br />
            <span>the Dark.</span>
          </h1>

          <p className="home-hero-description">
            Strange tales. Dark thoughts. Unforgettable stories.
            Enter a world where every page leaves a mark.
          </p>

          <Link to="/explore" className="home-primary-button">
            Explore the Archives{" "}
            <span aria-hidden="true">→</span>
          </Link>

          <div className="home-hero-note">
            <span className="home-live-dot" />
            THE ARCHIVES AWAIT
          </div>
        </div>

        <div className="home-side-stamp" aria-hidden="true">
          <span>READ</span>
          <span>AT</span>
          <span>YOUR</span>
          <span>OWN</span>
          <span>RISK</span>
        </div>
      </section>

      {/* Create a new post */}
      <section className="home-create">
        <div className="home-create-card">
          <div className="home-create-glow" aria-hidden="true" />

          <div className="home-create-content">
            <p className="home-kicker">
              ✦ &nbsp; THE NEXT STORY BEGINS WITH YOU &nbsp; ✦
            </p>

            <h2>
              Your words.
              <br />
              <span>Your darkness.</span>
            </h2>

            <p className="home-create-description">
              Every legend begins with a blank page. Every nightmare
              begins with a thought. Give your imagination a voice
              and leave your mark on the archives.
            </p>

            <div className="home-create-actions">
              <Link
                to="/posts/create"
                className="home-create-button"
              >
                <span>✒</span>
                Write Your Story
                <span className="home-create-arrow" aria-hidden="true">
                  →
                </span>
              </Link>

              <span className="home-create-note">
                YOUR STORY STARTS AS A DRAFT
              </span>
            </div>
          </div>

          <div className="home-create-art" aria-hidden="true">
            <div className="home-create-orbit home-create-orbit-one" />
            <div className="home-create-orbit home-create-orbit-two" />

            <div className="home-create-emblem">
              <span className="home-create-emblem-symbol">✒</span>
              <span className="home-create-emblem-line" />
              <span className="home-create-emblem-text">
                INK YOUR
                <br />
                LEGACY
              </span>
            </div>

            <span className="home-create-star home-create-star-one">
              ✦
            </span>
            <span className="home-create-star home-create-star-two">
              ☾
            </span>
            <span className="home-create-star home-create-star-three">
              ✧
            </span>
          </div>

          <span className="home-create-corner" aria-hidden="true">
            BP / 001
          </span>
        </div>
      </section>


      {/* Latest stories fetched from the backend */}
      <section className="home-latest">
        <div className="home-section-heading">
          <div>
            <p className="home-kicker">FRESH FROM THE ABYSS</p>

            <h2>
              Recently Unearthed<span>.</span>
            </h2>

            <p className="home-section-subtitle">
              The latest stories to emerge from the darkness.
            </p>
          </div>

          <Link to="/explore" className="home-text-link">
            All stories <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/*
         * LOADING STATE
         *
         * Displayed while the first request is pending.
         * TanStack Query manages isPending for us.
         */}
        {isPending && (
          <div className="home-status" role="status">
            <span className="home-loading-pulse" />
            <p>Summoning stories from the depths...</p>
          </div>
        )}

        {/*
         * ERROR STATE
         *
         * Displayed if the query fails.
         * The retry button calls refetch(), asking TanStack Query
         * to execute the query function again.
         */}
        {isError && (
          <div className="home-status home-error" role="alert">
            <span
              className="home-status-symbol"
              aria-hidden="true"
            >
              ☠
            </span>

            <h3>The archives are sealed.</h3>

            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="home-primary-button"
            >
              {isFetching ? "Summoning..." : "Try again →"}
            </button>
          </div>
        )}

        {/*
         * EMPTY STATE
         *
         * Shown only after a successful request when the backend
         * returns no posts. An empty array is not an error.
         */}
        {!isPending && !isError && posts.length === 0 && (
          <div className="home-empty">
            <span
              className="home-status-symbol"
              aria-hidden="true"
            >
              ☾
            </span>

            <h3>Nothing stirs... yet.</h3>

            <p>The archives await their first story.</p>
          </div>
        )}

        {/*
         * SUCCESS STATE
         *
         * Render one card for each post returned by the backend.
         * The post ID is used as the React key, and the card links
         * to that post's details page.
         */}
        {!isPending && !isError && posts.length > 0 && (
          <div className="home-post-grid">
            {posts.map((post, index) => (
              <article
                className={`home-post-card home-tone-${index % 3}`}
                key={post._id}
              >
                <div className="home-card-art">
                  <span className="home-card-number">
                    FILE NO.{" "}
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className="home-card-symbol"
                    aria-hidden="true"
                  >
                    {symbols[index % symbols.length]}
                  </span>

                  <span className="home-card-art-label">
                    BLOOD POST ARCHIVES
                  </span>
                </div>

                <div className="home-card-body">
                  <span className="home-card-category">
                    UNEARTHED STORY
                  </span>

                  <h3>{post.title}</h3>

                  <p className="home-card-excerpt">
                    {post.content?.length > 150
                      ? `${post.content.slice(0, 150)}...`
                      : post.content}
                  </p>

                  <div className="home-card-footer">
                    <span>
                      By {post.author?.name || "Unknown author"}
                    </span>

                    <Link to={`/posts/${post._id}`}>
                      Read story{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Closing callout */}
        <div className="home-bottom-callout">
          <div>
            <p className="home-kicker">THERE IS MORE BELOW</p>

            <h2>Curiosity has a price.</h2>

            <p>Are you brave enough to keep reading?</p>
          </div>

          <Link to="/explore" className="home-secondary-button">
            Enter the archives ↗
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
