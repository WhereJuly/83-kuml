## Summary

Implements #<issue-number>.

- Add an editor-only light/dark selector.
- Replace One Dark with the GitHub Light/Dark CodeMirror themes.
- Add the Babel runtime required by the published UIW theme module.
- Reconfigure the existing editor through a CodeMirror `Compartment`.
- Add browser regression coverage for both theme states and state preservation.

The diagram `Theme` selector and render requests remain unchanged.

## Verification

Ran the Dockerized browser-test workflow successfully:

```bash
docker compose -f kuml-web/.delivery/development/compose.yml run --rm --build browser-test
```

It verifies the default GitHub Light background, switching to GitHub Dark and back, preserved editor text and SVG preview, no additional `/api/render` request, and no browser page errors.

Manual runtime testing also confirmed the selector behavior.
