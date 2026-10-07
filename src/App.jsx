import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { Link000, Link003, Link004, Link005 } from "@/components/ui/skiper-ui/skiper40";
import LiquidMetal from "@/components/liquid-metal";
import GlossyCursor from "@/components/glossy-cursor";

const HeroPortrait = lazy(() => import("@/components/hero-portrait"));
const SwellGrid = lazy(() => import("@/components/swell-grid"));

const moments = [
  {
    id: "notice",
    name: "Notice",
    short: "Earn an honest pause.",
    detail: "A specific point of view gives the right person a reason to look twice.",
    tone: "notice",
  },
  {
    id: "trust",
    name: "Trust",
    short: "Make the value clear.",
    detail: "Story, product and proof meet in the same moment. Interest gets somewhere to land.",
    tone: "trust",
  },
  {
    id: "choose",
    name: "Choose",
    short: "Make the next step easy.",
    detail: "A useful experience carries attention into a decision without losing the human thread.",
    tone: "choose",
  },
  {
    id: "return",
    name: "Return",
    short: "Give them a way back.",
    detail: "What people respond to shapes the next round. Good growth remembers.",
    tone: "return",
  },
];

const routes = {
  brands: {
    tab: "D2C brands",
    title: <>Make the whole<br />brand <em>add up.</em></>,
    copy: "Bring the story, shop, creators and follow-up into one experience people can recognise and choose again.",
    touchpoints: ["The first look", "The product page", "The next visit"],
    capabilities: ["Positioning and offer", "Creator partnerships", "Creative and distribution", "Retention"],
  },
  creators: {
    tab: "Creators",
    title: <>Turn your point<br />of view into<br /><em>a practice.</em></>,
    copy: "Build a recognisable format around your voice, then give good ideas more places to travel.",
    touchpoints: ["Your voice", "A format people know", "The next opportunity"],
    capabilities: ["Positioning and format", "Scripting and motion", "Platform distribution", "Partnership readiness"],
  },
};

const disciplines = [
  {
    title: "Find the reason to care.",
    body: "Shape the position, audience and offer before the work starts moving.",
    visual: "STRATEGY",
    color: "strategy",
  },
  {
    title: "Make the idea travel.",
    body: "Turn the point of view into creative people recognise across content, creators and campaigns.",
    visual: "CREATIVE",
    color: "creative",
  },
  {
    title: "Carry it into the next step.",
    body: "Connect distribution, the on-site experience and retention so every handoff makes sense.",
    visual: "EXPERIENCE",
    color: "experience",
  },
];

function BrandMark({ light = false }) {
  return <svg className={"brand-mark" + (light ? " brand-mark-light" : "")} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M32 49V32M32 32C21 30 15 22 12 12M32 32C43 30 49 22 52 12M16 44c1 8 7 12 16 12s15-4 16-12" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function Brand({ light = false }) {
  return <a className={"brand" + (light ? " brand-light" : "")} href="#top" aria-label="Yugrow home">
    <BrandMark light={light} /><span>YUGROW</span>
  </a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <>
    <header className="site-header" id="top">
      <Brand light />
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link000 href="#system">The system</Link000>
        <Link000 href="#paths">Who it’s for</Link000>
        <Link000 href="#practice">What we do</Link000>
      </nav>
      <Link004 className="header-cta" href="#contact">Let’s talk <ArrowUpRight size={16} /></Link004>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
    <AnimatePresence>
      {open && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
        <a href="#system" onClick={close}>The system</a>
        <a href="#paths" onClick={close}>Who it’s for</a>
        <a href="#practice" onClick={close}>What we do</a>
        <a href="#contact" onClick={close}>Let’s talk</a>
      </motion.nav>}
    </AnimatePresence>
  </>;
}

