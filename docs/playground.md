# Code Playground

Fable's docs are wired to the **Fable Playground** - a live editor + sandbox
that lives in a sliding drawer at the bottom of the viewport. Every
JavaScript example in these docs has a small play button next to its
Copy and Fullscreen actions; clicking it loads the snippet into the
playground, where you can edit it and press **Run** to see the output
captured in the panel beside the editor.

For the full reference on what the playground does, how the `require`
shim works, and the caveats around module sandboxing, see the
[Fable Playground reference page](/#/playground/fable).

## Try it

The example below is wired to the playground - click the play button on
its action strip to load it into the editor, then press **Run**.

```javascript
const Fable = require('fable');

const app = new Fable({ Product: 'PlaygroundDemo' });
app.log.info('Fable instance created', {
    Product: app.settingsManager.settings.Product,
    UUID:    app.getUUID()
});

// Read a setting that wasn't configured - Settings-Manager returns
// undefined rather than throwing.
let tmpMissing = app.settingsManager.settings.NotConfigured;
app.log.warn('NotConfigured =', { Value: tmpMissing });

// Increment a tracked metric and report it.
app.log.info('app boot complete');
```

The Run button creates a fresh Fable instance under the hood and pipes
every `app.log.*` call into the output panel alongside the editor.
