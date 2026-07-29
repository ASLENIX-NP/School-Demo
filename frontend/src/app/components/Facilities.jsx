import { Laptop, Beaker, BookOpen, Trophy, Bus, Coffee, Sparkles } from "lucide-react";

const facilitiesList = [
  {
    id: "computer-lab",
    title: "Digital IT & Computer Lab",
    category: "Digital Innovation",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&fit=crop&q=80",
    description: "High-speed workstation lab equipping students with computer literacy, programming fundamentals, and IT practicals.",
    badge: "Modern Systems"
  },
  {
    id: "science-lab",
    title: "Science Practical Laboratory",
    category: "Practical Learning",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&fit=crop&q=80",
    description: "Fully equipped Physics, Chemistry, and Biology laboratories allowing students to observe and experiment directly.",
    badge: "Physics, Chem, Bio"
  },
  {
    id: "library",
    title: "E-Library & Resource Hub",
    category: "Academics",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&fit=crop&q=80",
    description: "Thousands of books, physical reference encyclopedias, and digital learning databases available for all grades.",
    badge: "5000+ Titles"
  },
  {
    id: "sports",
    title: "Sports & Athletics Arena",
    category: "Physical Fitness",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1000&fit=crop&q=80",
    description: "Spacious sports grounds for football, basketball, badminton, athletics, and inter-house competitions.",
    badge: "Outdoor & Indoor"
  },
  {
    id: "transport",
    title: "Safe School Transportation",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&fit=crop&q=80",
    description: "Dedicated fleet of school buses providing safe pickup and drop-off across major city routes.",
    badge: "GPS Tracked"
  },
  {
    id: "cafeteria",
    title: "Clean & Hygienic Cafeteria",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=1000&fit=crop&q=80",
    description: "Serving wholesome, nutritious snacks and lunch prepared under strict hygiene guidelines.",
    badge: "Fresh & Healthy"
  }
];

export default function Facilities() {
  return (
    <section id="facilities" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Red and Blue background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/70 border border-red-800/60 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Campus Infrastructure</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Modern Facilities at Smriti School
            </h2>
          </div>

          <p className="text-slate-400 text-base sm:text-lg max-w-md">
            Providing physical and digital learning environments where students excel in science, tech, and sports.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilitiesList.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-slate-800/90 border border-slate-700/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-red-500/50 transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-md">
                  {item.badge}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
