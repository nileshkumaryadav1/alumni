import { motion } from "framer-motion";

const StatsSection = () => (
  <section className="max-w-6xl mx-auto py-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
    {[
      { label: "Alumni", value: "5,000+" },
      { label: "Students", value: "3,200+" },
      { label: "Events", value: "80+" },
      { label: "Mentors", value: "150+" },
    ].map((stat) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md"
      >
        <h3 className="text-3xl font-bold text-accent">{stat.value}</h3>
        <p className="text-sm text-muted-foreground">{stat.label}</p>
      </motion.div>
    ))}
  </section>
);

export default StatsSection;
