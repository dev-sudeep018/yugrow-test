import { useEffect, useRef, useState } from "react";
import SingleGlossySphere from "./single-glossy-sphere";

export default function GlossyCursor() {
  const shellRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [sphereReady, setSphereReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!query.matches) return undefined;

    setEnabled(true);
    document.body.classList.add("has-glossy-cursor");
    const move = (event) => {
      const shell = shellRef.current;
      if (!shell) return;
      shell.style.transform = `translate3d(${event.clientX - 18}px, ${event.clientY - 18}px, 0)`;
      shell.classList.add("is-visible");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("has-glossy-cursor");
    };
  }, []);

  if (!enabled) return null;

  return <div className={"glossy-cursor-shell" + (sphereReady ? " sphere-ready" : "")} ref={shellRef} aria-hidden="true">
    <span className="glossy-cursor-fallback" />
    <SingleGlossySphere
      onReady={() => setSphereReady(true)}
      speed={38}
      scale={66}
      displacement={18}
      bands={4}
      iridescence={72}
      baseColor="#b9c4c1"
      background="#000000"
      autoRotate
      rotateSpeed={48}
      advanced={{
        skyColor: "#f5f6ee",
        horizonColor: "#82c2b9",
        shadowColor: "#20282b",
        grooveColor: "#596460",
        lightAngle: 38,
        lightPower: 118,
        shininess: 24,
        rim: 82,
        filmBands: 54,
        filmPatches: 42,
        grooveDark: 42,
        glowColor: "#e8a281",
        glowSize: 1,
        glow: 0,
        exposure: 104,
        steps: 20,
        resolution: 62,
        grain: 0,
        vignette: 0,
      }}
      style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0, background: "transparent" }}
    />
  </div>;
}
