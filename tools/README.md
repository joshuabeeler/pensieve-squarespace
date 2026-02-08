# pensieve-tools

This folder contains a minimal Node.js + TypeScript workspace used for developer tools.

Quick start:

```bash
cd tools
npm install
npm run build
npm start
```

For development with automatic reload:

```bash
npm run dev
```

Publish files listed in `publish.yaml` to FTP:

1. Create a `.env` in `tools/` with `FTP_HOST`, `FTP_USER`, `FTP_PASS`, and optional `FTP_BASE`.
2. Create `publish.yaml` listing files to upload, e.g.:

```yaml
files:
	- ../index.html
	- ../styles.css
```

Run:

```bash
npm run publish
```
