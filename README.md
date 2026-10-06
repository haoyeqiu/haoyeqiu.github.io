# Haoye Qiu (裘昊晔)

Academic homepage: https://haoyeqiu.github.io/

## Update the homepage

Edit `content.json` for personal information and publication entries, `render.mjs` for page structure, and `style.css` for styling.

Run `node render.mjs` to regenerate `index.html`, then commit and push the changes to `main`. GitHub Pages publishes the root folder of this branch.

Images are stored in `images/`. The site uses plain HTML and CSS and has no third-party runtime dependencies. `.nojekyll` enables direct static-file publishing.

## Scholar metrics and CV

`scholar-metrics.json` holds the last verified all-time citation count and h-index. The GitHub Actions workflow runs hourly (at minute 23), on pushes and on manual dispatch. Scholar access failures retain the previous snapshot and emit a workflow warning. Scheduling can be delayed by GitHub and Scholar does not provide instant push updates. The browser checks the published snapshot every five minutes.

The public CV is `assets/files/Haoye_Qiu_CV.pdf`; replace it with a newer PDF and push to update both CV links.
