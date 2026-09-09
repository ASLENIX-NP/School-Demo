import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, Download, Grid3X3, Image as ImageIcon, Maximize2, Sparkles, X, ZoomIn, ZoomOut } from "lucide-react";

const COLORS = {
  burgundy: "#24131F",
  burgundy2: "#451B2D",
  rose: "#A62B4F",
  gold: "#C79A3B",
  goldLight: "#E5C878",
  cream: "#FBF7EF",
  paper: "#FFF9F0",
  paperDark: "#F3EBDD",
  text: "#211824",
  muted: "#786C72",
  white: "#FFFFFF",
};

const DEFAULT_CATEGORIES = ["Classroom", "Events", "Certificate"];

const FALLBACK_DESCRIPTIONS = {
  Classroom: "Classroom moments show students learning, discussing, writing, presenting, and growing through daily academic activities.",
  Events: "School events capture celebrations, competitions, cultural programs, student participation, and memorable school occasions.",
  Certificate: "Certificates and awards recognize achievement, participation, discipline, excellence, and student accomplishments.",
};

const DEFAULT_CONTENT = {
  heroBadge: "SCHOOL GALLERY",
  heroTitle: "Moments That Become Memories",
  heroHighlightedText: "Memories",
  heroSubtitle: "A visual collection of learning, celebrations, achievements, and everyday moments from Red Rose Secondary English Boarding School.",
  heroExploreText: "Explore Gallery",
  heroAchievementText: "Celebrating Our Students",
  badge: "Our Gallery",
  title: "School Life in Pictures",
  highlightedText: "Pictures",
  description: "Explore classroom learning, school events, certificates, achievements, and the moments that make our school community special.",
  categories: DEFAULT_CATEGORIES,
  categoryDescriptions: FALLBACK_DESCRIPTIONS,
  subcategories: {},
  images: [],
  bottomTitle: "Every picture tells a story.",
  bottomDescription: "Explore the moments, celebrate the achievements, and remember the journey.",
  bottomNote: "Gallery is managed by the school administration.",
};

function normalizeCategories(value) {
  const categories = Array.isArray(value) ? value : DEFAULT_CATEGORIES;
  const clean = [...new Set(categories.map((item) => String(item || "").trim()).filter(Boolean).filter((item) => item.toLowerCase() !== "all"))];
  return clean.length ? clean : DEFAULT_CATEGORIES;
}

function normalizeSubcategories(value, categories) {
  return categories.reduce((result, category) => {
    const items = Array.isArray(value?.[category]) ? value[category] : [];
    result[category] = items.map((item, index) => ({
      id: typeof item === "string" ? `${category}-${index}` : item?.id || `${category}-${index}`,
      name: typeof item === "string" ? item.trim() : String(item?.name || "").trim(),
      description: typeof item === "string" ? "" : String(item?.description || ""),
      visible: typeof item === "string" ? true : item?.visible !== false,
    })).filter((item) => item.name);
    return result;
  }, {});
}

function getImageUrls(item) {
  if (Array.isArray(item?.images) && item.images.length) return item.images.filter(Boolean);
  return item?.image ? [item.image] : [];
}

function normalizeImages(images, categories) {
  if (!Array.isArray(images)) return [];
  return images.map((item, index) => {
    const urls = getImageUrls(item);
    return {
      ...item,
      id: item?.id || `gallery-${index}`,
      title: item?.title || "School Memory",
      description: item?.description || "",
      date: item?.date || "School Activity",
      category: categories.includes(item?.category) ? item.category : categories[0],
      subcategory: item?.subcategory || "",
      visible: item?.visible !== false,
      image: urls[0] || item?.image || "",
      images: urls,
    };
  });
}

function mergeGalleryContent(saved = {}) {
  const categories = normalizeCategories(saved.categories);
  const categoryDescriptions = categories.reduce((result, category) => {
    result[category] = saved?.categoryDescriptions?.[category] || FALLBACK_DESCRIPTIONS[category] || "";
    return result;
  }, {});

  return {
    ...DEFAULT_CONTENT,
    ...(saved || {}),
    categories,
    categoryDescriptions,
    subcategories: normalizeSubcategories(saved.subcategories, categories),
    achievements: Array.isArray(saved.achievements) && saved.achievements.length
      ? saved.achievements.map((item, index) => ({
          id: item?.id || `achievement-${index}`,
          title: String(item?.title || "Achievement"),
          year: String(item?.year || ""),
          icon: item?.icon || "Trophy",
          visible: item?.visible !== false,
        }))
      : DEFAULT_ACHIEVEMENTS,
    images: normalizeImages(saved.images, categories),
    bottomTitle: saved.bottomTitle || DEFAULT_CONTENT.bottomTitle,
    bottomDescription: saved.bottomDescription || DEFAULT_CONTENT.bottomDescription,
    bottomNote: saved.bottomNote || DEFAULT_CONTENT.bottomNote,
  };
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title?.includes(highlightedText)) return <>{title}</>;
  const [before, after] = title.split(highlightedText);
  return (<>{before}<span className="gallery-gold-text">{highlightedText}</span>{after}</>);
}

