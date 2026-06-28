import "./About.css";

export default function About() {
  return (
    <section className="about" data-reveal>
      <p>
        I&rsquo;m a Computer Science student at <strong>Emory University</strong>, working
        with the application of machine learning.
      </p>
      <p>
        My experience spans building AI agent infrastructure at{" "}
        <a href="#experience">Qualcomm</a>, developing ML forecasting systems at{" "}
        <a href="#experience">American Airlines</a>, and processing ECG waveform data
        for clinical research at the{" "}
        <a href="#experience">MAIX Lab</a>.
      </p>
      <p>
        I&rsquo;m drawn to the using machine learning to solve modern problems
      </p>
    </section>
  );
}
