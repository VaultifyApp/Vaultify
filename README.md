# 🎵 Vaultify 🎵

**\*Vaultify** is your **effortless solution** to automatically track and preserve your **monthly music journey** -- creating personalized playlists that capture your evolving taste without the hassle.\*

**👥 Team Members:** Matthew Bui, Michael Lam, Dillon (Hongwei) Li, Michelle Li, Thomas Orifici

-   [Project Page](http://spotify.com/)
-   [Vaultify's GitHub Repository](https://github.com/Vaultify-App/Vaultify)

======================================================

## Installation

1. Clone this repository and open it in your preferred IDE (i.e. Visual Studio Code).
2. From the root folder ("Vaultify"), install all dependencies with `npm run install:all`.
3. Copy `.env.example` to `.env` in the root folder and fill in your values.
4. Run `npm run dev` to start the API (port 3001) and the Vite dev server (port 3000) together.

## Environment

All secrets live in a single `.env` at the repo root; see `.env.example` for the full list.
`REDIRECT_URI` must exactly match a redirect URI registered on your
[Spotify dashboard](https://developer.spotify.com/dashboard). The client derives its own
redirect from `window.location.origin`, so register one entry per environment you run.

## Deployment

The app deploys to Render as a **single web service**: Express serves the JSON API and also
serves the compiled React bundle from `frontend/dist`, so the client and API share one origin.

-   `npm run build` installs both workspaces, builds the client, and compiles the server.
-   `npm start` runs the compiled server, which serves both.
-   `render.yaml` declares the service; set the secret values in the Render dashboard.

The monthly playlist job runs in-process via `node-schedule` when `ENABLE_INTERNAL_CRON=true`.
On hosts that idle the process, leave it unset and have a scheduler `POST /run-monthly` with
an `Authorization: Bearer $CRON_SECRET` header instead.

======================================================

## Resources

All pull requests will be automatically linted and checked for formatting. To check your code locally, run `npm run lint` and `npm run format:check`.
To fix formatting errors, run `npm run format:fix`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
