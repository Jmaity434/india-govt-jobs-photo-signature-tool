# Indian Government Exam Photo & Signature Resizer

**Free, private, client-side image cropper and resizer** for every major Central and State Government recruitment exam in India.

Covers **SSC, RRB, UPSC, IBPS, NTA** plus **all 28 States and 8 Union Territories**.

**Live demo:** [https://jmaity434.github.io/india-govt-jobs-photo-signature-tool/](https://jmaity434.github.io/india-govt-jobs-photo-signature-tool/)

---

## Why this tool exists

Millions of candidates face form rejection every year because of incorrect photo or signature dimensions and file sizes. This open-source tool gives cyber cafes and aspirants a single, reliable place to prepare compliant images offline and privately.

## Features

- **100% client-side** – HTML5 Canvas + Blob API. Zero server uploads.
- **Complete coverage** – Central boards + 28 States + 8 UTs.
- **Dynamic capital backdrop** – Ambient cityscape of the selected state capital.
- **Zoom & pan cropper** – Precise alignment with mouse, touch and wheel.
- **Binary quality loop** – Automatically finds the highest quality JPEG that still fits the exact Min–Max KB range.
- **Name & Date stamp** – Optional bottom banner for UPSC, Kerala PSC, MPPSC, TNPSC etc.
- **Mobile-friendly** – Long-press preview to save when download is blocked.
- **SEO / AEO / GEO ready** – Schema.org JSON-LD, answer-first FAQ, rich meta tags.
- **No emojis** – Clean SVG icons only.

## Architecture

| File | Role |
|------|------|
| `index.html` | Semantic structure, Tailwind, Schema.org, UI |
| `registry.js` | Master specification database (Central + States + UTs) |
| `app.js` | Crop engine, transform (rAF), binary compression, export |

### Canvas performance notes

- `requestAnimationFrame` throttles pan/zoom updates.
- Opaque 2D context (`alpha: false`) for faster compositing.
- `imageSmoothingQuality = 'high'` only at final render.
- Binary search over quality (instead of linear steps) reduces `toBlob` calls.

## Supported boards (summary)

**Central:** SSC, RRB, UPSC, IBPS/SBI, NTA (NEET/JEE/CUET)

**States:** Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal

**Union Territories:** Delhi (DSSSB), Jammu & Kashmir, Ladakh, Chandigarh, Puducherry, Andaman & Nicobar, Dadra & Nagar Haveli and Daman & Diu, Lakshadweep

## Local development

```bash
git clone https://github.com/Jmaity434/india-govt-jobs-photo-signature-tool.git
cd india-govt-jobs-photo-signature-tool
# Open index.html in any modern browser (or use a simple static server)
npx serve .
```

## GitHub Pages

Settings → Pages → Source: Deploy from branch → `main` → `/ (root)`

## License

MIT – free for personal and commercial use (including cyber cafes).

---

Maintained by [Joy Maity](https://github.com/Jmaity434)
