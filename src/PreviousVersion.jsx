import { useEffect, useState } from "react";
import GlossyCursor from "./components/glossy-cursor.jsx";
import PrismFilm from "./components/prism-film.tsx";
import LiquidFilm from "./components/liquid-film.tsx";
import MosaicLens from "./components/mosaic-lens.tsx";
import HalftoneBloom from "./components/halftone-bloom.tsx";
import "../styles.css";

const fields = {
  hero: { Effect: PrismFilm, props: { background: "#dfff32", color1: "#2445ff", color2: "#ff543d", speed: 20, size: 112, angle: 122, split: 11, hover: 118, reach: 320 } },
  idea: { Effect: LiquidFilm, props: { background: "#f4f0e2", color1: "#9ef0de", color2: "#ff704f", speed: 17, size: 116, angle: 28, flow: 130, ripple: 112, hover: 110, reach: 360 } },
  routes: { Effect: MosaicLens, props: { background: "#ff94cf", color1: "#2445ff", color2: "#dfff32", speed: 24, size: 112, angle: 26, tileSize: 17, hover: 120, reach: 340 } },
  people: { Effect: LiquidFilm, props: { background: "#2445ff", color1: "#9ef0de", color2: "#ff94cf", speed: 16, size: 125, angle: 116, flow: 142, ripple: 126, hover: 115, reach: 360 } },
  method: { Effect: PrismFilm, props: { background: "#f4f0e2", color1: "#dfff32", color2: "#ff543d", speed: 15, size: 121, angle: -24, split: 8, hover: 105, reach: 330 } },
  creative: { Effect: HalftoneBloom, props: { background: "#ff704f", color1: "#2445ff", color2: "#ff94cf", speed: 20, size: 122, angle: 162, dotSize: 8, hover: 132, reach: 390 } },
  brief: { Effect: PrismFilm, opacity: 0.5, props: { background: "#101010", color1: "#dfff32", color2: "#ff543d", speed: 16, size: 122, angle: 145, split: 10, hover: 112, reach: 330 } },
};

function SectionField({ name, active }) {
  const config = fields[name];

  if (!config) return null;
  const { Effect, props, opacity = 1 } = config;
  return <div className="section-background" data-field={name} aria-hidden="true">
    {active && <Effect {...props} style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0, background: "transparent", opacity }} />}
  </div>;
}

function Brand({ footer = false }) {
  return <a className={footer ? "footer-brand" : "brand"} href="#top" aria-label="Yugrow home">
    <img className="brand-lockup" src={footer ? "./assets/yugrow-lockup-light.png" : "./assets/yugrow-lockup.png"} alt="yugrow" />
  </a>;
}

const methodStages = [
  "Discovery", "Audit", "Strategy", "Create", "Distribute", "Optimize", "Report",
];

