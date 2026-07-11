# Showcase Section — Photo/Text Split Layout Spec

Reference: Apple-style product showcase (headphones ad — "Sounds like an epiphany").
Use this as the pattern for a showcase section on the site, adapted to CWORKS content.

## Overall Structure

Two-column split inside a single full-width section, on a soft off-white/light-gray
background (not pure white — something like `#eeeeee` to `#f2f2f2`, subtle gradient
allowed).

```
<section class="showcase">
  <div class="showcase__image">
    <img src="..." alt="...">
  </div>
  <div class="showcase__content">
    <h2>Heading Line One<br>Line Two</h2>
    <p>Supporting paragraph text.</p>
    <p>Second supporting paragraph (optional, secondary detail).</p>
    <button class="showcase__arrow" aria-label="Next">→</button>
  </div>
</section>
```

## Column Split

- Container: `display: flex` (or CSS Grid `grid-template-columns: 1fr 1fr`), no gap
  collapsing — image and text should feel like two honest halves, roughly 45/55 or
  50/50 width.
- Image column sits on the **left**, text column on the **right**. Vertically centered
  against each other.
- Section has generous vertical padding (~80–120px top/bottom) so it reads as its own
  "slide," not a cramped block.

## Image Panel

- Portrait-oriented photo, contained in its own rounded card:
  - `border-radius: 16–24px`
  - `overflow: hidden`
  - subtle drop shadow optional, but mostly relies on the rounded corner + background
    contrast to feel like a card floating on the page background.
- `object-fit: cover` so the image fills the card without distortion.
- Image should NOT bleed into the text column — it's a self-contained tile with clear
  breathing room (margin) around it relative to the section edges and the text column.

## Text Panel

- Large, bold, tight-leading headline (2 lines max), sentence case, dark charcoal
  (not pure black — `#1a1a1a`-ish), big enough to feel like a hero statement
  (~40–56px depending on breakpoint).
- Below the headline: 1–2 short paragraphs in a muted gray (`#6b6b6b` / `#777`),
  smaller size (~14–15px), relaxed line-height (~1.6), max-width constrained
  (~380–420px) so lines don't stretch full column width.
- Leave a clear vertical gap between headline and paragraph, and between paragraphs.
- Below the text: a small circular "next/scroll" button (arrow icon), light gray fill,
  darker gray arrow, subtle shadow — acts as a visual anchor/CTA to continue scrolling
  or advance to the next showcase item.

## Typography

- Headline: bold display weight, tight letter-spacing, dark neutral color.
- Body: regular weight, muted gray, smaller size, clearly secondary to the headline.
- Keep both left-aligned within their column (no centered text).

## Responsive Behavior

- Below tablet breakpoint (~768px): stack vertically — image on top (full width,
  rounded card), text panel below, headline size scales down (~28–32px), same
  left-aligned rhythm.
- Arrow button remains visible in stacked layout, placed under the paragraph text.

## Notes for Multiple Showcase Items

- If CWORKS uses this pattern for more than one feature/service, alternate the split
  direction (image left/text right, then image right/text left) on successive
  sections to keep visual rhythm varied down the page.
- Keep consistent card corner-radius, padding, and typography scale across all
  instances so it reads as one system, not one-off sections.
