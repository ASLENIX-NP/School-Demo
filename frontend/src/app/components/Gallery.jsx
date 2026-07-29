import { useState } from "react";
import { Camera, Sparkles, X, ZoomIn } from "lucide-react";

const galleryCategories = ["All", "Campus Life", "Sports & Activities", "Events & Culture", "Science & Computer"];

const galleryItems = [
  {
    id: 1,
    title: "Interactive Classroom Session",
    category: "Campus Life",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&fit=crop&q=80",
    caption: "Students actively engaged in group learning at Smriti School."
  },
  {
    id: 2,
    title: "Annual Sports Athletics Meet",
    category: "Sports & Activities",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1000&fit=crop&q=80",
    caption: "Inter-house athletics and sports tournament."
  },
  {
    id: 3,
    title: "Science Practical Demonstration",
    category: "Science & Computer",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&fit=crop&q=80",
    caption: "Laboratory experiments guided by science faculty."
  },
  {
    id: 4,
    title: "Cultural Celebration Day",
    category: "Events & Culture",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&fit=crop&q=80",
    caption: "Celebrating Nepalese heritage and creative arts."
  },
  {
    id: 5,
    title: "Digital IT & Coding Workshop",
    category: "Science & Computer",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&fit=crop&q=80",
    caption: "Computer lab practicals building IT problem solving."
  },
  {
    id: 6,
    title: "Early Years Kindergarten Play",
    category: "Campus Life",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&fit=crop&q=80",
    caption: "Joyful play-based learning for early childhood students."
  }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 mb-3">
            <Camera className="w-3.5 h-3.5 text-red-600" />
            <span>Smriti School Life</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Campus Life & Memories
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Capturing moments of learning, friendship, sports, and achievements at Smriti School.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-md scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer bg-slate-900 transition-all duration-300 hover:-translate-y-1.5 border border-slate-200"
            >
              <div className="h-64 sm:h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 text-white">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-red-600 text-white shadow-sm">
                    {item.category}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-700"
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[70vh] object-contain bg-slate-950"
            />

            <div className="p-6 bg-slate-900 text-white">
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-1">
                {selectedImage.category}
              </span>
              <h3 className="text-2xl font-black text-white mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-slate-300 text-sm">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
