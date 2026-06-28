import { useRef, useEffect } from "react";
import { createScope, createTimeline, stagger } from "animejs";
import { profile } from "../data/resume";
import { EASE, DUR, reduceMotion } from "../lib/motion";
import "./Sidebar.css";

const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
];

const socials = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
];

export default function Sidebar() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (reduceMotion()) return;
    const scope = createScope({ root: rootRef.current }).add(() => {
      const tl = createTimeline({ defaults: { ease: EASE } });
      tl.add(".sidebar-photo", { opacity: [0, 1], scale: [0.97, 1], duration: 650 })
        .add(".sidebar-name", { opacity: [0, 1], translateY: [14, 0], duration: DUR.base }, "-=400")
        .add(".sidebar-title", { opacity: [0, 1], translateY: [10, 0], duration: DUR.base }, "-=420")
        .add(".chip", { opacity: [0, 1], translateY: [8, 0], duration: DUR.fast, delay: stagger(60) }, "-=380")
        .add(".sidebar-nav-item", { opacity: [0, 1], translateY: [6, 0], duration: DUR.fast, delay: stagger(50) }, "-=300");
    });
    return () => scope.revert();
  }, []);

  return (
    <aside className="sidebar" ref={rootRef}>
      <div className="sidebar-photo">
        <img src={`${import.meta.env.BASE_URL}profile.png`} alt="Neal Konganda" className="sidebar-photo-img" />
      </div>
      <h1 className="sidebar-name">{profile.name}</h1>
      <div className="sidebar-title">{profile.title}</div>

      <div className="sidebar-socials">
        {socials.map(s => (
          <a
            key={s.label}
            href={s.href}
            className="chip"
            target={s.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noreferrer"
          >
            {s.label}
          </a>
        ))}
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-marker" aria-hidden="true" />
        {navItems.map(n => (
          <a key={n.label} href={n.href} className="sidebar-nav-item">
            <span className="sidebar-nav-dot" />
            {n.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
