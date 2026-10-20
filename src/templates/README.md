# Shared website blocks

Approved references:
- Project cards: `uslugi-projekty-i-adaptacje.html` — image, title, Material Sharp north_east at right. No category line; no “Zobacz wszystkie projekty” link.
- FAQ: homepage — bordered pale cards, centered heading, Material Sharp keyboard_arrow_down. One open answer per section. Native buttons expose aria-expanded and aria-controls.
- Service options: existing projects page — circular 01–04 counter, title, description.
- Stages: common 01–04 number, title, description; no extra category line.
- Hero/closing CTA: existing shared service-hero.css and service-cta.css.

Edit content in `src/data/shared-faq.json`, `project-cards.json`, `service-content.json`. Edit layout in these templates and shared CSS. Render all consumers with:

```sh
python3 scripts/render-shared-blocks.py
```

Do not hand-edit generated blocks between start/end comments. Static HTML keeps text readable and indexable without JavaScript. FAQ and project cards have one template each. Use only Google Material Symbols Sharp icons. Publishing requires user authorization for the reviewed release.
