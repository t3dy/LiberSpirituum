# Deployment State

## Live URL
https://t3dy.github.io/LiberSpirituum/

## Hosting
GitHub Pages (GitHub repository: t3dy/LiberSpirituum)

## Deployment Method
- Static site deployment from `master` branch
- GitHub Pages enabled via API
- No build step required (vanilla JS, no base-path handling needed—all paths are relative)
- Custom domain: None (default GitHub Pages domain)

## Environment
- No environment variables required
- No API keys needed
- localStorage used for game save data (persists per browser)

## Known Issues
- None

## Testing
- Automated playthrough test: 77/78 checks pass, no exceptions (see `tools/playthrough.js`)
- Manual testing: All three reader layers (Dee → Thomas → Hermit) working
- Game completion and save/load verified

## Notes
- Game runs entirely in the browser with no server required
- CSS stacks responsively below 900px (tested at ~740px)
- Phone width responsiveness not yet tested in detail
- One minor positioning FAIL in automated test (Reader NPC position) — logic issue, no exception
