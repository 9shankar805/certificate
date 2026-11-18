# Genesis Global School - Certificate Generator (CertifyPro)

A web-based character certificate generation application with real-time preview, customizable student details, photo/logo upload, and high-quality A4 PDF export.

## Features

- **Live Real-time Preview**: Certificate updates instantly as you edit details in the sidebar.
- **Customizable Assets**: Upload custom school logos, student photos, and certificate background templates.
- **Dual Calendar Support**: Full support for both B.S. (Bikram Sambat) and A.D. dates and passing years.
- **High-Quality Export**:
  - Export to crisp A4 portrait PDF using `html2canvas` and `jsPDF`.
  - Direct browser print styling support.
- **Responsive Interface**: Mobile tab switcher for toggling between the editor and live preview.
- **Zero Backend Dependencies**: Runs directly in any modern browser as a static web application.

## Project Structure

```text
├── assets/
│   ├── certificate_bg.png      # Default certificate background template
│   ├── html2canvas.min.js      # Canvas capture library
│   ├── html2pdf.bundle.min.js  # HTML-to-PDF bundle
│   └── jspdf.umd.min.js        # PDF generation engine
├── app.js                      # Application logic and PDF export handler
├── index.html                  # Main application markup
├── style.css                   # Responsive layout and certificate typography
├── server.js                   # Lightweight local static development server
└── package.json                # Project manifest
```

## Getting Started

### Local Development

You can run the application locally using the built-in Node.js static server or any HTTP server:

```bash
# Start with Node.js
npm start
# or
node server.js
```

Then open `http://localhost:3000` in your browser.

Alternatively, you can open `index.html` directly or serve with any static server (like `npx serve .` or VS Code Live Server).

## Deployment

The application is deployed on [Vercel](https://vercel.com) as a fast, edge-cached static website.
# certificate