function Hero() {
  const reduceMotion = useReducedMotion();
  return <section className="hero" aria-labelledby="hero-title">
    <LiquidMetal
      className="hero-liquid"
      colors={["#0d1615", "#173a37", "#668f83", "#c9d18b", "#dd7357", "#ece7d8"]}
      refraction={1.25}
      frost={2}
      angle={-52}
      twist={1.7}
      stretch={4.5}
      bands={2.7}
      relief={4}
      scale={4.2}
      flow={2.1}
      shimmer={2.7}
      sweep={2.4}
      style={{ position: "absolute", inset: 0, opacity: 0.68 }}
    />
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-inner">
      <motion.div
        className="hero-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.2, 0.7, 0.15, 1] }}
      >
        <p className="hero-intro-line">Yugrow is a growth team for brands and creators.</p>
        <h1 id="hero-title">Make the first<br />look mean<br /><em>something.</em></h1>
        <p className="hero-description">We connect story, creative, distribution and follow-through so the whole experience gives people a reason to choose you again.</p>
        <div className="hero-actions">
          <Link004 className="button button-lime" href="#system">See how it connects <ArrowRight size={17} /></Link004>
          <Link000 className="hero-secondary" href="#paths">Find your growth path</Link000>
        </div>
      </motion.div>
      <figure className="portrait-stage" aria-label="Animated liquid chrome face">
        <div className="portrait-colour" aria-hidden="true" />
        <Suspense fallback={<div className="portrait-fallback" />}>
          <HeroPortrait />
        </Suspense>
      </figure>
      <p className="hero-bottom-note">Growth that keeps the human in the loop.</p>
    </div>
  </section>;
}

function SystemSection() {
  const reduceMotion = useReducedMotion();
  return <section className="system-section" id="system">
    <div className="section-heading">
      <div>
        <p className="eyebrow">Growth, as people experience it</p>
        <h2>A scroll stops.<br />A reason <em>lands.</em><br />A relationship starts.</h2>
      </div>
      <p className="section-lede">People don’t meet your media plan, your landing page and your follow-up as separate departments. They meet one brand. We make the handoffs feel like one conversation.</p>
    </div>
    <div className="moment-grid">
      {moments.map((moment, index) => <motion.article
        key={moment.id}
        className={"moment-card moment-" + moment.tone}
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{ delay: reduceMotion ? 0 : index * 0.075, duration: 0.55 }}
      >
        <div className="moment-art" aria-hidden="true"><span>{moment.name}</span></div>
        <h3>{moment.short}</h3>
        <p>{moment.detail}</p>
      </motion.article>)}
    </div>
    <p className="system-signoff">Not four disconnected tactics. One experience with somewhere to go.</p>
  </section>;
}

function PathArtwork({ route, active }) {
  return <div className={"path-art path-art-" + active} aria-hidden="true">
    <div className="path-art-backdrop" />
    <div className="touchpoint touchpoint-one"><span>{route.touchpoints[0]}</span></div>
    <div className="touchpoint touchpoint-two"><span>{route.touchpoints[1]}</span></div>
    <div className="touchpoint touchpoint-three"><span>{route.touchpoints[2]}</span></div>
    <div className="touchpoint-join" />
  </div>;
}

function PathSection() {
  const [active, setActive] = useState("brands");
  const route = routes[active];
  return <section className="path-section" id="paths">
    <div className="path-heading">
      <div>
        <p className="eyebrow">Two starting points, one connected approach</p>
        <h2>Good growth<br />fits the thing<br /><em>you’re building.</em></h2>
      </div>
      <div className="path-switch" role="tablist" aria-label="Choose the kind of growth support">
        {Object.entries(routes).map(([key, item]) => <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          className={active === key ? "is-active" : ""}
          onClick={() => setActive(key)}
        >{item.tab}</button>)}
      </div>
    </div>
    <AnimatePresence mode="wait">
      <motion.div
        className={"path-content path-content-" + active}
        key={active}
        role="tabpanel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.32, ease: [0.2, 0.7, 0.1, 1] }}
      >
        <div className="path-copy">
          <h3>{route.title}</h3>
          <p>{route.copy}</p>
          <Link003 className="path-link" href="#contact">Talk through your next move <ArrowRight size={17} /></Link003>
          <ul>{route.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <PathArtwork route={route} active={active} />
      </motion.div>
    </AnimatePresence>
  </section>;
}

function PracticeSection() {
  const reduceMotion = useReducedMotion();
  return <section className="practice-section" id="practice">
    <div className="practice-heading">
      <div>
        <p className="eyebrow">Where the work meets</p>
        <h2>Make the handoff<br /><em>the advantage.</em></h2>
      </div>
      <p className="section-lede">A sharp idea shouldn’t lose its meaning between the feed, the store and the next conversation.</p>
    </div>
    <div className="practice-grid">
      {disciplines.map((item, index) => <motion.article
        key={item.title}
        className={"practice-card practice-" + item.color}
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: reduceMotion ? 0 : index * 0.08, duration: 0.5 }}
      >
        <div className="practice-art" aria-hidden="true"><span>{item.visual}</span><i /></div>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </motion.article>)}
    </div>
    <div className="practice-footer"><span>Strategy</span><b>→</b><span>Creative</span><b>→</b><span>Distribution</span><b>→</b><span>Learning</span></div>
  </section>;
}

