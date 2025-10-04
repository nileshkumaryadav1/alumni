import Link from "next/link";

const JoinCard = () => (
  <section className="py-16 px-4 text-center">
    <div className="max-w-lg mx-auto bg-card border border-border rounded-3xl p-8 shadow-md">
      <h3 className="text-2xl font-semibold mb-3">
        Be a Part of the Alumni Network
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Login or register to engage in events, mentorships, and alumni
        collaborations shaping the next generation.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/login"
          className="px-6 py-2 rounded-full bg-accent text-background font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 rounded-full border border-accent text-accent font-semibold hover:bg-accent hover:text-background transition-all"
        >
          Register
        </Link>
      </div>
    </div>
  </section>
);

export default JoinCard;
