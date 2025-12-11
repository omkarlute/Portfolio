"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ChevronDown, Github, Linkedin, Mail, Phone, ExternalLink,
  Code, Database, Cpu, Award, Briefcase, GraduationCap, User, FileText
} from "lucide-react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";

const R3FHero = dynamic(() => import("@/components/ui/R3FHero").then(m => m.default), { ssr: false }); // optional 3D

const GITHUB_URL = "https://github.com/omkarlute"; // ← PUT YOUR PROFILE OR REPO URL HERE

/** ---------- utils ---------- */
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const useMouseVars = () => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
};

/** ---------- HeroOrb (paste among other components near top of file) ---------- */
const HeroOrb: React.FC = () => {
  return (
    <div
      role="img"
      aria-label="Animated gradient orb"
      className="relative size-32 mx-auto rounded-full border-4 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,.25)] overflow-hidden"
    >
      {/* animated gradient base */}
      <div className="absolute inset-0 bg-gradient-orb animate-orb-pulse" />

      {/* glossy highlight */}
      <div className="absolute inset-0 pointer-events-none"
           aria-hidden
           style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25), transparent 30%)' }}
      />

      {/* subtle moving sheen overlay (SVG) */}
      <svg className="absolute inset-0 w-full h-full animate-orb-sheen" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="gOrb" x1="0" x2="1">
            <stop offset="0" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0.6" />
          </linearGradient>
          <filter id="fBlur">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <g filter="url(#fBlur)">
          <ellipse cx="100" cy="40" rx="70" ry="30" fill="url(#gOrb)" opacity="0.12" />
          <ellipse cx="60" cy="140" rx="90" ry="40" fill="url(#gOrb)" opacity="0.08" />
        </g>
      </svg>

      {/* inner micro-particles for texture */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="orb-dot" style={{ left: "12%", top: "28%", animationDelay: "0.1s" }} />
        <span className="orb-dot" style={{ left: "68%", top: "18%", animationDelay: "0.4s" }} />
        <span className="orb-dot" style={{ left: "45%", top: "62%", animationDelay: "0.8s" }} />
        <span className="orb-dot" style={{ left: "30%", top: "78%", animationDelay: "1.2s" }} />
      </div>
    </div>
  );
};

/** ---------- sections helper ---------- */
const Section: React.FC<React.PropsWithChildren<{ id: string; className?: string }>> = ({ id, className, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-100px 0px -100px 0px", once: true });
  return (
    <section id={id} className={cn("relative", className)}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        {children}
      </motion.div>
    </section>
  );
};

/** ---------- global chrome ---------- */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 24, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 h-1 origin-left z-[60] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
    />
  );
};

const Spotlight = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-0 [mask-image:radial-gradient(300px_300px_at_var(--mx)_var(--my),#000_0%,transparent_60%)]">
    <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_20%,rgba(34,211,238,.08),transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_80%,rgba(168,85,247,.10),transparent_60%)]" />
  </div>
);

const Particles = () => {
  const dots = useMemo(() => Array.from({ length: 42 }, (_, i) => i), []);
  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map((i) => (
        <span
          key={i}
          className="absolute size-1.5 rounded-full bg-cyan-400/30 animate-float"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 83) % 100}%`, animationDelay: `${(i % 7) * 0.25}s` }}
        />
      ))}
    </div>
  );
};

/** Magnetic + 3D tilt */
const Magnetic: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
    };
    const leave = () => (el.style.transform = "translate(0,0)");
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
};

const TiltCard: React.FC<React.PropsWithChildren<{ className?: string, maxTilt?: number }>> = ({ className, maxTilt = 10, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!el) return;
    const enter = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateZ(0)`;
    };
    const leave = () => (el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)");
    el.addEventListener("mousemove", enter);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", enter); el.removeEventListener("mouseleave", leave); };
  }, [maxTilt]);
  return <div ref={ref} className={className}>{children}</div>;
};

const GlowCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div
    className={cn(
      "relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur",
      "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:[background:conic-gradient(from_120deg,rgba(6,182,212,.6),rgba(168,85,247,.6),transparent_40%)] before:-z-10 before:[mask:linear-gradient(black,black)_content-box,linear-gradient(black,black)] before:[mask-composite:exclude]",
      className
    )}
  >
    {children}
  </div>
);

