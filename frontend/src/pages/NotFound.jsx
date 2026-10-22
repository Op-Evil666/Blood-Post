import { Link } from "react-router-dom";
import NotFoundImage from "../assets/NotFoundImage.png";

function NotFound() {
  return (
    <main
      className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#050304] px-5 py-16 text-center"
      style={{
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(5, 3, 4, 0.48),
            rgba(5, 3, 4, 0.72)
          ),
          url(${NotFoundImage})
        `,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark atmospheric overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Main content */}
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center">

        <p className="animate-pulse text-xs font-bold uppercase tracking-[0.35em] text-[#a6ff62] sm:text-sm sm:tracking-[0.45em]">
          ⚠ You were not supposed to be here ⚠
        </p>

        <h1
          aria-label="Error 404"
          className="my-6 select-none text-[clamp(7rem,24vw,14rem)] font-black leading-none tracking-[-0.07em] text-[#c41632] drop-shadow-[0_0_25px_rgba(190,0,30,0.65)]"
          style={{ fontFamily: "Creepster, cursive" }}
        >
          404
        </h1>

        <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-red-700 to-transparent" />

        <h2 className="mt-7 text-2xl font-black uppercase tracking-wider text-[#f5e9e9] sm:text-4xl">
          This Page Is Dead
        </h2>

        <p className="mt-5 max-w-lg text-sm leading-7 text-[#ded0d2] sm:text-base">
          You followed a path that should not exist.
          <br />
          Whatever was here has vanished into the darkness.
          <br />
          <span className="font-semibold text-red-400">
            Some things are better left unfound.
          </span>
        </p>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-[#a6ff62]">
          [ SIGNAL LOST // LOCATION UNKNOWN ]
        </p>

        <Link
          to="/"
          className="group mt-9 inline-flex items-center gap-3 border border-[#a6ff62]/60 bg-black/75 px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#a6ff62] shadow-[0_0_22px_rgba(166,255,98,0.08)] backdrop-blur-sm transition duration-300 hover:border-red-500 hover:bg-red-950/80 hover:text-red-300 hover:shadow-[0_0_25px_rgba(190,0,30,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6ff62]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Escape This Place
        </Link>

        <p className="mt-14 text-[10px] uppercase tracking-[0.4em] text-white/60">
          Blood Post <span className="mx-2 text-red-500">✦</span> End of the Line
        </p>
      </div>
    </main>
  );
}

export default NotFound;