function ResponseSection() {
  const [active, setActive] = useState(moments[0]);
  const palettes = {
    notice: { background: "#162321", baseColor: "rgba(224, 245, 205, 0.94)" },
    trust: { background: "#283724", baseColor: "rgba(255, 139, 102, 0.93)" },
    choose: { background: "#173637", baseColor: "rgba(139, 224, 218, 0.94)" },
    return: { background: "#283525", baseColor: "rgba(239, 213, 126, 0.94)" },
  };
  const palette = palettes[active.id];
  return <section className="response-section" aria-labelledby="response-title">
    <div className="response-copy">
      <p className="eyebrow">Growth listens back</p>
      <h2 id="response-title">The signal is<br />in what people <em>do.</em></h2>
      <p className="response-lede">A pause, a click, a purchase, a return. Audience behaviour tells us what to keep, what to change and what the next move should be.</p>
      <div className="response-tabs" role="tablist" aria-label="Choose a customer moment">
        {moments.map((moment) => <button
          key={moment.id}
          type="button"
          role="tab"
          aria-selected={active.id === moment.id}
          className={active.id === moment.id ? "is-active" : ""}
          onClick={() => setActive(moment)}
        >{moment.name}</button>)}
      </div>
      <AnimatePresence mode="wait">
        <motion.p className="response-detail" key={active.id} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: 0.2 }}>
          {active.detail}
        </motion.p>
      </AnimatePresence>
    </div>
    <div className="response-field" style={{ background: palette.background }} aria-label="Interactive field responds to pointer movement">
      <Suspense fallback={<div className="response-fallback" />}>
        <SwellGrid
          background={palette.background}
          baseColor={palette.baseColor}
          size={10}
          aspect={390}
          gap={3}
          rounded={56}
          speed={36}
          wave={{ length: 120, direction: 67, contrast: 112, fog: 10 }}
          cursor={{ hover: 82, reach: 54, damping: 11 }}
          style={{ position: "absolute", inset: 0, minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}
        />
      </Suspense>
      <div className="response-field-caption">The field shifts with your attention.</div>
    </div>
  </section>;
}

function Contact() {
  return <section className="contact-section" id="contact">
    <LiquidMetal
      className="contact-liquid"
      colors={["#101a18", "#17544c", "#75b8a4", "#d2de79", "#e97855", "#f0e5c9"]}
      refraction={1.5}
      frost={1.8}
      angle={-30}
      twist={2.5}
      stretch={5.2}
      bands={3.6}
      relief={5}
      scale={3.7}
      flow={1.8}
      shimmer={2.4}
      sweep={2}
      style={{ position: "absolute", inset: 0, opacity: 0.62 }}
    />
    <div className="contact-shade" aria-hidden="true" />
    <div className="contact-content">
      <p className="eyebrow">For the brand or creator with somewhere to go</p>
      <h2>Let’s make<br />the next move<br /><em>matter.</em></h2>
      <p>Tell us what you’re building and where it feels stuck. We’ll find the part that can move.</p>
      <div className="contact-actions">
        <Link005 className="contact-button" href="mailto:hello@yugrow.com?subject=Let%27s%20talk%20growth">Start a conversation <ArrowUpRight size={18} /></Link005>
        <Link000 className="contact-top" href="#top">Back to the beginning</Link000>
      </div>
    </div>
    <div className="contact-mark"><BrandMark light /></div>
  </section>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-main">
      <Brand />
      <p>Good growth makes<br />the whole thing add up.</p>
      <nav aria-label="Footer navigation">
        <a href="#system">The system</a>
        <a href="#paths">Who it’s for</a>
        <a href="#practice">What we do</a>
        <a href="mailto:hello@yugrow.com">Say hello <ArrowUpRight size={14} /></a>
      </nav>
    </div>
    <div className="footer-bottom"><span>© YUGROW</span><span>Built around people.</span></div>
  </footer>;
}

export default function App() {
  return <>
    <GlossyCursor />
    <Header />
    <main>
      <Hero />
      <SystemSection />
      <PathSection />
      <PracticeSection />
      <ResponseSection />
      <Contact />
    </main>
    <Footer />
  </>;
}