function IconForAchievement({ icon }) {
  if (icon === "Award") return <Award size={22} />;
  if (icon === "Star") return <Star size={22} />;
  return <Trophy size={22} />;
}

function ImageWithFallback({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) return (<div className="gallery-image-placeholder"><ImageIcon size={42} /><span>No image</span></div>);
  return <img {...props} src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

function ZigZag({ color = COLORS.cream }) {
  return (<div className="gallery-zigzag" style={{ background: color, clipPath: "polygon(0 42%, 4% 100%, 8% 42%, 12% 100%, 16% 42%, 20% 100%, 24% 42%, 28% 100%, 32% 42%, 36% 100%, 40% 42%, 44% 100%, 48% 42%, 52% 100%, 56% 42%, 60% 100%, 64% 42%, 68% 100%, 72% 42%, 76% 100%, 80% 42%, 84% 100%, 88% 42%, 92% 100%, 96% 42%, 100% 100%, 100% 100%, 0 100%)" }} />);
}

function GalleryHero({ content, totalPhotos, onExplore }) {
  const title = content.heroTitle || DEFAULT_CONTENT.heroTitle;
  const highlight = content.heroHighlightedText || "Memories";
  const hasHighlight = title.includes(highlight);
  const titleParts = hasHighlight ? title.split(highlight) : [title, ""];

  return (
    <section className="gallery-hero">
      <div className="gallery-hero-pattern" />
      <div className="gallery-hero-glow gallery-hero-glow-one" />
      <div className="gallery-hero-glow gallery-hero-glow-two" />
      <div className="gallery-hero-inner">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="gallery-label gallery-label-light"><span />{content.heroBadge}</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>
          {hasHighlight ? (<>{titleParts[0]}<em>{highlight}</em>{titleParts[1]}</>) : (title)}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.18 }}>{content.heroSubtitle}</motion.p>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.28 }} className="gallery-hero-actions">
          <button type="button" onClick={onExplore} className="gallery-gold-button"><Camera size={17} />{content.heroExploreText}</button>
          <div className="gallery-hero-note"><Sparkles size={16} />{content.heroAchievementText}</div>
        </motion.div>
        <div className="gallery-hero-stats">
          <div><strong>{totalPhotos}</strong><span>Photos</span></div><i />
          <div><strong>{content.categories.length}</strong><span>Collections</span></div><i />
          <div><strong>∞</strong><span>Memories</span></div>
        </div>
      </div>
      <div className="gallery-hero-bottom"><ZigZag color={COLORS.cream} /></div>
    </section>
  );
}

function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="gallery-tabs-row">
      <div className="gallery-tabs">
        <button type="button" className={activeCategory === "All" ? "gallery-tab active" : "gallery-tab"} onClick={() => onChange("All")}><Grid3X3 size={16} />All</button>
        {categories.map((category) => (<button type="button" key={category} className={activeCategory === category ? "gallery-tab active" : "gallery-tab"} onClick={() => onChange(category)}><Camera size={16} />{category}</button>))}
      </div>
    </div>
  );
}

function createAlbums(content, activeCategory) {
  const pool = content.images.filter((item) => item.visible !== false);
  const makeAlbum = (category, subcategory = "") => {
    const items = pool.filter((item) => item.category === category && (!subcategory || item.subcategory === subcategory));
    const photos = [];
    items.forEach((item) => { getImageUrls(item).forEach((url) => { if (!url) return; photos.push({ url, title: item.title, date: item.date, category, subcategory: item.subcategory || "", visible: item.visible !== false, sourceId: item.id }); }); });
    const sub = content.subcategories?.[category]?.find((item) => item.name === subcategory);
    return { id: `${category}-${subcategory || "main"}`, category, subcategory, title: subcategory || category, description: sub?.description || content.categoryDescriptions?.[category] || FALLBACK_DESCRIPTIONS[category] || "", date: items[0]?.date || "School Gallery", photos, items };
  };

  if (activeCategory === "All") return content.categories.map((category) => makeAlbum(category)).filter((album) => album.photos.length > 0);
  const subs = (content.subcategories?.[activeCategory] || []).filter((item) => item.visible !== false);
  if (!subs.length) return [makeAlbum(activeCategory)].filter((album) => album.photos.length > 0);
  const albums = subs.map((item) => makeAlbum(activeCategory, item.name)).filter((album) => album.photos.length > 0);
  const general = makeAlbum(activeCategory);
  if (general.photos.length && !albums.some((album) => album.photos.length)) albums.push(general);
  return albums;
}

