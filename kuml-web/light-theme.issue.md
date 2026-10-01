# Add a switchable GitHub Light/Dark theme for the Web editor

## Problem

The Web editor previously always applied CodeMirror One Dark. The existing diagram `Theme` selector controls only the generated diagram through the render API, so it cannot change editor appearance.

## Implemented solution

The Web UI now has a separate `Editor` selector. It defaults to GitHub Light and switches to GitHub Dark through a CodeMirror `Compartment`, which reconfigures the existing editor instance without recreating it. The implementation uses `@uiw/codemirror-theme-github` and its required Babel runtime helper.

The selector changes only CodeMirror. It does not change the diagram `Theme` selector or submit an additional render request.

## Verification

The Docker browser test verifies the default GitHub Light background, switching to GitHub Dark and back, preservation of entered kUML text and SVG preview, no additional render request, and no browser page error. Manual runtime testing also confirmed the selector behavior.
