import { Link } from "react-router-dom";

const highlights = [
  ["1,250+", "Students enrolled", "#38bdf8"], ["85+", "Dedicated educators", "#facc15"],
  ["20 yrs", "Growing with Nepal", "#22c55e"], ["98%", "SEE success rate", "#a78bfa"],
];
const programs = [
  ["✦", "Early Years", "A warm, playful beginning that builds curiosity and confidence."],
  ["⌁", "Academic Excellence", "Strong foundations, caring teachers and modern learning resources."],
  ["◉", "Beyond the Classroom", "Sports, arts, clubs and leadership opportunities for every child."],
];

export default function Home() {
  return <div className="school-site">
    <header className="home-nav">
      <Link to="/" className="home-brand"><span>SS</span><div>Smriti <b>School</b><small>LEARN · GROW · LEAD</small></div></Link>
      <nav><a href="#about">About</a><a href="#programs">Academics</a><a href="#news">Notices</a><a href="#contact">Contact</a></nav>
      <Link className="nav-admission" to="/login">Admin portal ↗</Link>
    </header>

    <main>
      <section className="hero-modern">
        <div className="hero-copy"><p className="hero-badge">✦ Admissions open for Academic Year 2083</p><h1>Where young minds<br/><em>find their future.</em></h1><p>Smriti School is a joyful learning community where academic confidence, creativity and character grow together.</p><div className="hero-actions"><a href="#contact" className="gold-button">Start admission <span>→</span></a><a href="#programs" className="outline-button">Explore our school</a></div><div className="hero-stat-row">{highlights.slice(0,3).map(s=><div key={s[1]}><b>{s[0]}</b><small>{s[1]}</small></div>)}</div></div>
        <div className="hero-photo"><img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85" alt="Students learning together"/><div className="photo-label"><span>SMRITI SCHOOL</span><b>A safe place to learn,<br/>discover and belong.</b></div><div className="float-card top">✦ <div><b>Quality education</b><small>Academics + values</small></div></div><div className="float-card bottom">◉ <div><b>Learning beyond books</b><small>Creative, active, connected</small></div></div></div>
      </section>
      <section className="highlight-band">{highlights.map(s=><div key={s[1]}><b style={{color:s[2]}}>{s[0]}</b><span>{s[1]}</span></div>)}</section>
      <section className="about-modern" id="about"><div className="section-kicker">OUR STORY</div><h2>Rooted in care. <em>Ready for tomorrow.</em></h2><div className="about-grid"><p>At Smriti School, every learner is known, encouraged and challenged. We combine meaningful academics with experiences that help children become capable, compassionate citizens.</p><div><p>From early years to secondary education, our teachers create a welcoming environment where questions matter and progress is celebrated.</p><a href="#programs">Discover our approach →</a></div></div></section>
      <section id="programs" className="programs-modern"><div><p className="section-kicker">LEARNING AT SMRITI</p><h2>More than a<br/><em>school day.</em></h2><p className="section-desc">A balanced education shaped around each student's potential.</p></div><div className="program-list">{programs.map((p,i)=><article key={p[1]}><span>{p[0]}</span><div><small>0{i+1}</small><h3>{p[1]}</h3><p>{p[2]}</p></div><b>→</b></article>)}</div></section>
      <section id="news" className="news-modern"><p className="section-kicker">SCHOOL UPDATES</p><h2>What's happening <em>at Smriti.</em></h2><div className="news-grid"><article><small>BHADRA 10–14, 2083</small><h3>Annual sports week registration is now open</h3><a href="#contact">Read notice →</a></article><article><small>BHADRA 18, 2083</small><h3>First terminal examinations begin this month</h3><a href="#contact">View schedule →</a></article><article className="news-accent"><span>✦</span><h3>Come visit our campus.</h3><a href="#contact">Book a school tour →</a></article></div></section>
      <section id="contact" className="contact-modern"><div><p className="section-kicker">JOIN OUR COMMUNITY</p><h2>Let’s begin a bright<br/><em>new chapter.</em></h2><p>Visit our campus or talk with our admissions team to learn more about Smriti School.</p></div><div className="contact-actions"><a className="gold-button" href="mailto:info@smritischool.edu.np">Contact admissions <span>→</span></a><p>+977 01-XXXXXXX<br/>info@smritischool.edu.np</p></div></section>
    </main>
    <footer className="home-footer"><div className="home-brand"><span>SS</span><div>Smriti <b>School</b><small>LEARN · GROW · LEAD</small></div></div><p>© 2083 Smriti School · Kathmandu, Nepal</p><Link to="/login">Administration</Link></footer>
  </div>;
}
