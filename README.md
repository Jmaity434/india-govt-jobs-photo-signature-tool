# India Government Jobs Photo & Signature Size Tool

**Free online tool + complete official database** of photo and signature requirements for major Indian government job exams.

Perfect for **cyber cafes**, **job aspirants**, and **exam form fillers**.

## Live Tool

**[Open the Converter & Specs →](https://jmaity434.github.io/india-govt-jobs-photo-signature-tool/)**

## Supported Exam Boards

| Board | Full Name |
|-------|-----------|
| **SSC** | Staff Selection Commission |
| **RRB** | Railway Recruitment Board |
| **UPSC** | Union Public Service Commission |
| **IBPS** | Institute of Banking Personnel Selection (All Bank Exams) |
| **WBPSC / WBP / KP** | West Bengal Public Service Commission |
| **NTA** | National Testing Agency (NEET, JEE, CUET) |

## Features

- Exact official size, format, file size (KB) and DPI requirements
- Pixel equivalents calculated at 200 DPI & 300 DPI
- Free **client-side** photo & signature resizer (no upload to any server)
- Automatic quality adjustment loop to meet exact KB limits
- Works 100% offline after first load
- Mobile-friendly
- Structured data for Google, AI search engines (ChatGPT, Perplexity, Gemini, Claude, Grok etc.)

## Why this tool?

Every year millions of candidates face rejection because of wrong photo/signature size. This repository maintains the **most accurate, up-to-date** specifications collected from official notifications and provides a free browser-based converter so anyone can prepare perfect images in seconds.

## SEO & AI Friendly Keywords

`SSC photo size`, `RRB signature size`, `UPSC photo requirements`, `IBPS photo signature size`, `NTA passport photo size`, `government job photo size India`, `cyber cafe photo signature tool`, `SSC CHSL photo size`, `RRB NTPC signature`, `bank exam photo size`, `photo signature converter for government jobs`

## Data Structure

All specifications are available in machine-readable JSON:

```
data/specs.json
```

Example:

```json
{
  "exam_board": "SSC",
  "documents": {
    "photo": {
      "format": ["jpg", "jpeg"],
      "min_size_kb": 20,
      "max_size_kb": 50,
      "target_width_px": 413,
      "target_height_px": 531,
      "dpi": 300
    }
  }
}
```

## How the Converter Works

1. Uses pure **HTML5 Canvas API** (no server, no data leaves your browser)
2. Resizes to exact pixel dimensions
3. Iteratively adjusts JPEG quality until file size falls inside the required KB range
4. Instant download of ready-to-upload image

## License

MIT – free for personal and commercial use (including cyber cafes).

---

Made with ❤️ for Indian job aspirants | Maintained by [Joy Maity](https://github.com/Jmaity434)