export default function PreviousVersion() {
  const [activeField, setActiveField] = useState("hero");

  useEffect(() => {
    import("../scene.js");
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setActiveField(null);
      return;
    }
    const sections = [...document.querySelectorAll("main section")];
    if (!("IntersectionObserver" in window)) return;
    const visibility = new Map(sections.map((section) => [section.querySelector(".section-background")?.dataset.field, 0]));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const name = entry.target.querySelector(".section-background")?.dataset.field;
        if (name) visibility.set(name, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      const [name, ratio] = [...visibility.entries()].sort((a, b) => b[1] - a[1])[0] || [];
      setActiveField(ratio > 0.02 ? name : null);
    }, { threshold: [0, 0.12, 0.3, 0.55, 0.8] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const selectors = ".site-header, .hero, .thesis, .routes-section, .network-section, .method-section, .creative-section, .brief-section";
    const surfaces = [...document.querySelectorAll(selectors)];
    let point = null;
    let raf = 0;
    const update = () => {
      raf = 0;
      for (const surface of surfaces) {
        const rect = surface.getBoundingClientRect();
        const inside = point && point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
        surface.style.setProperty("--pointer-x", `${inside ? ((point.x - rect.left) / rect.width) * 100 : 50}%`);
        surface.style.setProperty("--pointer-y", `${inside ? ((point.y - rect.top) / rect.height) * 100 : 50}%`);
        surface.style.setProperty("--pointer-active", inside ? "1" : "0");
      }
    };
    const onMove = (event) => {
      point = { x: event.clientX, y: event.clientY };
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLeave = () => {
      point = null;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <>
    <GlossyCursor />
    <header className="site-header">
      <div className="header-brand-group">
        <Brand />
      </div>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a className="nav-link" href="#routes" data-nav="0"><span>Growth paths</span></a>
        <a className="nav-link" href="#method" data-nav="1"><span>How we work</span></a>
        <a className="nav-link" href="#creative" data-nav="2"><span>Creative system</span></a>
      </nav>
      <a className="header-cta" href="#brief"><span>Start a brief</span><span className="header-cta-arrow" aria-hidden="true">↗</span></a>
      <button className="menu-toggle" type="button" aria-expanded="false" aria-label="Open navigation"><span /><span /><b>MENU</b></button>
    </header>
    <nav className="mobile-menu" aria-label="Mobile navigation" aria-hidden="true">
      <a href="#routes">Growth paths</a>
      <a href="#method">How we work</a>
      <a href="#creative">Creative</a>
      <a href="#brief">Start a brief</a>
    </nav>

    <main>
      <section className="hero" id="top" data-scroll-motion="hero" aria-labelledby="hero-title">
        <span className="chapter-transition" data-transition="hero" aria-hidden="true" />
        <SectionField name="hero" active={activeField === "hero"} />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><i className="eyebrow-square" />Growth for brands + creators</p>
            <h1 id="hero-title"><span>Make</span><span>growth</span><span>mean <em className="hero-more">more.</em></span></h1>
            <p className="hero-deck">We connect strategy, creative, distribution and customer experience so brands grow revenue and creators grow audiences.</p>
            <div className="hero-actions">
              <a className="button button-ink" href="#routes">Find your growth path <span>↓</span></a>
              <a className="text-link" href="#method">See the method <span>↘</span></a>
            </div>
          </div>
          <figure className="hero-art" aria-label="Abstract portrait in reflective liquid chrome">
            <div className="hero-art-grid" />
            <div className="hero-art-word" aria-hidden="true">YUGROW</div>
            <canvas id="liquid-face" aria-hidden="true" />
            <img className="face-fallback" src="./assets/liquid-chrome-face-cutout.png" alt="" />
          </figure>
        </div>
      </section>

      <section className="thesis" data-scroll-motion="gather" aria-labelledby="thesis-title">
        <span className="chapter-transition" data-transition="gather" aria-hidden="true" />
        <SectionField name="idea" active={activeField === "idea"} />
        <div className="thesis-main">
          <h2 id="thesis-title">Good growth doesn’t happen in a straight line. <em>It gathers.</em></h2>
          <div className="thesis-flow">
            <img src="./assets/growth-loop.svg" alt="" />
            <p>A message earns attention. A useful experience builds trust. A good next step creates a reason to return. Then what people do shapes what happens next.</p>
          </div>
        </div>
        <div className="thesis-steps" aria-label="Four connected growth moments">
          <div><strong>Find the signal</strong><span>Start with what matters to the audience.</span></div>
          <div><strong>Shape the story</strong><span>Give the value a clear point of view.</span></div>
          <div><strong>Carry it forward</strong><span>Make the next step feel natural.</span></div>
          <div><strong>Learn and improve</strong><span>Let the response guide the next move.</span></div>
        </div>
      </section>

      <section className="routes-section" id="routes" data-scroll-motion="branch" aria-labelledby="routes-title">
        <span className="chapter-transition" data-transition="branch" aria-hidden="true" />
        <SectionField name="routes" active={activeField === "routes"} />
        <div className="routes-heading">
          <h2 id="routes-title">Built for what<br />you’re <em>building.</em></h2>
          <p>Different starting points. One connected approach that joins the story, the channels and the next customer moment.</p>
        </div>
        <div className="route-tabs" role="tablist" aria-label="Choose your growth path">
          <button className="route-tab is-active" id="route-brand-tab" type="button" role="tab" aria-selected="true" data-route="brand">D2C brands <b>↗</b></button>
          <button className="route-tab" id="route-creator-tab" type="button" role="tab" aria-selected="false" data-route="creator" tabIndex={-1}>Creators <b>↗</b></button>
        </div>
        <div className="route-explorer" id="route-panel" role="tabpanel" aria-labelledby="route-brand-tab">
          <div className="route-map">
            <p className="route-map-title" id="route-map-title">A customer journey</p>
            <ol className="route-map-steps" id="route-map-steps">
              <li><span>Discover</span></li><li><span>Understand</span></li><li><span>Choose</span></li><li><span>Return</span></li>
            </ol>
            <p className="route-map-foot" id="route-map-foot">From first view to the next order</p>
          </div>
          <div className="route-details">
            <h3 id="route-title">Make each<br />touchpoint work<br />as one.</h3>
            <p className="route-description" id="route-description">Connect social, creative, paid media and the on-site experience around a clear reason to buy and come back.</p>
            <ul className="service-list" id="route-services">
              <li>Social strategy + content</li><li>Creative production + motion</li><li>Meta + Google advertising</li><li>Landing pages + conversion</li><li>Influencer, retention + analytics</li>
            </ul>
          </div>
        </div>
        <p className="route-note">The right mix depends on the business, the audience and the opportunity in front of you.</p>
      </section>

      <section className="network-section" data-scroll-motion="orbit" aria-labelledby="network-title">
        <span className="chapter-transition" data-transition="orbit" aria-hidden="true" />
        <SectionField name="people" active={activeField === "people"} />
        <div className="network-layout">
          <div className="network-copy">
            <h2 id="network-title">Reach is a start.<br /><em>Relevance</em> is the point.</h2>
            <p>Creators, communities and customers connect ideas to the people most likely to care. We build distribution around the quality of that connection.</p>
            <div className="network-legend"><span><i className="dot dot-coral" />CREATORS</span><span><i className="dot dot-lime" />COMMUNITIES</span><span><i className="dot dot-pink" />CUSTOMERS</span></div>
          </div>
          <figure className="network-figure">
            <img src="./assets/node_garden.svg" alt="A network of connected nodes representing people and communities" />
            <figcaption>Build the connection before you amplify it.</figcaption>
          </figure>
        </div>
      </section>

      <section className="method-section" id="method" data-scroll-motion="sequence" aria-labelledby="method-title">
        <span className="chapter-transition" data-transition="sequence" aria-hidden="true" />
        <SectionField name="method" active={activeField === "method"} />
        <div className="method-heading">
          <h2 id="method-title">A connected<br />way to <em>grow.</em></h2>
          <p className="method-intro">From a first look at the business to a clear report and next move, each stage gives the next one better context.</p>
        </div>
        <div className="method-layout">
          <div className="method-index" role="tablist" aria-label="Seven-stage growth process">
            {methodStages.map((stage, index) => <button key={stage} className={index === 0 ? "method-step is-active" : "method-step"} id={`stage-tab-${index}`} type="button" role="tab" aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} data-stage={index}>{stage}</button>)}
          </div>
          <div className="method-panel" id="method-panel" role="tabpanel" aria-labelledby="stage-tab-0">
            <h3 id="method-current-title">Start with<br />the real picture.</h3>
            <p id="method-current-copy">Understand the business, product, audience, goals and competitors before choosing what to change.</p>
            <div className="method-output"><span>Outcome</span><b id="method-current-output">A shared view of the opportunity.</b></div>
            <div className="method-progress" aria-hidden="true"><span id="method-progress-fill" /></div>
          </div>
        </div>
      </section>

      <section className="creative-section" id="creative" data-scroll-motion="reel" aria-labelledby="creative-title">
        <span className="chapter-transition" data-transition="reel" aria-hidden="true" />
        <SectionField name="creative" active={activeField === "creative"} />
        <div className="creative-heading">
          <h2 id="creative-title">Make the idea<br /><em>easy to feel.</em></h2>
          <p>One idea changes shape across the story. Select a moment to see how the creative job moves from first frame to next step.</p>
        </div>
        <div className="creative-lab">
          <div className="creative-poster" aria-label="Interactive creative example">
            <img src="./assets/flow_lines.svg" alt="" />
            <div className="poster-word" id="creative-word">STOP<br />THE<br />SCROLL.</div>
          </div>
          <div className="creative-controls">
            <div className="creative-tabs" role="tablist" aria-label="Creative sequence">
              <button className="creative-tab is-active" id="creative-tab-0" type="button" role="tab" aria-selected="true" data-creative="0">Stop</button>
              <button className="creative-tab" id="creative-tab-1" type="button" role="tab" aria-selected="false" data-creative="1" tabIndex={-1}>Show</button>
              <button className="creative-tab" id="creative-tab-2" type="button" role="tab" aria-selected="false" data-creative="2" tabIndex={-1}>Invite</button>
            </div>
            <div className="creative-detail" id="creative-detail" role="tabpanel" aria-labelledby="creative-tab-0">
              <h3 id="creative-detail-title">Earn the pause.</h3>
              <p id="creative-detail-copy">Lead with one clear visual idea. The first frame gives the audience a reason to stay long enough for the story.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="brief-section" id="brief" aria-labelledby="brief-title">
        <SectionField name="brief" active={activeField === "brief"} />
        <div className="brief-layout">
          <div className="brief-copy">
            <h2 id="brief-title">Start with a<br /><em>real question.</em></h2>
            <p>Choose a starting point and the challenge on your mind. We’ll turn it into a short brief you can keep or share.</p>
          </div>
          <form className="brief-builder" id="brief-form">
            <label htmlFor="brief-route">I’m growing</label>
            <select id="brief-route" name="route"><option value="a D2C brand">a D2C brand</option><option value="a creator platform">a creator platform</option></select>
            <label htmlFor="brief-focus">The challenge I want to work on</label>
            <select id="brief-focus" name="focus"><option value="getting the story clear">Getting the story clear</option><option value="making better creative">Making better creative</option><option value="reaching the right people">Reaching the right people</option><option value="improving the customer journey">Improving the customer journey</option><option value="building a stronger return loop">Building a stronger return loop</option></select>
            <button className="button button-lime" type="submit">Copy a starting brief <span>↗</span></button>
            <p className="brief-status" id="brief-status" role="status">This stays on your device. Nothing is sent or stored.</p>
          </form>
        </div>
        <footer className="brief-footer">
          <Brand footer />
          <a className="back-top" href="#top">Back to the top <span>↑</span></a>
        </footer>
      </section>
    </main>
  </>;
}
