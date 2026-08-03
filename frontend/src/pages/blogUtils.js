export const defaultBlogPosts = [
  {
    id: "post-1",
    title: "Annual Sports Day 2026: Celebrating Athletic Excellence & Team Spirit",
    slug: "annual-sports-day-2026",
    category: "Sports",
    date: "2026-07-28",
    excerpt:
      "Our annual school sports meet brought together students, teachers, and parents for an unforgettable day of track and field competitions, inter-house matches, and sportsmanship awards.",
    content:
      "Smriti Secondary English School hosted its grand Annual Sports Day with unmatched enthusiasm and high-level athletic performance. Students across all grade levels competed in sprint races, relay competitions, long jump, chess, and football tournament finals. The Blue House claimed the overall championship trophy after an intense series of matches.",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "Annual Sports Day",
    pinned: true,
    visible: true,
    author: "Sports Department",
    authorRole: "Physical Education",
  },
  {
    id: "post-2",
    title: "Students Win National Science & Robotics Competition Gold Medal",
    slug: "national-science-robotics-gold",
    category: "Achievements",
    date: "2026-07-15",
    excerpt:
      "Our Grade 9 and 10 STEM innovation team secured the top prize at the National Inter-School Science Fair for their autonomous solar-powered water purification model.",
    content:
      "We are thrilled to announce that our young innovators from Smriti Secondary English School achieved 1st place in the National Inter-School STEM Championship. Their project presented a cost-effective, IoT-monitored water filtration system designed for rural communities.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
    imageAlt: "Robotics Competition",
    pinned: false,
    visible: true,
    author: "Academic Council",
    authorRole: "STEM Department",
  },
  {
    id: "post-3",
    title: "Smriti Academic Excellence & Honor Roll Ceremony Announced",
    slug: "academic-excellence-awards-2026",
    category: "Academics",
    date: "2026-07-02",
    excerpt:
      "We proudly recognize our top academic achievers across primary and secondary levels for outstanding performance in term assessments, leadership, and community service.",
    content:
      "Academic dedication and consistent effort deserve celebration. During our special morning assembly, over forty students were awarded merit certificates and scholarships for achieving top percentile grades and demonstrating peer mentorship.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    imageAlt: "Academic Excellence Awards",
    pinned: false,
    visible: true,
    author: "Principal's Desk",
    authorRole: "School Leadership",
  },
  {
    id: "post-4",
    title: "Grand Cultural Festival & Fine Arts Exhibition Highlights",
    slug: "cultural-festival-arts-exhibition",
    category: "Events",
    date: "2026-06-20",
    excerpt:
      "A vibrant showcase of traditional music, drama performances, and student art galleries celebrating national heritage and creative expression.",
    content:
      "The annual Smriti Cultural Extravaganza transformed our school campus into a colorful hub of music, theatrical plays, folk dance, and fine art displays created by students from Grade 1 to Grade 10.",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    imageAlt: "Cultural Festival",
    pinned: false,
    visible: true,
    author: "Cultural Committee",
    authorRole: "Arts & Culture",
  },
  {
    id: "post-5",
    title: "Notice: Parent-Teacher Progress Review & Interaction Conference",
    slug: "parent-teacher-interaction-notice",
    category: "Notice",
    date: "2026-06-10",
    excerpt:
      "Inviting all parents and guardians to join our upcoming term evaluation and progress review meeting with class teachers and subject coordinators.",
    content:
      "Parental engagement is key to student success. All parents are requested to attend the interactive progress review session on Saturday between 10:00 AM and 2:00 PM.",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    imageAlt: "Parent Teacher Meeting",
    pinned: false,
    visible: true,
    author: "School Administration",
    authorRole: "Administration",
  },
];

export const defaultBlogContent = {
  pageBadge: "Knowledge Hub",
  pageTitle: "School Blog & Insights",
  pageDescription:
    "Explore school activities, academic excellence, student achievements, competitions, and important educational updates.",
  categories: ["All", "Events", "Academics", "Achievements", "Sports", "Notice"],
  posts: defaultBlogPosts,
};

export function normalizeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

export function makeBlogSlug(title = "post", id = "") {
  const base = String(title || "post")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0900-\u097F]+/g, "-")
    .replace(/^-+|-+$/g, "") || "post";

  return id ? `${base}-${id}` : base;
}

export function normalizeBlogPost(post = {}, index = 0) {
  const id = post.id || Date.now() + index;
  const title = post.title || "Untitled Blog Post";

  return {
    id,
    title,
    slug: post.slug || makeBlogSlug(title, id),
    category: post.category || "Events",
    date: post.date || post.created_at || new Date().toISOString().slice(0, 10),
    excerpt: post.excerpt || "",
    content: post.content || "",
    imageUrl: post.imageUrl || post.image_url || post.image || "",
    imageAlt: post.imageAlt || post.image_alt || title,
    pinned: Boolean(post.pinned),
    visible: post.visible !== false,
    author: post.author || post.authorName || "Smriti Team",
    authorRole: post.authorRole || "School Administration",
  };
}

export function mergeBlogContent(saved = {}) {
  const savedCategories = normalizeArray(saved.categories, defaultBlogContent.categories);
  const cleanedCategories = Array.from(
    new Set(["All", ...savedCategories.filter(Boolean).filter((item) => item !== "All")])
  );

  const rawPosts = normalizeArray(saved.posts, []);
  const postsToUse = rawPosts.length > 0 ? rawPosts : defaultBlogContent.posts;

  return {
    ...defaultBlogContent,
    ...(saved || {}),
    categories: cleanedCategories,
    posts: postsToUse.map(normalizeBlogPost),
  };
}

export function formatBlogDate(value) {
  if (!value) return "Date not set";

  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export function getReadTime(content = "", excerpt = "") {
  const text = (content || excerpt || "").trim();
  if (!text) return "5 min read";
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 150));
  return `${minutes} min read`;
}

export function getAuthorInfo(post = {}) {
  const authorName = post.author || post.authorName || "Smriti Team";
  const authorRole = post.authorRole || "School Admin";
  const initial = (authorName.trim()[0] || "S").toUpperCase();
  return { authorName, authorRole, initial };
}
