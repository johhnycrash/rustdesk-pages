# rustdesk.jonathanellis.dev

Static support portal for RustDesk remote-desktop setup. Deployed to `rustdesk.jonathanellis.dev` via Coolify.

## Structure

```
rustdesk-pages/
├── index.html                ← landing page
├── install/index.html        ← per-OS install instructions
├── key/index.html            ← public key + server address (copy buttons)
├── test/index.html           ← connection troubleshooting
├── guide.js                  ← OS-detecting setup guide used by the pages
├── shared.css                ← brand style tokens, components, typography
├── public/
│   ├── logo.svg              ← J monogram, green
│   └── favicon.svg           ← favicon with charcoal circle background
└── README.md
```

## Downloads and setup

Nothing here needs updating when RustDesk releases a new version. The `rustdesk-gateway` service at `/opt/rustdesk-gateway` on the server handles these routes on this domain:

- `/download/<platform>` serves the latest verified release. Windows installers carry the server settings in their file name.
- `/setup/mac` and `/setup/linux` are the one-line installers.
- `/api/latest` reports the current version.
- `/api/heartbeat` and `/api/sysinfo` receive device check-ins for the Client devices page in HQ.

If the RustDesk public key changes (for example, after a server rebuild), update `RD_KEY` in the gateway and `SERVER.key` in `guide.js`, plus any key shown in `key/index.html`.

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
