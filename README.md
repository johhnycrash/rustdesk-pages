# rustdesk.jonathanellis.dev

Static support portal for RustDesk remote-desktop setup. Deployed to `rustdesk.jonathanellis.dev` via Coolify.

## Structure

```
rustdesk-pages/
├── index.html                ← landing page
├── install/index.html        ← per-OS install instructions
├── key/index.html            ← public key + server address (copy buttons)
├── test/index.html           ← browser-based connection test
├── shared.css                ← brand style tokens, components, typography
├── public/
│   ├── logo.svg              ← J monogram, green
│   └── favicon.svg           ← favicon with charcoal circle background
├── downloads/                ← put pre-configured Windows installer here
│   └── rustdesk-host=rustdesk.jonathanellis.dev,key=JJ84...Pk=.exe
└── README.md
```

## Pre-configured Windows installer

The Windows download works by encoding server settings into the FILENAME. To create it:

1. Download the standard latest Windows installer from https://github.com/rustdesk/rustdesk/releases/latest (file name like `rustdesk-1.x.x-x86_64.exe`).
2. Rename it exactly to:

   ```
   rustdesk-host=rustdesk.jonathanellis.dev,key=JJ84OHiivky8RCgfbA9JUa801qBTpRIgDARzrFYEIPk=.exe
   ```

3. Drop it into `downloads/` in this repo. Commit. Push.
4. The download link on `/install/` already points to that exact filename.

If the RustDesk public key changes in the future (e.g. server rebuild), update the `key=` section in that filename AND in `key/index.html` + `install/index.html` + `test/index.html`.

## Local dev

```bash
cd rustdesk-pages
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy via Coolify

1. Push repo to GitHub (see main workspace README for `gh repo create` commands).
2. In Coolify: New Resource → Public Git Repository → paste GitHub URL.
3. Set domain to `rustdesk.jonathanellis.dev`.
4. Build type: static (no build command needed; it's plain HTML).
5. Save + deploy.

Coolify auto-watches `main` — push to update.

## Brand tokens (see `shared.css`)

- `--green: #00ff40`
- `--charcoal: #25272b`
- `--ink: #0c0d0f`
- `--bone: #efefef`
- Fonts: Cormorant (headings), Inter (body)
