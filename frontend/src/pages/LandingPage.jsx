
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="blood-hero">
      <div className="hero-grain" />

      {/* Atmospheric layers */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(165,9,40,0.16),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

      <div className="hero-content relative z-10">
        <p className="hero-eyebrow">
          ENTER AT YOUR OWN RISK
        </p>

        <h1 className="blood-title">
          BLOOD POST
        </h1>

        <p className="mt-5 font-serif text-sm uppercase tracking-[0.35em] text-[#39FF14] sm:text-base">
          Every story leaves a mark.
        </p>

        <p className="hero-description">
          Some stories are read.
          <br />
          <span className="text-[#E31B3F]">
            Others haunt you forever.
          </span>
        </p>

        <p className="mx-auto mt-8 max-w-xl font-serif text-base italic leading-8 text-[#C8B8BE] sm:text-lg">
          Follow your inner devil, as I did, to find your way here.
          Beyond this point, there is no return.
          Let the devil be your guide.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/home"
            className="blood-cta"
          >
            ENTER MY HELL →
          </Link>
        </div>

        <p className="hero-whisper mt-8">
          WELCOME TO MY HELL.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#100609] to-transparent" />

      <div className="hero-bottom-fade" />
    </main>
  );
}

export default LandingPage;