function GalleryCard({ album, index, onOpen }) {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    setSlide(0);
    if (album.photos.length <= 1) return undefined;
    const timer = setInterval(() => { setSlide((current) => (current + 1) % album.photos.length); }, 4200);
    return () => clearInterval(timer);
  }, [album.id, album.photos.length]);
  const photo = album.photos[slide];

  return (
    <motion.article initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.18) }} whileHover={{ y: -5 }} className="gallery-card">
      <div className="gallery-card-image">
        <ImageWithFallback src={photo?.url || ""} alt={album.title} className="gallery-card-photo" />
        <div className="gallery-card-shade" />
        <div className="gallery-card-top"><span>{album.category}</span>{album.subcategory && <b>{album.subcategory}</b>}</div>
        <div className="gallery-card-number"><Camera size={13} />{album.photos.length}</div>
        {album.photos.length > 1 && (<div className="gallery-slide-dots">{album.photos.slice(0, 5).map((_, dot) => (<span key={dot} className={dot === slide ? "active" : ""} />))}</div>)}
        <button type="button" className="gallery-open-button" onClick={() => onOpen(album)}><Maximize2 size={15} />View Collection</button>
      </div>
      <div className="gallery-card-body">
        <div className="gallery-card-date"><span />{album.date}</div>
        <h3>{album.title}</h3>
        <p>{album.description}</p>
        <div className="gallery-card-footer"><span>{album.photos.length} {album.photos.length === 1 ? "memory" : "memories"}</span><button type="button" onClick={() => onOpen(album)} aria-label={`Open ${album.title}`}>→</button></div>
      </div>
    </motion.article>
  );
}

