import { education } from "../data/resume";
import "./Education.css";

export default function Education() {
  return (
    <section id="education" className="section">
      <h2 className="section-heading" data-reveal>Education</h2>
      <div className="section-line" />
      <div className="edu-list">
        <div className="edu-item" data-reveal>
          {education.logo
            ? <img src={education.logo} alt={education.school} className="edu-logo edu-logo-img" />
            : <div className="edu-logo" />}
          <div className="edu-content">
            <div className="edu-school">{education.school}</div>
            <div className="edu-degree">{education.degree}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
