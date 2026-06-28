import { skills } from "../data/resume";
import "./Skills.css";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <h2 className="section-heading" data-reveal>Skills</h2>
      <div className="skills-list">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="skills-row" data-reveal>
            <div className="skills-category">{category}</div>
            <div className="skills-items">{items.join(", ")}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
