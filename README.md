# MESH/AI — Next-Gen AI Data Automation Platform

An advanced, premium SaaS landing page built for **Mesh/AI**—the AI-native data plane for real-time edge automation. This repository is structured and optimized for maximum architectural integrity, motion performance, and SEO compliance under strict latency budgets.

---

## ⚡ Key Architectural Highlights & Features

### 1. Matrix-Driven Pricing & Performance-Isolated Switcher

- **Zero-Re-Render Isolation**: Changing the regional currency (USD, EUR, INR) or billing cycle (Monthly vs. Annual) modifies target DOM text nodes **imperatively via refs**. Surrounding React elements and layout parent wrappers **never** trigger virtual DOM re-renders, preventing layout thrashing and reflow penalties.
- **Configuration Matrix**: Computations are dynamically derived from a single configuration matrix mapping base rates, regional tariff variables, and a flat `20%` annual discount factor.
- **Frictionless Transitions**: Segmented slider transitions utilize hardware-accelerated cubic-bezier curves for a premium mechanical feel.

### 2. Bento-to-Accordion Wrapper with Bidirectional Context Lock

- **Viewport Adaptability**: Core features render inside a fluid, asymmetric Bento grid on desktop and automatically refactor into a touch-friendly accordion list on mobile.
- **Context-Lock State Transfer**: If a user is hovering over or interacting with a specific grid primitive on desktop and resizes below the mobile breakpoint, the active index is dynamically synchronized, expanding the corresponding panel smoothly during the layout shift. Toggling panels on mobile updates the tracking context symmetrically.
- **Zero-Dependency Guarantee**: Written entirely in React and native CSS transitions without heavy, layout-blocking animation runtimes (e.g. Radix, Framer Motion).

### 3. Interactive 3D perspective Grid Backdrop

- **3D Mathematical Render**: An interactive, undulating wireframe backdrop (`DataPlane3D`) simulating real-time edge traffic is rendered on a HTML5 Canvas via perspective projection calculations ($FOV / Depth$).
- **Mouse Parallax**: Responsive mouse-move event handlers smoothly rotate and tilt the grid in three dimensions based on coordinates, creating deep visual depth.

### 4. SEO Hygiene & Performance Orchestration

- **Complete Metadata**: Full canonical link, Open Graph (OG) tags, software schema, and crawlable text nodes.
- **Under 450ms Entry Sequence**: All entrance animations and loading sequences settle under **450ms** (below the 500ms cap) using optimized delay intervals to keep Time to Interactive (TTI) fast.

---

## 🛠️ Technology Stack

- **Core**: React 19 (SSR / Hydration)
- **Framework**: TanStack Start (Router + Server Functions)
- **Build Engine**: Vite 8 & Nitro
- **Styling**: Tailwind CSS v4 & LightningCSS CSS Transformer

---

## 🚀 Getting Started

Ensure you have [Node.js](https://nodejs.org) (v18+) installed.

### 1. Install Dependencies

```bash
npm install
```

### 2. Spin Up Local Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

Compiles client, SSR server entry, and generates wrangler/cloudflare deployment config.

```bash
npm run build
```

### 4. Code Quality & Format Checks

Run linters and formatters to check code quality:

```bash
# Code Quality Linter
npm run lint

# Code Prettier Auto-Formatter
npm run format
```

---

## 🎨 Asset Guidelines Compliance

- **Colors**: Uses custom theme matching color palettes (Forsythia `#FFC801`, Deep Saffron `#FF9932`, Oceanic Noir `#172B36`, Nocturnal Expedition `#114C5A`, Arctic Powder `#F1F6F4`, Mystic Mint `#D9E8E2`).
- **Typography**: Clean typographic hierarchy styling combining _JetBrains Mono_ (headers/code blocks) and _Inter_ (body/navigation).
- **SVGs**: Utilizes 100% inline SVG path compliance mapped to the provided asset package.
