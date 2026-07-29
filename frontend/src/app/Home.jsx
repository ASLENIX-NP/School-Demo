import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Academics from "./components/Academics";
import Facilities from "./components/Facilities";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-400 selection:text-slate-950">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Academics />
        <Facilities />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
