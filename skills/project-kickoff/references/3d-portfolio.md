# 3D / WebGL portfolio

*Kinetic-typographic heroes, interactive 3D moments. The category with the
highest ceiling and the most ways to ship something that looks incredible on
a desktop dev machine and is unusable on a phone.*

## Stack

Next.js 15 + Vercel with React Three Fiber (plus `@react-three/drei`) is the
default.

**Legitimate lighter alternative:** if the whole site is one scene-driven page
with no backend, a single self-contained `index.html` with raw Three.js and no
build step is a real option — fewer moving parts, trivially hostable, and
nothing about R3F is load-bearing for one scene. Choose deliberately and record
which in DESIGN.md.

Skip Supabase and Drizzle entirely unless there is a CMS-backed blog or a
contact-form backend.

## Skills

- `webgpu-threejs-tsl` — **not currently installed.** Needed for shader, GPU
  particle, or post-processing work. Ask before installing:
  ```bash
  npx -y skills add dgreenheck/webgpu-claude-skill --skill webgpu-threejs-tsl --agent claude-code
  ```
  Without it, stay on standard materials and drei helpers rather than
  hand-writing GLSL blind.
- `ui-ux-pro-max` — the surrounding chrome: nav, typography bands, project
  cards. The 3D moment should not be carrying the entire page.
- `image-to-code` — greenfield escape hatch. If the direction will not resolve
  in words, generate reference frames first, then build to them.
- `impeccable` — polish pass for everything that is not the canvas.

## DESIGN.md additions

Lane candidates: kinetic-typographic (giant wordmark with a 3D object flying
through it, casting a real shadow) · orbital / interface-chrome · atelier-quiet
with one hero object.

Also required for this category:

- **The signature object, named.** It must be earned by the subject's actual
  work or identity — a research artifact, a tool of their discipline, a
  material they work in. A decorative torus knot bolted onto a generic hero is
  the 3D equivalent of a stock photo.
- **The no-WebGL and reduced-motion fallback**, described as a design, not as a
  degradation. Some visitors will only ever see this.
- **Performance target**, chosen up front: 60fps desktop, 30fps floor on a
  mid-range phone, and the total asset budget in MB.

## Technical guardrails

These are real failures, not hypotheticals.

- **Clock ordering.** Call `getDelta()` **before** `getElapsedTime()` each
  frame. `getElapsedTime()` internally calls `getDelta()` and advances
  `oldTime`, so a `getDelta()` afterward returns ~0 and every delta-driven
  animation silently freezes while the scene still renders. Safer still: take
  delta once per frame and derive elapsed by accumulating it.
- **WebGL context budget.** Browsers cap simultaneous contexts — roughly 16 on
  desktop Chrome, fewer on mobile Safari — and silently kill the oldest when
  exceeded. A grid of nine canvases is near the practical ceiling. The real fix
  is **one canvas** with drei's `<View>` or manual scissor rendering, not a
  canvas per card.
- **Handle context loss.** Listen for `webglcontextlost`, `preventDefault()`,
  and restore on `webglcontextrestored`. Without it, a backgrounded tab returns
  to a permanently black canvas.
- **Clamp device pixel ratio** to 2 (`Math.min(devicePixelRatio, 2)`). A 3x
  phone display renders 9x the pixels for no visible gain and thermally
  throttles within a minute.
- **Color management.** On modern Three, set `outputColorSpace` to sRGB, load
  color textures as sRGB and data textures as linear, and pick a tone mapping
  (ACES Filmic is a safe default). Washed-out or blown-out renders are almost
  always this, not lighting.
- **Contact shadows under every object**, so it reads as sitting on a surface
  rather than floating. A baked or contact shadow beats a realtime shadow map
  at a fraction of the cost.
- **Asset pipeline.** Draco or Meshopt compression on geometry, KTX2/Basis on
  textures, and a hard budget. A 40MB GLB is not a portfolio, it is a download.
- **`frameloop="demand"`** when the scene is static between interactions —
  it stops burning battery on an idle tab.
- **Dispose on unmount** — geometries, materials, textures, render targets.
  R3F cleans up what it created; anything constructed by hand leaks.
- **Reduced motion means a composed static frame**, not a blank canvas: render
  one frame, then stop.
- **Accessibility.** Content that exists only inside the canvas does not exist
  for a screen reader or a search crawler. Every fact the 3D scene communicates
  must also live in real DOM.

## Workflow overrides

1. Brief: who this is for, their actual domain, and the one object or metaphor
   that represents it. Direction proposal, sign-off, DESIGN.md.
2. **Prototype the signature 3D moment first, in isolation**, before any page
   chrome exists. It is the riskiest part and the entire reason for the
   direction — if it does not land, the direction changes, and everything built
   around it would have been wasted.
3. Test that prototype on a real mid-range phone before proceeding. Not
   DevTools throttling — an actual device.
4. Then build the chrome around it: structure → polish → screenshots.
5. Verify all three fallbacks: reduced-motion, no-WebGL, and slow-network
   (does the page do anything sensible while a 12MB model loads?).

## Done

Base criteria, plus: 60fps desktop and at least 30fps on a real mid-range
phone · one canvas, or a counted and justified number under the cap · context
loss recovers · reduced-motion and no-WebGL fallbacks both composed and checked
· all scene content also present in the DOM · total assets within the stated
budget.

---
**This project:** [who it's for, their actual work/domain, the signature object]
