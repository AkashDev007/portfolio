import type { ReactNode } from "react";
import Clock from "@/components/Clock";
import CopyEmail from "@/components/CopyEmail";
import GridWorld from "@/components/GridWorld";
import ProjectFigure from "@/components/ProjectFigure";
import Reveal from "@/components/Reveal";
import { education, experience, profile, projects, stats, toolchain } from "@/lib/data";

function SectionHead({ no, title, note }: { no: string; title: string; note: ReactNode }) {
  return (
    <Reveal className="sec-head">
      <span className="sec-no">§{no}</span>
      <h2 className="sec-title">{title}</h2>
      <span className="sec-note">{note}</span>
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>

      <header className="nav">
        <a href="#top" className="nav-mark" aria-label="Akash Kumar, back to top">
          <span className="nav-mono">AK</span>
          <span className="nav-name">Akash Kumar</span>
        </a>
        <p className="nav-status">
          <i className="dot dot-live" /> {profile.status}
        </p>
        <nav aria-label="Sections" className="nav-links">
          <a href="#work">Work</a>
          <a href="#builds">Builds</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </nav>
        <Clock />
      </header>

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section id="top" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span>{profile.role}</span>
              <span>{profile.location}</span>
            </p>
            <h1 className="hero-name">
              <span className="hero-line">Akash</span>
              <span className="hero-line hero-line-2">
                Kumar<span className="hero-dot">.</span>
              </span>
            </h1>
            <p className="hero-lede">
              I build web products end to end, from database to deploy. These days I build the environments, games and
              evaluation harnesses that <em>large language models</em> train and get tested in.
            </p>
            <div className="hero-cta">
              <a href="#builds" className="btn btn-solid">
                See the builds <span aria-hidden>↓</span>
              </a>
              <a href={profile.resume} className="btn btn-line" target="_blank" rel="noopener">
                Résumé, PDF <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          <div className="hero-env">
            <GridWorld />
            <p className="fig-caption">
              <b>Fig. 1</b> My current day job, scaled down: an agent, an environment and a reward signal. It starts
              out random and works out the route in a few hundred episodes. Hit <b>Train</b> to skip ahead. Everything
              below was built for people.
            </p>
          </div>
        </section>

        <section className="stats" aria-label="At a glance">
          {stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 70}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </Reveal>
          ))}
        </section>

        {/* ── About ────────────────────────────────────────── */}
        <section className="sec readme" aria-labelledby="readme-title">
          <SectionHead no="01" title="Readme" note="The short version" />
          <div className="readme-body">
            <Reveal as="p" className="readme-lead">
              <span id="readme-title" className="sr-only">
                About
              </span>
              I like owning the whole path: the schema, the API, the server-rendered page and the deploy that ships it.
            </Reveal>
            <div className="readme-cols">
              <Reveal as="p" delay={80}>
                For two years that meant products for a university, a salon floor and an ad studio: a learning platform
                with AI proctoring at IIT Ropar, a server-rendered Next.js + FastAPI app at Centaq, and MERN services
                at CRFM.
              </Reveal>
              <Reveal as="p" delay={160}>
                Now, at Quess Corp, the users are models. I write Python games and reinforcement-learning
                environments for training and fine-tuning LLMs, and evaluation harnesses that check whether a model
                really solved a coding problem and whether the benchmark is grading it fairly.
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Experience ───────────────────────────────────── */}
        <section id="work" className="sec" aria-label="Experience">
          <SectionHead no="02" title="Trajectory" note={`${experience.length} roles · newest first`} />
          <ol className="roles">
            {experience.map((r, i) => (
              <Reveal as="li" key={r.company} className={`role${r.current ? " is-current" : ""}`}>
                <div className="role-when">
                  <span className="role-t">t = {String(experience.length - 1 - i).padStart(2, "0")}</span>
                  <span>
                    {r.start} — {r.end}
                  </span>
                  {r.current && (
                    <span className="role-live">
                      <i className="dot dot-live" /> Now
                    </span>
                  )}
                </div>
                <div className="role-main">
                  <h3 className="role-title">{r.title}</h3>
                  <p className="role-org">
                    {r.company} <span>· {r.place}</span>
                  </p>
                  <ul className="role-points">
                    {r.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <ul className="role-tags" aria-label="Focus">
                  {r.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ── Projects ─────────────────────────────────────── */}
        <section id="builds" className="sec sec-dark" aria-label="Projects">
          <div className="sec-inner">
            <SectionHead no="03" title="Builds" note="Source is private · walkthroughs on request" />
            <div className="builds">
              {projects.map((p, i) => (
                <article key={p.id} className="build" aria-labelledby={`b-${p.id}`}>
                  <Reveal className="build-figure">
                    <ProjectFigure id={p.id} />
                  </Reveal>
                  <Reveal className="build-text" delay={100}>
                    <p className="build-meta">
                      <span>B—{String(i + 1).padStart(2, "0")}</span>
                      <span>{p.context}</span>
                      <span>{p.year}</span>
                    </p>
                    <h3 id={`b-${p.id}`} className="build-name">
                      {p.name}
                    </h3>
                    <p className="build-pitch">{p.pitch}</p>
                    <ul className="build-features">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="build-stack" aria-label="Built with">
                      {p.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Skills ───────────────────────────────────────── */}
        <section id="stack" className="sec" aria-label="Skills">
          <SectionHead no="04" title="Toolchain" note={
            <>
              <i className="dot" /> Daily drivers
            </>
          } />
          <div className="tools">
            {toolchain.map((g, i) => (
              <Reveal key={g.group} className="tool-group" delay={i * 60}>
                <h3 className="tool-head">
                  <span>{String(i + 1).padStart(2, "0")}</span> {g.group}
                </h3>
                <ul className="tool-list">
                  {g.items.map((t) => (
                    <li key={t.name} className={t.core ? "is-core" : ""}>
                      {t.name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Education ────────────────────────────────────── */}
        <section className="sec sec-tight" aria-label="Education">
          <SectionHead no="05" title="Schooling" note="Where the habits started" />
          <ul className="edu">
            {education.map((e) => (
              <Reveal as="li" key={e.school} className="edu-row">
                <span className="edu-school">{e.school}</span>
                <span className="edu-detail">{e.detail}</span>
                <span className="edu-when">{e.when}</span>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* ── Contact ──────────────────────────────────────── */}
        <section id="contact" className="contact" aria-labelledby="contact-title">
          <p className="contact-kicker">§06 — Contact</p>
          <h2 id="contact-title" className="contact-title">
            Got something
            <br />
            worth building?
          </h2>
          <div className="contact-mail">
            <a href={`mailto:${profile.email}`} className="contact-email">
              {profile.email}
            </a>
            <CopyEmail email={profile.email} />
          </div>
          <ul className="contact-links">
            <li>
              <span>LinkedIn</span>
              <a href={profile.linkedin} target="_blank" rel="noopener">
                {profile.linkedinLabel} ↗
              </a>
            </li>
            <li>
              <span>GitHub</span>
              <a href={profile.github} target="_blank" rel="noopener">
                {profile.githubLabel} ↗
              </a>
            </li>
            <li>
              <span>Phone</span>
              <a href={`tel:${profile.phoneHref}`}>{profile.phone}</a>
            </li>
            <li>
              <span>Résumé</span>
              <a href={profile.resume} target="_blank" rel="noopener">
                akash-kumar-resume.pdf ↗
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="foot">
        <span>© {new Date().getFullYear()} Akash Kumar</span>
        <span>Set in Big Shoulders, Schibsted Grotesk &amp; Martian Mono</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
