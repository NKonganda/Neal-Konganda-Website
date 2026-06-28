import { experience } from "../data/resume";
import "./Experience.css";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <h2 className="section-heading" data-reveal>Experience</h2>
      <div className="section-line" />
      <div className="exp-list">
        {experience.map(company => (
          <div key={company.company} className="exp-company" data-reveal>
            <div className="exp-company-header">
              {company.logo
                ? <img src={company.logo} alt={company.company} className="exp-logo exp-logo-img" />
                : <div className="exp-logo" />}
              <div>
                <div className="exp-company-name">{company.company}</div>
                <div className="exp-location">{company.location}</div>
              </div>
            </div>
            <div className="exp-roles">
              {company.roles.map(role => (
                <div key={role.title} className="exp-role">
                  <div className="exp-role-header">
                    <span className="exp-role-title">{role.title}</span>
                    <span className="exp-period">{role.period}</span>
                  </div>
                  <ul className="exp-bullets">
                    {role.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
