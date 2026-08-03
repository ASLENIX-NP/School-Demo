import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { UserRound, Quote, Sparkles } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
};

const defaultMessagesContent = {
  badge: "Leadership Messages",
  title: "Messages From Leadership",
  description:
    "Words from school leadership guiding students toward academic excellence, discipline, values, and lifelong learning.",
  people: [
    {
      id: "principal",
      name: "Principal",
      role: "Principal",
      title: "Principal’s Message",
      message:
        "Welcome to Baljagriti English Secondary School. We are committed to nurturing every child into a confident, capable, disciplined, and compassionate individual. Our goal is to provide quality education with strong values, creativity, and academic excellence.",
      image: "",
    },
    {
      id: "vice-principal",
      name: "Vice Principal",
      role: "Vice Principal",
      title: "Vice Principal’s Message",
      message:
        "Our team works tirelessly to provide a safe, inspiring, and academically rigorous environment for every student. We believe every child deserves care, guidance, and opportunities to grow academically, socially, and personally.",
      image: "",
    },
  ],
};

function mergeMessagesContent(saved = {}) {
  return {
    ...defaultMessagesContent,
    ...saved,
    people:
      Array.isArray(saved.people) && saved.people.length > 0
        ? saved.people.map((person, index) => ({
            id: person.id || `leader-${index}`,
            name: person.name || "",
            role: person.role || "",
            title: person.title || "",
            message: person.message || "",
            image: person.image || "",
          }))
        : defaultMessagesContent.people,
  };
}

function ProfileBox({ person }) {
  return (
    <div
      className="w-full md:w-[280px] flex-shrink-0 flex flex-col items-center justify-center text-center p-8"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,248,238,0.96), rgba(241,236,255,0.8))",
        borderRight: "1px solid rgba(11,16,32,0.08)",
      }}
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden mb-6"
        style={{
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(11,16,32,0.08)",
          boxShadow:
            "0 20px 48px rgba(11,16,32,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {person.image ? (
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound className="w-12 h-12" style={{ color: "#9CA3AF" }} />
        )}
      </div>

      <h3
        className="text-2xl mb-2"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          color: colors.dark,
          letterSpacing: "-0.025em",
        }}
      >
        {person.name}
      </h3>

      <p className="text-base font-semibold" style={{ color: colors.green }}>
        {person.role}
      </p>
    </div>
  );
}

function MessageCard({ person, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
        border: "1px solid rgba(11,16,32,0.08)",
        boxShadow:
          "0 22px 62px rgba(11,16,32,0.08), inset 0 1px 0 rgba(255,255,255,0.85)",
        backdropFilter: "blur(18px)",
      }}
    >
      <ProfileBox person={person} />

      <div className="relative flex-1 p-8 md:p-10 lg:p-12">
        <Quote
          className="absolute right-8 top-8 w-12 h-12 opacity-10"
          style={{ color: colors.purple }}
        />

        <h2
          className="text-3xl md:text-4xl mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            color: colors.dark,
            letterSpacing: "-0.035em",
          }}
        >
          {person.title}
        </h2>

        <p className="text-lg md:text-xl leading-relaxed text-slate-500 max-w-5xl">
          {person.message}
        </p>
      </div>
    </motion.div>
  );
}

export default function Messages() {
  const [messagesContent, setMessagesContent] = useState(defaultMessagesContent);

  useEffect(() => {
    const loadMessagesContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/messages"
        );

        const savedContent = res.data?.data?.content || {};
        setMessagesContent(mergeMessagesContent(savedContent));
      } catch (error) {
        console.error("Messages content load error:", error);
      }
    };

    loadMessagesContent();
  }, []);

  return (
    <section
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.13), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-14"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(215,25,32,0.08)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.16)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            {messagesContent.badge}
          </span>

          <h1
            className="text-4xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            {messagesContent.title}
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500">
            {messagesContent.description}
          </p>
        </motion.div>

        <div className="space-y-10">
          {messagesContent.people.map((person, index) => (
            <MessageCard key={person.id || index} person={person} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
