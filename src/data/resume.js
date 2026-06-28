export const profile = {
  name: "Neal Konganda",
  email: "neal.konganda@emory.edu",
  linkedin: "https://www.linkedin.com/in/nealkonganda/",
  github: "https://github.com/NKonganda",
  title: "Computer Science Student & Software Engineer",
};

export const education = {
  school: "Emory University",
  logo: `${import.meta.env.BASE_URL}logos/emory.svg`,
  location: "Atlanta, GA",
  degree: "Bachelor of Science, Computer Science",
  courses: [
    "Data Structures & Algorithms",
    "Data Mining",
    "Machine Learning",
    "Computer Architecture",
    "Linear Programming",
    "Discrete Math",
    "Linear Algebra",
  ],
};

export const experience = [
  {
    company: "Qualcomm Inc.",
    logo: `${import.meta.env.BASE_URL}logos/qualcomm.svg`,
    location: "San Diego, CA",
    roles: [
      {
        title: "AI Engineer Intern",
        period: "May 2026 – Aug. 2026",
        bullets: [
          "Built a dashboard for managing AI agent fleets using React, Fastify, Drizzle, Postgres, and Claude SDK.",
          "Implemented Azure AD SSO with session persistence, team-based permissions, and CSRF protection.",
          "Shipped end-to-end workflow: Jira/GitHub connectors to agent specs, codebase context agent (QODO) to orchestrating agent, monitoring personas with custom marketplace, and QA agent with report notifications.",
        ],
      },
      {
        title: "Software Engineer Intern",
        period: "May 2025 – Aug. 2025",
        bullets: [
          "Built MCP servers enabling LLMs to securely query enterprise SQL and VectorDB sources, improving internal tool-augmented reasoning workflows.",
          "Developed a Python MCP client integrating AWS Bedrock LLMs with backend services using async I/O, connection pooling, request batching, and multithreaded execution.",
          "Designed a React-based chatbot interface and fully containerized the platform with Docker and Kubernetes, supporting 15,000+ concurrent users in production.",
        ],
      },
    ],
  },
  {
    company: "American Airlines",
    logo: `${import.meta.env.BASE_URL}logos/american-airlines.svg`,
    location: "Atlanta, GA",
    roles: [
      {
        title: "ML Project Intern",
        period: "Jan. 2025 – May 2025 · Jan. 2026 – May 2026",
        bullets: [
          "Built a multi-layer TensorFlow model with batch normalization and dropout to forecast baggage arrival distributions across 30 time bins using 50k+ Snowflake-extracted samples.",
          "Engineered a preprocessing pipeline using StandardScaler and OneHotEncoder across 20+ flight features, generating minutes-before-departure targets and discretizing arrivals into 15-minute intervals.",
          "Fit Weibull, Gamma, and Normal distributions to network-predicted arrival curves using SciPy optimization and R² scoring for operations planning.",
        ],
      },
    ],
  },
  {
    company: "MAIX Lab, Emory University",
    logo: `${import.meta.env.BASE_URL}logos/emory.svg`,
    location: "Atlanta, GA",
    roles: [
      {
        title: "Research Assistant",
        period: "Nov. 2025 – Present",
        bullets: [
          "Extracted and processed 12,000+ ECG waveform records from MIMIC-III across 3,400+ patient encounters.",
          "Derived 15 HRV features from ECG signals and aligned binned waveform data with clinical chart assessments to identify autonomic biomarkers for delirium and dementia.",
        ],
      },
    ],
  },
];

export const projects = [
  {
    name: "Brainwave Classifier",
    thumb: `${import.meta.env.BASE_URL}thumbs/brainwave.svg`,
    description: "Machine learning model that differentiates people based on their brain waves.",
    bullets: [
      "Collected 100 hours of EEG data from 10 human subjects and preprocessed signals via FFT binning.",
      "Trained a 2-layer neural network achieving 87% classification accuracy.",
      "Deployed with a Python script for real-time detection using a Neuromaker device.",
    ],
    link: "https://github.com/NKonganda/Neuromaker",
    tags: ["Python", "Machine Learning", "EEG", "Neural Network"],
  },
  {
    name: "FC26 Squad Optimizer",
    thumb: `${import.meta.env.BASE_URL}thumbs/fc26.svg`,
    description: "Linear programming solution for optimal fantasy football squad selection from 18,000+ players.",
    bullets: [
      "Solved constraint satisfaction problem with PuLP + CBC solver under budget, formation, and club-diversity rules.",
      "Built an interactive Streamlit dashboard with sidebar controls for budget, formation, and nationality filters.",
      "Achieved 947.7 total rating with a €1B budget; included dual variable analysis for shadow pricing.",
    ],
    link: "https://github.com/NKonganda/FC26LP",
    tags: ["Python", "PuLP", "Streamlit", "Linear Programming"],
  },
  {
    name: "Justice AI",
    thumb: `${import.meta.env.BASE_URL}thumbs/justicai.svg`,
    description: "Privacy-focused legal research desktop app with fully local LLM inference — no cloud, no data transmission.",
    bullets: [
      "Hybrid retrieval combining BM25 keyword search with semantic cosine similarity across 16 file types.",
      "Built on Tauri 2 + Rust backend with Qwen3-8B via llama.cpp; supports PDFs, Word docs, emails, and OCR images.",
      "Auto-detects hallucinations, extracts entities, and organizes documents into cases with citation-grounded answers.",
    ],
    link: "https://github.com/lastbaa/JusticeAI",
    tags: ["Rust", "React", "TypeScript", "Tauri", "LLM", "RAG"],
  },
];

export const skills = {
  Languages: ["Python", "Java", "C++", "C", "C#", "Dart", "Assembly", "SQL"],
  "Frameworks & Tools": ["React", "Docker", "Kubernetes", "MCP", "AWS", "Spring Boot", "Flask", "Pandas", "NumPy"],
  "Machine Learning": ["TensorFlow", "PyTorch", "Keras", "Matplotlib"],
};