function GalleryViewer({ album, imageIndex, setImageIndex, onClose }) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const photo = album?.photos?.[imageIndex];
  const next = () => { setImageIndex((current) => (current + 1) % album.photos.length); setZoom(1); };
  const previous = () => { setImageIndex((current) => (current === 0 ? album.photos.length - 1 : current - 1)); setZoom(1); };

  useEffect(() => {
    if (!album) return undefined;
    const handleKeyboard = (event) => { if (event.key === "Escape") onClose(); if (event.key === "ArrowRight") next(); if (event.key === "ArrowLeft") previous(); };
    window.addEventListener("keydown", handleKeyboard); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKeyboard); document.body.style.overflow = ""; };
  }, [album, imageIndex]);

  const download = async () => {
    if (!photo?.url) return;
    try {
      const response = await fetch(photo.url); if (!response.ok) throw new Error("Could not download image");
      const blob = await response.blob(); const url = URL.createObjectURL(blob);
      const link = document.createElement("a"); link.href = url;
      link.download = `${photo.title || "red-rose-gallery"}-${imageIndex + 1}.jpg`.replace(/\s+/g, "-").toLowerCase();
      document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    } catch (error) { console.error("Gallery download error:", error); window.open(photo.url, "_blank"); }
  };

  if (!album || !photo) return null;

  return (
    <AnimatePresence>
      <motion.div className="gallery-viewer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="gallery-viewer" initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} onClick={(event) => event.stopPropagation()}>
          <button type="button" className="gallery-viewer-close" onClick={onClose}><X size={20} /></button>
          <div className="gallery-viewer-photo">
            <button type="button" className="gallery-viewer-photo-button" onClick={() => { setZoomOpen(true); setZoom(1); }}>
              <ImageWithFallback src={photo.url} alt={photo.title} className="gallery-viewer-image" />
              <span className="gallery-zoom-label"><ZoomIn size={14} />Click image to zoom</span>
            </button>
            {album.photos.length > 1 && (<><button type="button" className="gallery-arrow gallery-arrow-left" onClick={previous}><ChevronLeft size={24} /></button><button type="button" className="gallery-arrow gallery-arrow-right" onClick={next}><ChevronRight size={24} /></button></>)}
            <div className="gallery-viewer-counter">{imageIndex + 1} / {album.photos.length}</div>
          </div>
          <div className="gallery-viewer-info">
            <div className="gallery-viewer-label">{album.category}{album.subcategory && (<><span>•</span>{album.subcategory}</>)}</div>
            <h2>{album.title}</h2>
            <div className="gallery-viewer-rule" />
            <p>{album.description}</p>
            <div className="gallery-thumbnails">{album.photos.map((item, index) => (<button type="button" key={`${item.url}-${index}`} className={index === imageIndex ? "active" : ""} onClick={() => { setImageIndex(index); setZoom(1); }}><img src={item.url} alt="" loading="lazy" /></button>))}</div>
            <button type="button" className="gallery-download" onClick={download}><Download size={16} />Download Image</button>
          </div>
        </motion.div>
        {zoomOpen && (
          <motion.div className="gallery-zoom-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setZoomOpen(false)}>
            <button type="button" className="gallery-zoom-close" onClick={() => setZoomOpen(false)}><X size={22} /></button>
            <div className="gallery-zoom-controls">
              <button type="button" onClick={(event) => { event.stopPropagation(); setZoom((value) => Math.max(1, value - 0.25)); }}><ZoomOut size={18} /></button>
              <span>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={(event) => { event.stopPropagation(); setZoom((value) => Math.min(3, value + 0.25)); }}><ZoomIn size={18} /></button>
            </div>
            <img src={photo.url} alt={photo.title} className="gallery-zoom-image" style={{ transform: `scale(${zoom})` }} onClick={(event) => event.stopPropagation()} />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Gallery() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api.get("/api/site-content/gallery", { timeout: 12000 })
      .then((response) => { if (mounted) setContent(mergeGalleryContent(response.data?.data?.content || {})); })
      .catch(() => { if (mounted) setContent(DEFAULT_CONTENT); });
    return () => { mounted = false; };
  }, []);

  const totalPhotos = useMemo(() => content.images.filter((item) => item.visible !== false).reduce((total, item) => total + getImageUrls(item).length, 0), [content.images]);
  const albums = useMemo(() => createAlbums(content, activeCategory), [content, activeCategory]);

  const openAlbum = (album) => { setSelectedAlbum(album); setImageIndex(0); };
  const closeAlbum = () => { setSelectedAlbum(null); setImageIndex(0); };

  return (
    <main className="red-rose-gallery">
      <GalleryHero content={content} totalPhotos={totalPhotos} onExplore={() => galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />

      <section ref={galleryRef} className="gallery-main">
        <div className="gallery-shell">
          <header className="gallery-main-heading">
            <div className="gallery-label"><span />{content.badge}</div>
            <h2><HighlightedTitle title={content.title} highlightedText={content.highlightedText} /></h2>
            <div className="gallery-heading-divider"><i /><span /><i /></div>
            <p>{content.description}</p>
          </header>

          <CategoryTabs categories={content.categories} activeCategory={activeCategory} onChange={setActiveCategory} />

          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="gallery-grid">
              {albums.length ? (albums.map((album, index) => (<GalleryCard key={album.id} album={album} index={index} onOpen={openAlbum} />))) : (
                <div className="gallery-empty"><div><ImageIcon size={42} /></div><h3>No Gallery Images Yet</h3><p>Images uploaded from the admin gallery will appear here.</p></div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="gallery-closing">
        <div className="gallery-closing-pattern" />
        <div className="gallery-closing-inner"><Sparkles size={21} /><h2>{content.bottomTitle}</h2><p>{content.bottomDescription}</p>{content.bottomNote && <small className="gallery-closing-note">{content.bottomNote}</small>}</div>
      </section>

      {selectedAlbum && (<GalleryViewer album={selectedAlbum} imageIndex={imageIndex} setImageIndex={setImageIndex} onClose={closeAlbum} />)}
      <style>{`${PUBLIC_GALLERY_CSS}${ADMIN_OVERLAY_CSS}`}</style>
    </main>
  );
}

/* ============================================================
   STYLES — PUBLIC GALLERY CSS
   ============================================================ */

const PUBLIC_GALLERY_CSS = `
  .red-rose-gallery { --burgundy: ${COLORS.burgundy}; --burgundy-2: ${COLORS.burgundy2}; --rose: ${COLORS.rose}; --gold: ${COLORS.gold}; --gold-light: ${COLORS.goldLight}; --cream: ${COLORS.cream}; --paper: ${COLORS.paper}; --paper-dark: ${COLORS.paperDark}; --text: ${COLORS.text}; --muted: ${COLORS.muted}; min-height: 100vh; overflow-x: hidden; color: var(--text); background: var(--cream); position: relative; }
  .gallery-shell { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
  .gallery-gold-text { color: var(--rose); }
  .gallery-hero { position: relative; min-height: 680px; display: flex; align-items: center; overflow: hidden; background: radial-gradient(circle at 15% 15%, rgba(182,74,99,.08), transparent 24%), radial-gradient(circle at 85% 70%, rgba(166,43,79,.10), transparent 30%), linear-gradient(135deg, #FDEDEE 0%, #FBD9DC 50%, #F6C3C8 100%); box-shadow: 0 28px 70px rgba(182,74,99,.14); }
  .gallery-hero-pattern { position: absolute; inset: 0; opacity: .12; background-image: radial-gradient(circle, rgba(166,43,79,.18) 1px, transparent 1.3px); background-size: 18px 18px; mask-image: linear-gradient(to bottom, black, transparent); }
  .gallery-hero::after { content: ""; position: absolute; inset: auto 0 0; height: 180px; background: linear-gradient(to top, rgba(166,43,79,.10), transparent); pointer-events: none; }
  .gallery-hero-glow { position: absolute; border-radius: 50%; filter: blur(4px); pointer-events: none; }
  .gallery-hero-glow-one { width: 280px; height: 280px; left: -120px; top: 130px; background: rgba(199,154,59,.08); box-shadow: 0 0 120px rgba(199,154,59,.12); }
  .gallery-hero-glow-two { width: 350px; height: 350px; right: -160px; bottom: 30px; background: rgba(166,43,79,.08); box-shadow: 0 0 130px rgba(166,43,79,.12); }
  .gallery-hero-inner { position: relative; z-index: 3; width: min(920px, calc(100% - 32px)); margin: 0 auto; padding: 120px 0 105px; text-align: center; }
  .gallery-label { display: inline-flex; align-items: center; gap: 10px; color: var(--rose); font-size: 11px; font-weight: 900; letter-spacing: .20em; text-transform: uppercase; }
  .gallery-label > span { width: 32px; height: 1px; background: var(--gold); }
  .gallery-label-light { color: #8F2345; }
  .gallery-label-light > span { background: #8F2345; }
  .gallery-hero h1 { max-width: 850px; margin: 24px auto 0; color: #211824; font-family: Georgia, "Times New Roman", serif; font-size: clamp(45px, 7vw, 82px); line-height: 1.02; letter-spacing: -.045em; font-weight: 700; }
  .gallery-hero h1 em { color: #A62B4F; font-style: normal; }
  .gallery-hero h1::after { content: ""; display: block; width: 75px; height: 3px; margin: 24px auto 0; border-radius: 99px; background: linear-gradient(90deg, transparent, #A62B4F, transparent); }
  .gallery-hero p { max-width: 690px; margin: 25px auto 0; color: #786C72; font-size: 16px; line-height: 1.85; }
  .gallery-hero-actions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
  .gallery-gold-button { display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 12px; padding: 13px 19px; color: #291b1e; background: var(--gold-light); font-size: 12px; font-weight: 900; cursor: pointer; box-shadow: 0 10px 28px rgba(199,154,59,.18); transition: transform .25s ease, box-shadow .25s ease; }
  .gallery-gold-button:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(199,154,59,.25); }
  .gallery-hero-note { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border: 1px solid rgba(166,43,79,.18); border-radius: 12px; color: #6F5960; background: rgba(255,255,255,.34); backdrop-filter: blur(10px); font-size: 12px; font-weight: 700; }
  .gallery-hero-note svg { color: #8F2345; }
  .gallery-hero-stats { display: flex; align-items: center; justify-content: center; gap: 28px; margin-top: 44px; }
  .gallery-hero-stats div { display: flex; flex-direction: column; gap: 2px; }
  .gallery-hero-stats strong { color: #211824; font-size: 24px; font-weight: 800; }
  .gallery-hero-stats span { color: #8A7077; font-size: 9px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
  .gallery-hero-stats i { width: 1px; height: 30px; background: rgba(166,43,79,.18); }
  .gallery-hero-bottom { position: absolute; z-index: 5; left: 0; right: 0; bottom: -1px; height: 34px; }
  .gallery-zigzag { width: 100%; height: 100%; }
  .gallery-main { position: relative; padding: 78px 0 120px; background: radial-gradient(circle at 0% 10%, rgba(166,43,79,.05), transparent 25%), radial-gradient(circle at 100% 70%, rgba(199,154,59,.08), transparent 25%), #f6eee3; scroll-margin-top: 20px; }
  .gallery-main::before { content: ""; position: absolute; inset: 0; opacity: .35; pointer-events: none; background-image: radial-gradient(#d9cabb .8px, transparent .8px); background-size: 26px 26px; }
  .gallery-main-heading { position: relative; z-index: 1; max-width: 780px; margin: 0 auto 40px; text-align: center; }
  .gallery-main-heading h2 { margin: 15px 0 13px; color: var(--text); font-family: Georgia, "Times New Roman", serif; font-size: clamp(38px, 5vw, 61px); line-height: 1; letter-spacing: -.045em; }
  .gallery-main-heading p { max-width: 680px; margin: 18px auto 0; color: var(--muted); font-size: 14px; line-height: 1.85; }
  .gallery-heading-divider { display: flex; align-items: center; justify-content: center; gap: 7px; }
  .gallery-heading-divider span { width: 45px; height: 1px; background: #d6c8bb; }
  .gallery-heading-divider i { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
  .gallery-tabs-row { display: flex; flex-direction: column; align-items: center; }
  .gallery-tabs { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 9px; margin-bottom: 38px; }
  .gallery-tab { display: inline-flex; align-items: center; gap: 7px; padding: 11px 16px; border: 1px solid #dfd3c7; border-radius: 11px; color: #675b60; background: rgba(255,249,240,.88); cursor: pointer; font-size: 11px; font-weight: 800; transition: transform .25s ease, background .25s ease, color .25s ease, border-color .25s ease, box-shadow .25s ease; }
  .gallery-tab:hover { transform: translateY(-2px); border-color: #d3b982; color: var(--rose); }
  .gallery-tab.active { color: white; border-color: var(--burgundy); background: linear-gradient(135deg, var(--burgundy), var(--burgundy-2)); box-shadow: 0 10px 25px rgba(36,19,31,.14); }
  .gallery-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
  .gallery-card { overflow: hidden; display: flex; flex-direction: column; min-width: 0; border: 1px solid #e4d8cc; border-radius: 22px; background: var(--paper); box-shadow: 0 10px 32px rgba(55,39,30,.06); transition: box-shadow .3s ease, border-color .3s ease; position: relative; }
  .gallery-card:hover { border-color: #d8c2a0; box-shadow: 0 20px 45px rgba(55,39,30,.11); }
  .gallery-card-image { position: relative; height: 300px; flex: 0 0 300px; overflow: hidden; background: #e8ded3; }
  .gallery-card-photo { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .7s ease, filter .5s ease; }
  .gallery-card:hover .gallery-card-photo { transform: scale(1.045); filter: saturate(1.04); }
  .gallery-card-shade { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(20,12,18,.28), transparent 35%, transparent 45%, rgba(20,12,18,.48)); pointer-events: none; }
  .gallery-card-top { position: absolute; left: 14px; top: 14px; display: flex; gap: 6px; flex-wrap: wrap; }
  .gallery-card-top span, .gallery-card-top b { padding: 6px 9px; border-radius: 999px; font-size: 9px; font-weight: 900; letter-spacing: .05em; text-transform: uppercase; backdrop-filter: blur(8px); }
  .gallery-card-top span { color: white; background: rgba(36,19,31,.55); border: 1px solid rgba(255,255,255,.17); }
  .gallery-card-top b { color: #38271d; background: rgba(229,200,120,.93); }
  .gallery-card-number { position: absolute; right: 14px; bottom: 14px; display: flex; align-items: center; gap: 5px; padding: 6px 9px; border-radius: 999px; color: white; background: rgba(36,19,31,.54); backdrop-filter: blur(8px); font-size: 10px; font-weight: 800; }
  .gallery-slide-dots { position: absolute; left: 50%; bottom: 16px; display: flex; gap: 5px; transform: translateX(-50%); }
  .gallery-slide-dots span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.45); }
  .gallery-slide-dots span.active { width: 15px; border-radius: 99px; background: white; }
  .gallery-open-button { position: absolute; left: 50%; top: 50%; display: flex; align-items: center; gap: 7px; padding: 11px 14px; border: 0; border-radius: 11px; color: var(--text); background: rgba(255,250,242,.94); cursor: pointer; font-size: 10px; font-weight: 900; opacity: 0; transform: translate(-50%, -45%) scale(.94); transition: opacity .25s ease, transform .25s ease; }
  .gallery-card:hover .gallery-open-button { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  .gallery-card-body { display: flex; flex: 1; flex-direction: column; padding: 20px 21px 19px; }
  .gallery-card-date { display: flex; align-items: center; gap: 7px; color: #9b8d87; font-size: 9px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
  .gallery-card-date span { width: 20px; height: 2px; border-radius: 99px; background: linear-gradient(90deg, var(--rose), var(--gold)); }
  .gallery-card-body h3 { margin: 9px 0 7px; color: var(--text); font-family: Georgia, "Times New Roman", serif; font-size: 25px; line-height: 1.08; font-weight: 700; }
  .gallery-card-body p { min-height: 42px; margin: 0; color: var(--muted); font-size: 12px; line-height: 1.7; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
  .gallery-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 17px; padding-top: 13px; border-top: 1px solid #e9dfd5; color: #9b8d87; font-size: 10px; font-weight: 800; }
  .gallery-card-footer button { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 0; border-radius: 9px; color: white; background: var(--rose); cursor: pointer; transition: transform .2s ease, background .2s ease; }
  .gallery-card-footer button:hover { transform: translateX(2px); background: var(--burgundy); }
  .gallery-empty { grid-column: 1 / -1; padding: 75px 25px; border: 1px dashed #d8cabe; border-radius: 22px; text-align: center; background: rgba(255,249,240,.65); }
  .gallery-empty > div { width: 68px; height: 68px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; border-radius: 20px; color: #a99b92; background: #efe5da; }
  .gallery-empty h3 { margin: 0; color: var(--text); font-family: Georgia, "Times New Roman", serif; font-size: 24px; }
  .gallery-empty p { margin: 7px 0 0; color: var(--muted); font-size: 13px; }
  .gallery-image-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; color: #aaa098; background: #e9dfd4; }
  .gallery-image-placeholder span { font-size: 10px; font-weight: 800; }
  .gallery-viewer-backdrop { position: fixed; z-index: 99999; inset: 0; display: flex; align-items: center; justify-content: center; padding: 18px; overflow-y: auto; background: rgba(24,13,20,.82); backdrop-filter: blur(9px); }
  .gallery-viewer { position: relative; width: min(1050px, 100%); display: grid; grid-template-columns: 1.45fr .75fr; overflow: hidden; border-radius: 26px; background: var(--paper); box-shadow: 0 35px 100px rgba(0,0,0,.35); }
  .gallery-viewer-close { position: absolute; z-index: 5; right: 14px; top: 14px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,.18); border-radius: 50%; color: white; background: rgba(36,19,31,.62); cursor: pointer; backdrop-filter: blur(8px); transition: transform .25s ease; }
  .gallery-viewer-close:hover { transform: rotate(90deg); }
  .gallery-viewer-photo { position: relative; min-height: 610px; display: flex; align-items: center; justify-content: center; padding: 28px; background: radial-gradient(circle at center, #4a2436, #1d1019 75%); }
  .gallery-viewer-photo-button { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border: 0; background: transparent; cursor: zoom-in; }
  .gallery-viewer-image { width: 100%; max-height: 550px; object-fit: contain; border-radius: 12px; box-shadow: 0 25px 70px rgba(0,0,0,.3); }
  .gallery-zoom-label { position: absolute; right: 24px; bottom: 22px; display: flex; align-items: center; gap: 5px; padding: 7px 9px; border-radius: 9px; color: rgba(255,255,255,.72); background: rgba(0,0,0,.32); font-size: 9px; font-weight: 700; }
  .gallery-arrow { position: absolute; top: 50%; width: 43px; height: 43px; display: flex; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--text); background: rgba(255,250,242,.94); cursor: pointer; transform: translateY(-50%); transition: transform .2s ease; }
  .gallery-arrow:hover { transform: translateY(-50%) scale(1.08); }
  .gallery-arrow-left { left: 16px; }
  .gallery-arrow-right { right: 16px; }
  .gallery-viewer-counter { position: absolute; left: 50%; bottom: 16px; padding: 6px 10px; border-radius: 99px; color: white; background: rgba(0,0,0,.4); font-size: 10px; font-weight: 800; transform: translateX(-50%); }
  .gallery-viewer-info { display: flex; flex-direction: column; min-width: 0; padding: 42px 28px 26px; background: var(--paper); }
  .gallery-viewer-label { display: flex; align-items: center; gap: 7px; color: var(--rose); font-size: 9px; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; }
  .gallery-viewer-info h2 { margin: 12px 0 0; color: var(--text); font-family: Georgia, "Times New Roman", serif; font-size: 32px; line-height: 1.05; }
  .gallery-viewer-rule { width: 46px; height: 3px; margin: 17px 0; border-radius: 99px; background: linear-gradient(90deg, var(--rose), var(--gold)); }
  .gallery-viewer-info > p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.8; }
  .gallery-thumbnails { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; max-height: 180px; overflow-y: auto; margin-top: 20px; }
  .gallery-thumbnails button { height: 62px; padding: 0; overflow: hidden; border: 2px solid transparent; border-radius: 9px; opacity: .58; cursor: pointer; background: #eee3d8; }
  .gallery-thumbnails button.active { opacity: 1; border-color: var(--rose); }
  .gallery-thumbnails img { width: 100%; height: 100%; object-fit: cover; }
  .gallery-download { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: auto; padding: 12px 15px; border: 0; border-radius: 11px; color: white; background: var(--burgundy); cursor: pointer; font-size: 10px; font-weight: 900; transition: transform .2s ease, background .2s ease; }
  .gallery-download:hover { transform: translateY(-2px); background: var(--rose); }
  .gallery-zoom-backdrop { position: fixed; z-index: 100000; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; background: rgba(0,0,0,.94); backdrop-filter: blur(8px); }
  .gallery-zoom-image { max-width: 88vw; max-height: 84vh; object-fit: contain; border-radius: 10px; transition: transform .2s ease; box-shadow: 0 30px 100px rgba(0,0,0,.5); }
  .gallery-zoom-close { position: absolute; z-index: 2; top: 18px; right: 18px; width: 43px; height: 43px; display: flex; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: white; background: var(--rose); cursor: pointer; }
  .gallery-zoom-controls { position: absolute; z-index: 2; left: 50%; bottom: 22px; display: flex; align-items: center; gap: 7px; padding: 6px; border-radius: 13px; background: rgba(255,249,240,.95); transform: translateX(-50%); }
  .gallery-zoom-controls button { width: 37px; height: 37px; display: flex; align-items: center; justify-content: center; border: 0; border-radius: 8px; color: var(--burgundy); background: #f0e6da; cursor: pointer; }
  .gallery-zoom-controls span { min-width: 50px; color: #675b60; text-align: center; font-size: 10px; font-weight: 900; }
  .gallery-closing { position: relative; min-height: 290px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: linear-gradient(135deg, var(--burgundy), var(--burgundy-2)); }
  .gallery-closing-pattern { position: absolute; inset: 0; opacity: .10; background-image: radial-gradient(circle, rgba(255,255,255,.8) 1px, transparent 1.2px); background-size: 17px 17px; }
  .gallery-closing-inner { position: relative; z-index: 1; width: min(620px, calc(100% - 32px)); padding: 55px 0; text-align: center; color: white; }
  .gallery-closing-inner svg { color: var(--gold-light); }
  .gallery-closing-inner h2 { margin: 12px 0 8px; font-family: Georgia, "Times New Roman", serif; font-size: clamp(30px, 4vw, 44px); line-height: 1.05; }
  .gallery-closing-inner p { margin: 0; color: rgba(255,255,255,.62); font-size: 13px; line-height: 1.7; }
  .gallery-closing-note { display: block; margin-top: 14px; color: rgba(255,255,255,.4); font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }

  @media (max-width: 1050px) {
    .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .gallery-viewer { grid-template-columns: 1fr; }
    .gallery-viewer-photo { min-height: 470px; }
  }

  @media (max-width: 700px) {
    .gallery-shell { width: min(100% - 24px, 1120px); }
    .gallery-hero { min-height: 650px; }
    .gallery-hero-inner { width: calc(100% - 26px); padding: 95px 0 85px; }
    .gallery-hero h1 { font-size: clamp(42px, 12vw, 62px); }
    .gallery-hero p { font-size: 14px; line-height: 1.75; }
    .gallery-hero-actions { flex-direction: column; }
    .gallery-gold-button, .gallery-hero-note { width: min(320px, 100%); justify-content: center; }
    .gallery-hero-stats { gap: 16px; margin-top: 34px; }
    .gallery-main { padding: 70px 0; }
    .gallery-grid { grid-template-columns: 1fr; }
    .gallery-card-image { height: 290px; flex-basis: 290px; }
    .gallery-open-button { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    .gallery-viewer-backdrop { padding: 7px; }
    .gallery-viewer { border-radius: 19px; }
    .gallery-viewer-photo { min-height: 350px; padding: 17px; }
    .gallery-viewer-info { padding: 28px 20px 20px; }
    .gallery-viewer-info h2 { font-size: 28px; }
  }

  @media (max-width: 430px) {
    .gallery-tabs { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; padding: 2px 2px 8px; }
    .gallery-tab { flex: 0 0 auto; }
    .gallery-hero-stats { gap: 10px; }
    .gallery-hero-stats strong { font-size: 20px; }
    .gallery-hero-stats span { font-size: 8px; letter-spacing: .08em; }
  }

  @media (prefers-reduced-motion: reduce) {
    .red-rose-gallery *, .red-rose-gallery *::before, .red-rose-gallery *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

const ADMIN_OVERLAY_CSS = `
`;