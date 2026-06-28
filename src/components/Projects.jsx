import { projects } from "../data/resume";
import ProjectThumb from "./ProjectThumb";
import "./Projects.css";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <h2 className="section-heading" data-reveal>Projects</h2>
      <div className="section-line" />
      <div className="proj-list">
        {projects.map(project => (
          <div key={project.name} className="proj-item" data-reveal>
            <div className="proj-thumb">
              {project.thumb
                ? <ProjectThumb src={project.thumb} alt={project.name} />
                : <span className="proj-thumb-label">figure</span>}
            </div>
            <div className="proj-content">
              <a
                href={project.link}
                className="proj-title"
                target="_blank"
                rel="noreferrer"
              >
                {project.name}
              </a>
              <div className="proj-desc">{project.description}</div>
              <div className="proj-meta">
                {project.tags.map(tag => (
                  <span key={tag} className="proj-tag">{tag}</span>
                ))}
                <a
                  href={project.link}
                  className="proj-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