/** Custom cursor w/ trailing ring */
const CursorFX = () => {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef  = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });
  const pressed = useRef(false);

  useEffect(() => {
    const mm = (e: MouseEvent) => { pos.current.x = e.clientX; pos.current.y = e.clientY; };
    const down = () => { pressed.current = true; };
    const up   = () => { pressed.current = false; };
    window.addEventListener("mousemove", mm, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    let raf = 0;
    const loop = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.15;
      trail.current.y += (pos.current.y - trail.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${trail.current.x - 16}px, ${trail.current.y - 16}px) scale(${pressed.current ? 0.9 : 1})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 2}px, ${pos.current.y - 2}px)`;
        dotRef.current.style.opacity = "0.8";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", mm); window.removeEventListener("mousedown", down); window.removeEventListener("mouseup", up); };
  }, []);

  // keep native cursor; this sits on top
  return (
    <>
      <div ref={ringRef} className="fixed z-[70] pointer-events-none size-8 rounded-full border border-cyan-400 mix-blend-difference" />
      <div ref={dotRef}  className="fixed z-[71] pointer-events-none size-1.5 rounded-full bg-white mix-blend-difference" />
    </>
  );
};

export default function OmkarPortfolio() {
  useMouseVars();

  const [active, setActive] = useState("hero");
  useEffect(() => {
    const ids = ["hero", "about", "skills", "experience", "projects", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) setActive(vis.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0.2, 0.6, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const experiences = [
  {
    title: "Web3 & Telegram Mini App Developer",
    company: "Stealth-Mode Web3 Gaming Startup",
    description:
      "Architected and developed a tap-to-earn Telegram Mini App forming the core user experience of an early-stage Web3 gaming platform. Built gameplay systems, scalable backend services, and Web3-ready infrastructure designed for future on-chain expansion.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Telegram Mini Apps", "Ethers.js"],
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Web3 Developer",
    company: "Kleekai Project",
    description:
      "Developing a full-stack presale site with smart contracts, wallet flows, and responsive UI. Implemented secure presale mechanics.",
    technologies: ["Solidity", "Hardhat", "Ethers.js", "React", "Web3.js"],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Full Stack Development Intern",
    company: "Soft Corner",
    description:
      "Built real-time hand-gesture controls using Python, OpenCV, and MediaPipe to enhance accessibility and system navigation.",
    technologies: ["Python", "OpenCV", "MediaPipe", "Computer Vision"],
    color: "from-cyan-500 to-blue-500",
  },
];


  const skillCategories = [
    { title: "Programming Languages", icon: <Code size={22} className="text-cyan-400" />, skills: ["Python", "JavaScript", "Solidity", "C++", "C"], color: "from-cyan-500 to-blue-500" },
    { title: "Web3 & Blockchain", icon: <Cpu size={22} className="text-purple-400" />, skills: ["Smart Contracts", "Ethereum", "Hardhat", "MetaMask", "Ethers.js", "IPFS", "NFTs", "DeFi"], color: "from-purple-500 to-pink-500" },
    { title: "Web Tech", icon: <Database size={22} className="text-green-400" />, skills: ["Next.js", "React", "Node.js", "MongoDB", "MySQL", "HTML/CSS"], color: "from-green-500 to-teal-500" },
    { title: "AI & Data Science", icon: <Award size={22} className="text-orange-400" />, skills: ["Machine Learning", "OpenCV", "Data Viz", "Deep Learning (TensorFlow, Keras)","NLP","Data Preprocessing","Streamlit ", "Computer Vision"], color: "from-orange-500 to-red-500" },
    { title: "Game Development", icon: <Cpu size={22} className="text-yellow-400" />, skills: ["Unreal Engine", "Blueprints"], color: "from-yellow-500 to-orange-500" }

  ];

  const project = {
    title: "Enhancing Cyber Security using Random Forest",
    description: "ML system for intrusion and malware detection with real-time dashboard and model comparison.",
    technologies: ["Python", "Scikit-learn", "Streamlit", "Random Forest", "XGBoost", "Machine Learning"],
    features: [
      "Real-time intrusion detection",
      "Multiple ML model comparison",
      "High-accuracy anomaly detection",
    ],
    color: "from-cyan-500 to-purple-500",
  };

  return (
    <div className="relative min-h-screen bg-[#03060a] text-white selection:bg-cyan-500/30 selection:text-white">
      <ScrollProgress />
      <CursorFX />
      <Particles />
      <Spotlight />

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex h-16 items-center justify-between">
            <div className="font-black tracking-tight text-xl md:text-2xl text-white" style={{ textShadow: "0 0 10px rgba(34,211,238,.35), 0 0 20px rgba(168,85,247,.25)" }}>
              OMKAR.LUTE
            </div>
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: "hero", label: "Home" },
                { id: "about", label: "About" },
                { id: "skills", label: "Skills" },
                { id: "experience", label: "Experience" },
                { id: "projects", label: "Projects" },
                { id: "contact", label: "Contact" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={cn("relative px-4 py-2 text-sm rounded-lg transition", active === id ? "text-cyan-400" : "text-gray-300 hover:text-white")}
                >
                  {label}
                  <span className={cn("absolute left-2 right-2 -bottom-1 h-0.5 rounded-full transition-all",
                    active === id ? "bg-gradient-to-r from-cyan-400 to-purple-500 scale-100" : "scale-0 bg-transparent")} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <Section id="hero" className="min-h-[100svh] flex items-center justify-center relative overflow-hidden">
        {/* optional 3D hero canvas */}
        <div className="absolute inset-0 pointer-events-none">
          <R3FHero />
        </div>

        {/* parallax glow blobs */}
        <div className="absolute -top-40 right-0 size-[38rem] rounded-full blur-3xl bg-cyan-500/10" />
        
        <div className="absolute -bottom-40 left-0 size-[46rem] rounded-full blur-3xl bg-purple-500/10" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-white">
              OMKAR LUTE
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-2xl text-gray-300">
             Where Blockchain Meets AI Brilliance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Magnetic>
              <button onClick={() => scrollTo("experience")} className="group relative overflow-hidden rounded-lg px-8 py-3 font-semibold">
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 transition group-hover:opacity-90" />
                <span className="relative z-10 flex items-center gap-2">
                  <Code size={18} /> View My Work
                </span>
              </button>
            </Magnetic>
            <button onClick={() => scrollTo("contact")} className="rounded-lg px-8 py-3 font-semibold border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition">
              Let’s Connect
            </button>
              <a
  href="https://drive.google.com/file/d/1igfAuzLOFBLf35gFDwLxmO59MMonX3LD/view?usp=sharing"
  target="_blank"
  rel="noopener noreferrer"
  className="rounded-lg px-8 py-3 font-semibold border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
>
  See My Resume
</a>
          </div>
        </div>

        <button onClick={() => scrollTo("about")} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cyan-400 animate-bounce z-10" aria-label="Scroll to About">
          <ChevronDown size={32} />
        </button>
      </Section>

      {/* ABOUT */}
      <Section id="about" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">About Me</h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <TiltCard className="will-change-transform">
              <GlowCard className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <User className="text-cyan-400" />
                  <h3 className="text-2xl font-bold">Who I Am</h3>
                </div>
                <p className="text-gray-300">
                 A passionate AI & Data Science engineer specializing in Web3 technologies. Recently graduated with a B.E. in Artificial Intelligence & Data Science, bringing a strong foundation in blockchain development, smart contracts, and cutting-edge AI solutions
                </p>
              </GlowCard>
            </TiltCard>

            <TiltCard className="will-change-transform">
              <GlowCard className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="text-purple-400" />
                  <h3 className="text-2xl font-bold">Education</h3>
                </div>
                <p className="text-gray-300">
                  <span className="text-cyan-400 font-semibold">K.K. Wagh Institute of Engineering</span><br />
                  Bachelor of Engineering in AI &amp; Data Science<br />
                  CGPA: 7.86/10
                </p>
              </GlowCard>
            </TiltCard>

            <GlowCard className="p-8 md:col-span-2">
              <h3 className="text-2xl font-bold mb-6">Quick Facts</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { icon: <Mail />, label: "Email", value: "omkarlute111@gmail.com" },
                  { icon: <Phone />, label: "Phone", value: "+91 9860505287" },
                  { icon: <Briefcase />, label: "Experience", value: "Full Stack & Web3 Development" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 p-4 border border-white/10">
                    <div className="text-cyan-400">{item.icon}</div>
                    <div>
                      <div className="text-gray-400 text-sm">{item.label}</div>
                      <div className="text-white font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Technical Arsenal</h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-7">
            {skillCategories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: idx * 0.06 }}
                className="group"
              >
                <GlowCard className="p-8 hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-center gap-3 mb-6">
                    {cat.icon}
                    <h3 className="text-2xl font-bold">{cat.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {cat.skills.map((s) => (
                      <span
                        key={s}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-transform",
                          "bg-gradient-to-r hover:scale-110",
                          cat.color
                        )}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Experience</h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
          </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
                className="relative pl-16"
              >
                <div className="absolute left-6 top-4 size-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 border-4 border-black" />
                <GlowCard className="p-7">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{exp.title}</h3>
                      <p className="text-cyan-400 font-semibold">{exp.company}</p>
                    </div>
                  
                  </div>
                  <p className="text-gray-300 mb-5">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((t) => (
                      <span key={t} className={cn("px-3 py-1 text-sm rounded-lg font-medium bg-gradient-to-r", exp.color)}>
                        {t}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </Section>

      {/* PROJECTS */}
<Section id="projects" className="py-24">
  <div className="mx-auto max-w-7xl px-6">
    <div className="text-center mb-14">
      <h2 className="text-4xl md:text-6xl font-black tracking-tight">Featured Projects</h2>
      <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
    </div>

    {/* TaskBucks Project */}
    <TiltCard className="will-change-transform mb-12">
      <GlowCard className="relative p-8 md:p-12 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">TaskBucks Telegram Mini App</h3>
            <p className="text-gray-300 text-lg mb-6">
              A Telegram Mini App for task-based rewards where users complete tasks and withdraw earnings seamlessly. 
              Includes an integrated Admin Panel for task & withdrawal management.
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                <span className="text-gray-300">Built on Telegram Mini App framework</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                <span className="text-gray-300">Admin Panel for tasks & withdrawals</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                <span className="text-gray-300">Secure backend with MongoDB</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-2 mb-6">
              {["React", "Next.js", "Node.js", "MongoDB", "Telegram Bot API", "Vercel"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Magnetic>
                <a href="https://taskbucksbot.vercel.app/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold hover:opacity-90 transition">
                  🚀 Live Demo
                </a>
              </Magnetic>
              <Magnetic>
                <a href="https://github.com/omkarlute/Tele-miniapp" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 font-semibold hover:opacity-90 transition">
                  <Github size={18} /> GitHub Repo
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl blur-2xl bg-gradient-to-r from-cyan-400/20 to-purple-500/20" />
            <div className="relative rounded-2xl border border-cyan-500/30 p-8 bg-black/40">
              <div className="text-center">
                <div className="text-6xl mb-3">📱</div>
                <h4 className="text-xl font-bold mb-3">Telegram Mini App</h4>
                <p className="text-gray-400 text-sm mt-4">Task-based Rewards Platform</p>
              </div>
            </div>
          </div>
        </div>
      </GlowCard>
    </TiltCard>

    {/* Cyber Security Project (existing) */}
    <TiltCard className="will-change-transform">
      <GlowCard className="relative p-8 md:p-12 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Enhancing Cyber Security using Random Forest</h3>
            <p className="text-gray-300 text-lg mb-6">
              ML system for intrusion and malware detection with real-time dashboard and model comparison.
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                <span className="text-gray-300">Real-time intrusion detection</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                <span className="text-gray-300">Multiple ML model comparison</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-400" />
                <span className="text-gray-300">High-accuracy anomaly detection</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-2 mb-6">
              {["Python", "Scikit-learn", "Streamlit", "Random Forest", "XGBoost", "Machine Learning"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-purple-500">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Magnetic>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold hover:opacity-90 transition">
                  <Github size={18} /> View Code
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl blur-2xl bg-gradient-to-r from-cyan-400/20 to-purple-500/20" />
            <div className="relative rounded-2xl border border-cyan-500/30 p-8 bg-black/40">
              <div className="text-center">
                <div className="text-6xl mb-3">🛡️</div>
                <h4 className="text-xl font-bold mb-3">Cyber Security AI</h4>
                <p className="text-gray-400 text-sm mt-4">Real-time threat detection</p>
              </div>
            </div>
          </div>
        </div>
      </GlowCard>
    </TiltCard>

    {/* GitHub CTA */}
    <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="block mt-10">
      <GlowCard className="group p-8 md:p-12 flex items-center justify-between gap-6 hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500">
            <Github size={32} />
          </div>
          <div>
            <h4 className="text-2xl md:text-3xl font-bold">View all my projects</h4>
            <p className="text-gray-400">Explore complete code, experiments, and case studies on GitHub.</p>
          </div>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-200 group-hover:border-cyan-400">
            Open GitHub <ExternalLink size={16} />
          </span>
        </div>
      </GlowCard>
    </Link>
  </div>
</Section>

      {/* CONTACT */}
      <Section id="contact" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Let’s Build Something Amazing</h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
            <p className="mt-4 text-xl text-gray-300">Ready to bring your Web3 &amp; AI ideas to life? Let’s connect and create the future together.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Mail size={28} />, label: "Email", value: "omkarlute111@gmail.com", href: "mailto:omkarlute111@gmail.com", color: "from-cyan-500 to-blue-500" },
              { icon: <Phone size={28} />, label: "Phone", value: "+91 9860505287", href: "tel:+919860505287", color: "from-purple-500 to-pink-500" },
              { icon: <Linkedin size={28} />, label: "LinkedIn", value: "Connect with me", href: "https://www.linkedin.com/in/omkar-lute-b25ba0255", color: "from-green-500 to-teal-500" },
            ].map((c) => (
              <a key={c.label} href={c.href} className="group block">
                <GlowCard className="p-8 h-full transition-transform group-hover:-translate-y-0.5">
                  <div className={cn("inline-flex p-4 rounded-xl text-white mb-6 bg-gradient-to-r", c.color)}>{c.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{c.label}</h3>
                  <p className="text-gray-400 group-hover:text-white transition-colors">{c.value}</p>
                </GlowCard>
              </a>
            ))}
          </div>

          <div className="text-center">
            <div className="flex justify-center gap-6 mb-8">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group">
                <div className="p-4 rounded-xl border border-white/15 bg-white/5 hover:border-cyan-400 transition">
                  <Github className="text-white group-hover:text-cyan-400 transition-colors" size={28} />
                </div>
              </a>
              <a href="https://www.linkedin.com/in/omkar-lute-b25ba0255" aria-label="LinkedIn" className="group">
                <div className="p-4 rounded-xl border border-white/15 bg-white/5 hover:border-purple-400 transition">
                  <Linkedin className="text-white group-hover:text-purple-400 transition-colors" size={28} />
                </div>
              </a>
              <a href="https://drive.google.com/file/d/1igfAuzLOFBLf35gFDwLxmO59MMonX3LD/view?usp=sharing" aria-label="Resume" className="group">
                <div className="p-4 rounded-xl border border-white/15 bg-white/5 hover:border-emerald-400 transition">
                  <FileText className="text-white group-hover:text-emerald-400 transition-colors" size={28} />
                </div>
              </a>
            </div>

            <GlowCard className="mx-auto max-w-2xl p-8">
              <p className="text-gray-300 text-lg">Open to Web3 roles, AI/ML projects, and ambitious product builds. Let’s collaborate!</p>
            </GlowCard>
          </div>
        </div>
      </Section>

      {/* global keyframes + helpers */}
      <style jsx global>{`
        :root { --mx: 50vw; --my: 50vh; }
        html { scroll-behavior: smooth; }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity:.5; }
          50% { transform: translateY(-10px) translateX(6px); opacity:.9; }
          100% { transform: translateY(0) translateX(0); opacity:.5; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
