# Fidhul Krishna — Master Project Guide & Documentation

This document is the definitive technical and design authority for the **Fidhul Krishna Portfolio**. It details the architecture, design philosophy, and implementation specifics required to understand, maintain, and evolve this high-end web experience.

---

## 💎 1. Design Philosophy: "Nixie-Glass Cyberpunk"

The site follows a **"Vibe Coding"** philosophy — where technical precision meets high-end aesthetics. It uses a bespoke design system that blends the warmth of vintage electronics with the sleekness of modern software.

### 🌓 1.1 The Cinematic Nixie Palette
Unlike standard cyberpunk themes that use harsh cold blues, this project uses **warm, cinematic amber and teal tones** inspired by Nixie tubes and high-end film grades.

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--bg-primary` | `#030201` | The "Infinite Black" background base. |
| `--neon-cyan` | `#e8912c` | Primary glow color (Principal Amber). |
| `--neon-magenta`| `#c44b2f` | Secondary warmth (Crimson Rust). |
| `--neon-orange` | `#ff6a00` | High-intensity glow for critical UI. |
| `--neon-teal` | `#2a5a5a` | Cinematic shadow depth for overlays. |
| `--glass-bg` | `rgba(255, 240, 220, 0.04)` | Ultra-translucent frosting. |

### � 1.2 Effects & Textures
- **Frosted Glass**: Implemented via `backdrop-filter: blur(40px)`. This creates an OS-level depth feel.
- **Noise Overlay**: A persistent `0.03` opacity SVG noise filter (`.noise-overlay`) adds a subtle "analog" texture, preventing flat digital bands.
- **Neon Glows**: Achieved through `drop-shadow()` filters and `rgba()` gradients rather than just `text-shadow` for softer, more realistic light dispersion.

---

## �️ 2. Technical Architecture

### 📂 2.1 File Structure
```text
/
├── assets/             # Project media, certificates (e.g., hero-bg.png, sparkathon-cert.png)
├── index.html          # Core structure, SEO metadata, and component assembly
├── style.css           # 1600+ lines of modular CSS (Variables, Base, Components, Responsive)
├── script.js           # Interactive engine (Particles, Chatbot, Scroll, Parallax)
└── PROJECT_GUIDE.md    # This technical authority file
```

### 🧱 2.2 Semantic HTML Structure
The page is organized into a single-page scrolling architecture:
1.  **Navbar**: Sticky glass navigation with mobile drawer logic.
2.  **Hero**: Multi-layered parallax background with a typewriter greeting.
3.  **Sections**: Modular blocks (`#about`, `#skills`, `#projects`, etc.) wrapped in `.container`.
4.  **Floating Widgets**: The `chatbot-widget` and `particleCanvas` are positioned globally outside the main flow.

---

## ⚡ 3. Feature Deep-Dive

### 🟢 3.1 The Particle Physics Engine (`script.js`)
The background isn't a static image; it's a dynamic, reactive physics simulation.
- **Math**: Uses Euclidean distance calculations to draw connection lines between particles that are within `120px` of each other.
- **Interaction**: Particles are "pushed" by the mouse cursor using a simple force calculation: `const force = (150 - dist) / 150;`.
- **Optimization**: The particle count is dynamically scaled based on window width (`Math.min(80, window.innerWidth / 15)`) to ensure performance on lower-end devices.

### 🤖 3.2 FK Assistant (Chatbot API)
The chatbot is a custom-coded keyword-matching engine. It avoids heavy NLP libraries for instant response times.
- **State Management**: Uses the `.open` class on the widget to toggle the panel.
- **Typing Simulation**: A `setTimeout` based delay combined with a `showTyping()` function creates a human-like interaction feel.
- **Keyword Mapping**: Highly extensible `getBotResponse(msg)` function allows for rapid addition of new "knowledge areas".

### 📊 3.3 Intersection Orchestration
Scroll animations are handled by **Intersection Observers** rather than `onscroll` listeners to maintain 60fps.
- **Reveal Logic**: When an element with `.reveal` enters the viewport, it receives the `.visible` class, triggering a `cubic-bezier` transform transition.
- **Staggered Delays**: Utility classes like `.reveal-delay-1` through `.reveal-delay-4` create a rhythmic masonry entry effect.

---

## 📐 4. Component Library

### 🗃️ 4.1 Glass Cards (`.glass-card`)
The fundamental UI building block.
- **Structure**: Uses a `1px` translucent border (`var(--glass-border)`) and a subtle `inset` box-shadow to simulate thickness.
- **Hover**: Transforms (`translateY(-4px)`) and increases `border-color` opacity for a "lifting" effect.

### 🖱️ 4.2 Interactive Micro-animations
- **Magnetic Buttons**: Uses the `Magnetic Button` pattern where the button follows the cursor within its bounding rect.
- **Tilt Effect**: Applied to skill cards using `rotateX` and `rotateY` proportional to the cursor's distance from the card center.
- **Parallax Layers**: The hero background and overlay move at different speeds (`x * 1.05` vs `x * 0.5`) to simulate deep physical space.

---

## � 5. Maintenance & Expansion Guide

### ➕ Adding a New Project
To add a project, locate `<div class="projects-grid">` in `index.html` and use this template:
```html
<div class="project-card glass-card" data-category="completed">
    <div class="project-status status-completed">Completed</div>
    <div class="project-icon"><i class="fas fa-code"></i></div>
    <h3>New Project Name</h3>
    <p>Detailed description goes here...</p>
    <div class="project-tags">
        <span>Tech 1</span><span>Tech 2</span>
    </div>
</div>
```

### 🎨 Customizing the Glow
If you want to change the primary brand color, adjust these three variables in `style.css`:
1.  `--neon-cyan`: The core amber glow.
2.  `--gradient-primary`: The primary button/accent gradient.
3.  `--neon-cyan` in the particle system `init`.

---

## 🔍 6. Performance & SEO

### 🚀 6.1 Performance
- **Font Preconnect**: Google fonts are preconnected for faster loading.
- **Lazy Loading**: Non-critical images use `loading="lazy"`.
- **Critical Path**: Core CSS is loaded early, while the particle engine waits for `DOMContentLoaded`.

### �️ 6.2 SEO Strategy
- **Semantic Tags**: Heavy use of `<strong>` and descriptive `aria-labels` for screen readers.
- **Metadata**: Comprehensive OpenGraph-ready meta tags in the `<head>`.
- **Heading Hierarchy**: Strictly follows `H1` (Hero) -> `H2` (Section Titles) -> `H3` (Component Titles) for crawler clarity.

---

> [!IMPORTANT]
> **Performance Note**: The particle canvas performs best on Chrome/Edge. In Firefox, ensure hardware acceleration is enabled for the smoothest 60fps experience.

> [!TIP]
> **Vibe Coding Tip**: When adding new sections, always keep the spacing consistent using the `--section-padding` variable (`120px` vertical). Consistency is the key to a premium "Apple-like" feel.
