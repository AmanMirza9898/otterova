# Otterova — Agency Website

Premium dark-theme website for **Otterova**, a tech agency. Pure HTML/CSS/JS — no build step.

## Run
Just open `index.html` in a browser, or for best results serve it locally:

```bash
npx serve .
# or, in VS Code: right-click index.html → "Open with Live Server"
```

## Folder structure
```
Otterova/
├── index.html                 # All page sections (single-page site)
├── README.md
└── assets/
    ├── images/
    │   ├── logo-original.png      # Original logo file
    │   ├── logo-full.png          # Trimmed logo (mark + wordmark)
    │   ├── logo-mark.png          # Otter mark only (header, hero, preloader)
    │   ├── logo-mark-white.png    # White mark for coloured backgrounds
    │   ├── favicon.png
    │   └── apple-touch-icon.png
    ├── css/
    │   ├── base.css               # Design tokens (colours, fonts), reset, typography
    │   ├── components.css         # Preloader, cursor, header, buttons, cards, form
    │   ├── sections.css           # Hero, marquee, services, work, process, contact, footer
    │   └── responsive.css         # Tablet & mobile breakpoints
    └── js/
        ├── main.js                # Boots everything (Lenis smooth scroll + modules)
        └── modules/
            ├── preloader.js       # Logo + % counter intro
            ├── cursor.js          # Custom cursor with "View" state
            ├── navigation.js      # Sticky header, mobile menu, smooth anchors
            ├── animations.js      # GSAP: text reveals, counters, pinned horizontal process
            ├── interactions.js    # Magnetic buttons, 3D tilt + spotlight cards
            ├── testimonials.js    # Auto-playing slider
            └── form.js            # Contact form validation
```

## Customise
- **Brand colours / fonts** → `assets/css/base.css` (`:root` variables)
- **Text, services, projects, testimonials** → `index.html`
- **Email / phone / socials** → contact section & footer in `index.html`
- **Contact form backend** → `send()` in `assets/js/modules/form.js` (e.g. Formspree, EmailJS or your own API)
- **Project images** → replace the `.mock` placeholders inside `.work-item__media` with `<img>` tags

## Libraries (CDN)
- [GSAP 3.12.5](https://gsap.com/) + ScrollTrigger: animations
- [Lenis 1.1.13](https://github.com/darkroomengineering/lenis): smooth scrolling

If the CDN fails to load, the site still works and all content stays visible, just without the animations.
Users with "reduce motion" turned on in their OS settings get a calm, static version.
