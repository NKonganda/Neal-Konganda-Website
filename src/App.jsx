import { useEffect, useRef } from "react";
import { createScope, animate, onScroll } from "animejs";
import Sidebar from "./components/Sidebar";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import { reveal, reduceMotion, EASE, DUR } from "./lib/motion";
import "./App.css";

export default function App() {
  const layoutRef = useRef(null);

  useEffect(() => {
    const root = layoutRef.current;
    if (!root) return;

    const scope = createScope({ root }).add(() => {
      if (reduceMotion()) return;
      root.querySelectorAll("[data-reveal]").forEach(el => reveal(el));
      root.querySelectorAll(".section-line").forEach(line => {
        animate(line, {
          scaleX: [0, 1],
          duration: DUR.base,
          ease: EASE,
          autoplay: onScroll({ target: line, enter: "bottom-=10%", once: true }),
        });
      });
    });

    // Scroll progress rail — manual rAF for reliability
    const fill = root.querySelector(".progress-fill");
    let rafId;
    const updateProgress = () => {
      if (!fill) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      fill.style.transform = `scaleY(${pct})`;
    };
    const onScrollProgress = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };
    if (!reduceMotion() && fill) {
      window.addEventListener("scroll", onScrollProgress, { passive: true });
      updateProgress();
    }

    // Active-nav follower — IntersectionObserver
    let navIO;
    if (!reduceMotion()) {
      const marker = root.querySelector(".sidebar-nav-marker");
      const navItemEls = Array.from(root.querySelectorAll(".sidebar-nav-item"));
      if (marker && navItemEls.length) {
        animate(marker, { opacity: [0, 1], duration: 300, delay: 900 });
        const sectionIds = ["experience", "projects", "education"];
        const moveTo = (index) => {
          const target = navItemEls[index];
          if (!target) return;
          animate(marker, {
            translateY: target.offsetTop - navItemEls[0].offsetTop,
            ease: "outQuart",
            duration: 350,
          });
        };
        navIO = new IntersectionObserver(
          (entries) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                const i = sectionIds.indexOf(e.target.id);
                if (i >= 0) moveTo(i);
              }
            });
          },
          { threshold: 0.25, rootMargin: "-10% 0px -55% 0px" }
        );
        sectionIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) navIO.observe(el);
        });
      }
    }

    const fallback = setTimeout(() => {
      root.querySelectorAll("[data-reveal]").forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }, 2500);

    return () => {
      clearTimeout(fallback);
      scope.revert();
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollProgress);
      navIO?.disconnect();
    };
  }, []);

  return (
    <div className="layout" ref={layoutRef}>
      <div className="progress-rail" aria-hidden="true">
        <div className="progress-fill" />
      </div>
      <Sidebar />
      <main className="main">
        <About />
        <Experience />
        <Projects />
        <Education />
        <footer className="footer">
          © 2026 Neal Konganda. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
