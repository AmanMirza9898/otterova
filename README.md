# Otterova — Website (React)

Company website for Otterova, built with React + Vite. Light theme.

Motion: GSAP + ScrollTrigger (scroll animations), Lenis (smooth scroll), Three.js (interactive wave in the hero). Everything respects the OS "reduce motion" setting.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # preview the production build
```

## Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Page layout (section order)
├── styles.css            # All styles: tokens, sections, responsive
├── data/content.js       # All text: services, projects, process, testimonials, contact info
├── lib/motion.js         # GSAP setup, Lenis smooth scroll, scrollToTarget()
├── assets/               # Logos
└── components/
    ├── Header.jsx        # Sticky header + mobile menu
    ├── Hero.jsx          # Intro animation + Three.js wave
    ├── WaveScene.jsx     # Three.js particle water surface
    ├── Clients.jsx       # Counters + scroll-reactive marquee
    ├── SplitText.jsx     # Word-by-word heading reveal
    ├── SectionHeader.jsx
    ├── Services.jsx
    ├── Work.jsx          # Project cards (placeholder previews)
    ├── Process.jsx       # Pinned horizontal scroll (desktop)
    ├── About.jsx         # About + technology table
    ├── Testimonials.jsx
    ├── Contact.jsx       # Form with validation
    └── Footer.jsx
```

## Editing

- **Text / services / projects / contact details** → `src/data/content.js`
- **Colours and fonts** → `:root` variables at the top of `src/styles.css`
- **Project images** → in `Work.jsx`, replace `<Preview />` with an `<img>`
- **Contact form backend** → `send()` in `Contact.jsx` (Formspree, EmailJS or your API)

The previous static HTML version is kept in `legacy-static/` for reference and can be deleted.
