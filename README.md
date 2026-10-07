# Yugrow landing page

The Yugrow landing page lives in this project and runs as a Vite + React application. It presents one connected growth practice for D2C brands and creators, without founder profiles, invented results, testimonials, or client claims.

## Run it

From this folder:

```sh
npm install
npm run dev
```

Vite serves the preview at `http://127.0.0.1:8765/`. For a production bundle, run `npm run build` and serve the generated `dist/` folder.

## GitHub Pages

The `main` branch deploys automatically through GitHub Actions. The published site is available at `https://dev-sudeep018.github.io/yugrow-test/`. The Pages build uses the repository subpath and copies the locally referenced visual assets into `dist/assets/`.

## Experience and assets

- The hero combines the provided liquid-chrome portrait with a responsive Three.js displacement scene, pointer response, and moving route paths for attention, trust, and return.
- A separate WebGL liquid-metal shader, adapted from the supplied Originkit component, creates a shifting color field in the hero and closing section. The palette is specific to Yugrow: citron, coral, aqua, and warm metal.
- The page moves through the customer loop, an interactive brand/creator route switch, a locally composed growth-loop illustration, three capability cards, a four-stage feedback instrument, and a final invitation.
- Skiper40's six animated links are adapted for regular anchors and used throughout navigation, cards, and calls to action. Skiper UI attribution is included in the footer.
- Space Grotesk is installed locally so the typography does not depend on a remote font service. Flow Lines, Node Garden, the liquid-chrome portrait, and the generated route/texture SVGs are local assets.
- Motion respects the browser's reduced-motion preference; the portrait pauses when it leaves view or the tab is hidden. Mobile navigation and the route/feedback controls are interactive.

The contact links currently use `hello@yugrow.com` as an address placeholder and should be changed if Yugrow has a different inbox. The page does not send or store visitor data.
