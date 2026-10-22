
import { Link } from "react-router-dom";

function About() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100609] text-[#E1F3D8]">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(165,9,40,0.2),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(18,61,36,0.18),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        {/* Page heading */}
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.45em] text-[#39FF14]">
            Beyond the point of no return
          </p>

          <h1 className="mt-6 font-horror-logo text-5xl leading-tight text-[#E31B3F] drop-shadow-[0_0_22px_rgba(227,27,63,0.35)] sm:text-7xl">
            ABOUT BLOOD POST
          </h1>

          <p className="mx-auto mt-7 max-w-2xl font-serif text-lg italic leading-8 text-[#C8B8BE] sm:text-xl">
            Every story begins somewhere. Some are born in the light.
            Others crawl out of the darkness.
          </p>
        </header>

        {/* Main story */}
        <section className="mx-auto mt-20 grid max-w-5xl gap-8 md:grid-cols-2">
          <article className="rounded-xl border border-[#E31B3F]/30 bg-[#19090F]/80 p-7 shadow-[0_0_30px_rgba(165,9,40,0.08)] transition duration-300 hover:border-[#E31B3F]/70 hover:shadow-[0_0_35px_rgba(165,9,40,0.16)] sm:p-9">
            <span className="text-sm font-bold tracking-[0.3em] text-[#39FF14]">
              I. THE ORIGIN
            </span>

            <h2 className="mt-5 font-serif text-3xl font-bold text-[#E31B3F]">
              A Place for Stories
            </h2>

            <p className="mt-5 leading-8 text-[#D2C2C8]">
              Blood Post is a place for ideas to leave their shadows
              behind and take shape in words. Every post opens a door
              to another thought, another perspective, another story
              waiting to be discovered.
            </p>

            <p className="mt-4 leading-8 text-[#D2C2C8]">
              Step inside with curiosity. Stay because something
              catches your attention. Leave with a story that follows
              you long after the screen goes dark.
            </p>
          </article>

          <article className="rounded-xl border border-[#39FF14]/25 bg-[#0D1A11]/80 p-7 shadow-[0_0_30px_rgba(57,255,20,0.04)] transition duration-300 hover:border-[#39FF14]/60 hover:shadow-[0_0_35px_rgba(57,255,20,0.1)] sm:p-9">
            <span className="text-sm font-bold tracking-[0.3em] text-[#39FF14]">
              II. THE PHILOSOPHY
            </span>

            <h2 className="mt-5 font-serif text-3xl font-bold text-[#E31B3F]">
              Embrace the Darkness
            </h2>

            <p className="mt-5 leading-8 text-[#D2C2C8]">
              Darkness isn't always something to fear. Sometimes,
              it's the unknown waiting to be explored, the question
              nobody dares to ask, or the idea that refuses to remain
              buried.
            </p>

            <p className="mt-4 leading-8 text-[#D2C2C8]">
              Blood Post invites you to explore those shadows through
              words, imagination, and an open mind. Not every path is
              familiar. That's precisely the point.
            </p>
          </article>
        </section>

        {/* Brand manifesto */}
        <section className="mx-auto mt-24 max-w-4xl border-y border-[#E31B3F]/35 px-5 py-14 text-center sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#39FF14]">
            The Manifesto
          </p>

          <h2 className="mt-6 font-horror-logo text-4xl leading-tight text-[#E31B3F] sm:text-6xl">
            FOLLOW YOUR INNER DEVIL
          </h2>

          <p className="mx-auto mt-7 max-w-2xl font-serif text-lg italic leading-8 text-[#C8B8BE]">
            Question what you know. Explore what you don't. Let
            curiosity lead you through the doors you were warned
            never to open.
          </p>
        </section>

        {/* Final warning */}
        <section className="mt-20 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#B9A8AF]">
            You have been warned
          </p>

          <h2 className="mt-5 font-horror-logo text-4xl text-[#E31B3F] sm:text-6xl">
            WELCOME TO MY HELL
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#C8B8BE]">
            The door is open. The stories are waiting. What happens
            next is up to you.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="rounded-md border border-[#E31B3F] bg-[#A50928] px-7 py-3.5 font-bold text-white shadow-[0_4px_0_#570817] transition hover:-translate-y-1 hover:bg-[#C50C32] hover:shadow-[0_0_25px_rgba(227,27,63,0.3)] active:translate-y-0 active:shadow-none"
            >
              Explore the Stories
            </Link>

            <Link
              to="/home"
              className="rounded-md border border-[#39FF14]/50 bg-[#123D24] px-7 py-3.5 font-bold text-[#E1F3D8] transition hover:border-[#39FF14] hover:bg-[#19532F]"
            >
              Enter Blood Post
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;
