import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightPurple: "#F1ECFF",
};

const events = [
  {
    date: "Jun 18",
    day: "Wednesday",
    title: "Annual Science Olympiad 2026",
    time: "9:00 AM – 4:00 PM",
    category: "Competition",
    categoryColor: "#4B2E83",
    desc: "Teams from 40+ schools compete in 23 events spanning biology, chemistry, earth science, and engineering.",
    image:
      "https://images.unsplash.com/photo-1643199121319-b3b5695e4acb?w=500&h=300&fit=crop&auto=format",
    featured: true,
  },
  {
    date: "Jun 25",
    day: "Wednesday",
    title: "Graduation Ceremony — Class of 2026",
    time: "10:00 AM – 1:00 PM",
    category: "Ceremony",
    categoryColor: "#D71920",
    desc: "Celebrating the achievements of our 312 graduating seniors with guest speaker Dr. Amara Osei.",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=300&fit=crop&auto=format",
  },
  {
    date: "Jul 5",
    day: "Sunday",
    title: "Open Campus Day — Admissions 2026–27",
    time: "10:00 AM – 3:00 PM",
    category: "Admissions",
    categoryColor: "#168A3A",
    desc: "Prospective families are invited for tours, Q&A with faculty, and live student performances.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop&auto=format",
  },
  {
    date: "Jul 14",
    day: "Tuesday",
    title: "Summer Arts & Culture Festival",
    time: "5:00 PM – 9:00 PM",
    category: "Arts",
    categoryColor: "#7C5CC4",
    desc: "An evening showcase of student visual art, film shorts, live music, and drama performances.",
    image:
      "https://images.unsplash.com/photo-1496469888073-80de7e952517?w=500&h=300&fit=crop&auto=format",
  },
  {
    date: "Aug 2",
    day: "Sunday",
    title: "Inter-School Athletics Championship",
    time: "8:00 AM – 6:00 PM",
    category: "Sports",
    categoryColor: "#168A3A",
    desc: "Track & field, swimming, and team sports finals across 18 disciplines at our Olympic complex.",
    image:
      "https://images.unsplash.com/photo-1653990603052-17a7198a9a99?w=500&h=300&fit=crop&auto=format",
  },
];

function Events() {
  return (
    <section
      id="events"
      className="pt-36 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top center, rgba(75,46,131,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(215,25,32,0.1), transparent 32%),
          radial-gradient(circle at bottom right, rgba(22,138,58,0.12), transparent 34%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[740px] h-[320px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(75,46,131,0.14), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 right-0 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                background: "rgba(215,25,32,0.09)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.22)",
                boxShadow: "0 10px 28px rgba(215,25,32,0.08)",
              }}
            >
              Upcoming Events
            </span>

            <h2
              className="text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: colors.dark,
              }}
            >
              Life at{" "}
              <span className="italic" style={{ color: colors.purple }}>
                Baljagriti
              </span>
            </h2>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
            style={{ color: colors.red }}
          >
            View All Events <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev, i) => (
            <motion.article
              key={ev.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                ev.featured ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72))",
                border: "1px solid rgba(75,46,131,0.14)",
                boxShadow:
                  "0 18px 46px rgba(11,16,32,0.09), 0 0 0 1px rgba(255,255,255,0.55)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(11,16,32,0.76) 0%, transparent 62%)",
                  }}
                />

                <div
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-white text-sm font-bold"
                  style={{
                    background: "rgba(11,16,32,0.74)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
                  }}
                >
                  {ev.date}
                </div>

                <div
                  className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
                  style={{
                    background: `${ev.categoryColor}dd`,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    boxShadow: `0 10px 24px ${ev.categoryColor}35`,
                  }}
                >
                  <Tag className="w-3 h-3" />
                  {ev.category}
                </div>
              </div>

              <div className="p-6">
                <div
                  className="flex items-center gap-4 mb-3 text-xs"
                  style={{ color: "#64748b" }}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar
                      className="w-3.5 h-3.5"
                      style={{ color: colors.green }}
                    />
                    {ev.day}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock
                      className="w-3.5 h-3.5"
                      style={{ color: colors.red }}
                    />
                    {ev.time}
                  </span>
                </div>

                <h3
                  className="text-lg mb-2 line-clamp-2 leading-snug"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    color: colors.dark,
                  }}
                >
                  {ev.title}
                </h3>

                <p
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: "#64748b" }}
                >
                  {ev.desc}
                </p>

                <div
                  className="flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group-hover:gap-2.5"
                  style={{ color: colors.red }}
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Events };
export default Events;
