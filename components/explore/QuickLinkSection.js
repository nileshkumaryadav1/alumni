import Link from "next/link";

const QuickLinksSection = () => (
  <section className="max-w-6xl mx-auto py-12 grid sm:grid-cols-3 gap-6">
    {[
      {
        title: "Explore Alumni",
        desc: "Find and connect with alumni in your field.",
        href: "/alumni",
      },
      {
        title: "Mentorship",
        desc: "Get guidance and insights from experienced alumni.",
        href: "/mentorship",
      },
      {
        title: "Events & Activities",
        desc: "Participate in workshops, fests, and networking events.",
        href: "/events",
      },
    ].map((item) => (
      <Link
        key={item.title}
        href={item.href}
        className="group bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
      >
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
        </div>
        <span className="mt-4 text-accent text-sm font-medium flex items-center gap-1">
          Learn more →
        </span>
      </Link>
    ))}
  </section>
);

export default QuickLinksSection;
