# MetaTemplate Service

The MetaTemplate service is a **low-level pattern-replacement primitive**.
You register one or more `(start, end, parserFn)` patterns; `parseString()`
then walks the template string character by character, hands each
between-tag region to the matching parser function, and emits the
function's return value into the output.

It is intentionally minimal: there are no built-in tags. The `{~Name~}` /
`{~Begin:Each:Items~}` syntax shown below is just convention — every
pattern is something you wire up yourself with `addPattern()`.

> **Pattern engine limitation.** End strings of three or more characters
> (e.g. `{~/If~}`, `~End:Each:Items~}`) currently fail with an internal
> "Cannot read properties of undefined" inside the WordTree end-leaf
> traversal. The examples below stick to 1- and 2-character end strings
> (`~}`, `>>`, etc.) — that's the entire supported design space until
> the engine is enhanced.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');
console.log('parseString:', typeof metaTemplate.parseString);
console.log('addPattern:',  typeof metaTemplate.addPattern);
```

## Basic Usage

### Register a Substitution Pattern

The minimum useful setup: one `{~name~}` pattern whose parser function
resolves `name` against the data object using dot/bracket notation.

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

metaTemplate.addPattern('{~', '~}', (pInner, pData) => {
    const value = fable.Utility.getValueByHash(pData, pInner.trim());
    return value == null ? '' : String(value);
});

const result = metaTemplate.parseString('Hello, {~Name~}!', { Name: 'World' });
console.log(result);  // 'Hello, World!'
```

### Template Syntax (this convention)

With the `{~ ~}` pattern registered above, these all work because
`fable.Utility.getValueByHash` understands dot/bracket paths:

| Pattern | Description | Example |
|---------|-------------|---------|
| `{~Property~}` | Simple substitution | `{~Name~}` |
| `{~Object.Property~}` | Nested property | `{~User.Name~}` |
| `{~Array[0]~}` | Array access | `{~Items[0]~}` |

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

metaTemplate.addPattern('{~', '~}', (pInner, pData) => {
    const value = fable.Utility.getValueByHash(pData, pInner.trim());
    return value == null ? '' : String(value);
});

const data = {
    User:  { Name: 'Alice' },
    Items: ['first', 'second', 'third']
};

console.log(metaTemplate.parseString('Name: {~User.Name~}, Item 1: {~Items[0]~}, Item 3: {~Items[2]~}', data));
```

## Conditional Rendering (via parser-function logic)

Because end tokens must stay at 1–2 characters, you can't express a
`{~Begin:If~}…{~End:If~}` block natively. The idiomatic alternative is
to put the conditional inside the parser function, with the body delimited
inside the inner content:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

// {~if Cond|yes-body|no-body~} — vertical bar separates the three parts.
metaTemplate.addPattern('{~if ', '~}', (pInner, pData) => {
    const parts = pInner.split('|');
    const cond  = fable.Utility.getValueByHash(pData, parts[0].trim());
    return cond ? (parts[1] || '') : (parts[2] || '');
});

const tmpl = '{~if ShowGreeting|Hello, World!|~}';
console.log('with show=true:',  metaTemplate.parseString(tmpl, { ShowGreeting: true }));
console.log('with show=false:', metaTemplate.parseString(tmpl, { ShowGreeting: false }));
```

For multi-line bodies, embed `\n` in the inner content or build the
template with concatenation in JS first.

## Iteration (via parser-function logic)

Same approach as conditionals — the parser function receives the
iterator name and inline body separated by `|`, looks up the array, and
joins the rendered bodies:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

// {~each ItemsAddress|template-using-{{Record.Field}}~}
// Use {{ }} inside the body to reference per-row fields; the parser
// substitutes them per iteration.
metaTemplate.addPattern('{~each ', '~}', (pInner, pData) => {
    const sepIndex = pInner.indexOf('|');
    const address  = pInner.slice(0, sepIndex).trim();
    const body     = pInner.slice(sepIndex + 1);
    const list     = fable.Utility.getValueByHash(pData, address) || [];

    return list.map((Record) =>
        body.replace(/\{\{([^}]+)\}\}/g, (_, hash) => {
            const v = fable.Utility.getValueByHash({ Record }, hash.trim());
            return v == null ? '' : String(v);
        })
    ).join('');
});

const data = {
    Items: [
        { Name: 'Apple',  Value: 1.50 },
        { Name: 'Banana', Value: 0.75 }
    ]
};

const out = metaTemplate.parseString('{~each Items|- {{Record.Name}}: {{Record.Value}}\n~}', data);
console.log(out);
```

## Nested Templates (two-pass rendering)

`parseString` is sync when no callback is provided. Render the inner
fragment first, then drop the result into the outer template's data:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

metaTemplate.addPattern('{~', '~}', (pInner, pData) => {
    const value = fable.Utility.getValueByHash(pData, pInner.trim());
    return value == null ? '' : String(value);
});

const innerContent = '<p>Hello, {~Name~}!</p>';
const outerTemplate = '<div class="container">\n{~InnerContent~}\n</div>';

const inner = metaTemplate.parseString(innerContent, { Name: 'World' });
const outer = metaTemplate.parseString(outerTemplate, { InnerContent: inner });
console.log(outer);
```

## Template Inheritance (compose strings, render once)

There is no native template-inheritance system — the same effect is
achieved by composing the final template string in JS, then calling
`parseString` once.

### Define a Base Template

```javascript
const baseTemplate = [
    '<!DOCTYPE html>',
    '<html>',
    '<head><title>{~Title~}</title></head>',
    '<body>',
    '    <header>{~Header~}</header>',
    '    <main>{~Content~}</main>',
    '    <footer>{~Footer~}</footer>',
    '</body>',
    '</html>'
].join('\n');

console.log('baseTemplate length:', baseTemplate.length, 'chars');
```

### Use the Base Template

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

metaTemplate.addPattern('{~', '~}', (pInner, pData) => {
    const value = fable.Utility.getValueByHash(pData, pInner.trim());
    return value == null ? '' : String(value);
});

const baseTemplate = [
    '<!DOCTYPE html>',
    '<html>',
    '<head><title>{~Title~}</title></head>',
    '<body>',
    '    <header>{~Header~}</header>',
    '    <main>{~Content~}</main>',
    '    <footer>{~Footer~}</footer>',
    '</body>',
    '</html>'
].join('\n');

const pageData = {
    Title:   'My Page',
    Header:  '<h1>Welcome</h1>',
    Content: '<p>Main content here</p>',
    Footer:  '<p>&copy; 2024</p>'
};

const page = metaTemplate.parseString(baseTemplate, pageData);
console.log(page);
```

## Use Cases

### Email Templates (substitution + iteration patterns)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

metaTemplate.addPattern('{~', '~}', (pInner, pData) => {
    const value = fable.Utility.getValueByHash(pData, pInner.trim());
    return value == null ? '' : String(value);
});
metaTemplate.addPattern('{~each ', '~}', (pInner, pData) => {
    const sepIndex = pInner.indexOf('|');
    const address  = pInner.slice(0, sepIndex).trim();
    const body     = pInner.slice(sepIndex + 1);
    const list     = fable.Utility.getValueByHash(pData, address) || [];
    return list.map((Record) =>
        body.replace(/\{\{([^}]+)\}\}/g, (_, hash) => {
            const v = fable.Utility.getValueByHash({ Record }, hash.trim());
            return v == null ? '' : String(v);
        })
    ).join('');
});

const emailTemplate = [
    'Dear {~Recipient.Name~},',
    '',
    'Your order #{~Order.Number~} has been {~Order.Status~}.',
    '',
    'Items:',
    '{~each Order.Items|- {{Record.Name}} x {{Record.Quantity}}: ${{Record.Price}}\n~}',
    'Total: ${~Order.Total~}',
    '',
    'Best regards,',
    '{~Sender.Name~}'
].join('\n');

const emailData = {
    Recipient: { Name: 'John' },
    Order: {
        Number: '12345',
        Status: 'shipped',
        Items: [
            { Name: 'Widget', Quantity: 2, Price: '29.99' },
            { Name: 'Gadget', Quantity: 1, Price: '49.99' }
        ],
        Total: '109.97'
    },
    Sender: { Name: 'Support Team' }
};

console.log(metaTemplate.parseString(emailTemplate, emailData));
```

### Report Generation (substitution + iteration)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

metaTemplate.addPattern('{~', '~}', (pInner, pData) => {
    const value = fable.Utility.getValueByHash(pData, pInner.trim());
    return value == null ? '' : String(value);
});
metaTemplate.addPattern('{~each ', '~}', (pInner, pData) => {
    const sepIndex = pInner.indexOf('|');
    const address  = pInner.slice(0, sepIndex).trim();
    const body     = pInner.slice(sepIndex + 1);
    const list     = fable.Utility.getValueByHash(pData, address) || [];
    return list.map((Record) =>
        body.replace(/\{\{([^}]+)\}\}/g, (_, hash) => {
            const v = fable.Utility.getValueByHash({ Record }, hash.trim());
            return v == null ? '' : String(v);
        })
    ).join('');
});

const reportTemplate = [
    '# {~Report.Title~}',
    'Generated: {~Report.Date~}',
    '',
    '## Summary',
    '- Total Records: {~Summary.TotalRecords~}',
    '- Processed: {~Summary.Processed~}',
    '- Errors: {~Summary.Errors~}',
    '',
    '## Details',
    '{~each Details|### {{Record.Category}}\n{{Record.Description}}\nCount: {{Record.Count}}\n\n~}'
].join('\n');

const reportData = {
    Report:  { Title: 'Sales Report', Date: '2024-01-15' },
    Summary: { TotalRecords: 1000, Processed: 980, Errors: 20 },
    Details: [
        { Category: 'Q1', Description: 'First-quarter results',  Count: 240 },
        { Category: 'Q2', Description: 'Second-quarter results', Count: 260 }
    ]
};

console.log(metaTemplate.parseString(reportTemplate, reportData));
```

### Configuration File Generation

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

metaTemplate.addPattern('{~', '~}', (pInner, pData) => {
    const value = fable.Utility.getValueByHash(pData, pInner.trim());
    return value == null ? '' : String(value);
});
metaTemplate.addPattern('{~each ', '~}', (pInner, pData) => {
    const sepIndex = pInner.indexOf('|');
    const address  = pInner.slice(0, sepIndex).trim();
    const body     = pInner.slice(sepIndex + 1);
    const list     = fable.Utility.getValueByHash(pData, address) || [];
    return list.map((Record) =>
        body.replace(/\{\{([^}]+)\}\}/g, (_, hash) => {
            const v = fable.Utility.getValueByHash({ Record }, hash.trim());
            return v == null ? '' : String(v);
        })
    ).join('');
});

const configTemplate = [
    '# Application Configuration',
    '# Generated for {~Environment~}',
    '',
    'server:',
    '  host: {~Server.Host~}',
    '  port: {~Server.Port~}',
    '',
    'database:',
    '  host: {~Database.Host~}',
    '  name: {~Database.Name~}',
    '',
    '{~each Features|{{Record.Name}}:\n  enabled: {{Record.Enabled}}\n\n~}'
].join('\n');

const config = metaTemplate.parseString(configTemplate, {
    Environment: 'production',
    Server:   { Host: '0.0.0.0', Port: 8080 },
    Database: { Host: 'db.example.com', Name: 'myapp' },
    Features: [
        { Name: 'cache', Enabled: true },
        { Name: 'debug', Enabled: false }
    ]
});

console.log(config);
```

### Dynamic Forms

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

metaTemplate.addPattern('{~', '~}', (pInner, pData) => {
    const value = fable.Utility.getValueByHash(pData, pInner.trim());
    return value == null ? '' : String(value);
});
metaTemplate.addPattern('{~each ', '~}', (pInner, pData) => {
    const sepIndex = pInner.indexOf('|');
    const address  = pInner.slice(0, sepIndex).trim();
    const body     = pInner.slice(sepIndex + 1);
    const list     = fable.Utility.getValueByHash(pData, address) || [];
    return list.map((Record) =>
        body.replace(/\{\{([^}]+)\}\}/g, (_, hash) => {
            const v = fable.Utility.getValueByHash({ Record }, hash.trim());
            return v == null ? '' : String(v);
        })
    ).join('');
});

const formTemplate = [
    '<form action="{~Form.Action~}" method="{~Form.Method~}">',
    '{~each Form.Fields|    <div class="field"><label for="{{Record.Id}}">{{Record.Label}}</label><input type="{{Record.Type}}" id="{{Record.Id}}" name="{{Record.Name}}"></div>\n~}',
    '    <button type="submit">{~Form.SubmitText~}</button>',
    '</form>'
].join('\n');

console.log(metaTemplate.parseString(formTemplate, {
    Form: {
        Action:     '/signup',
        Method:     'POST',
        SubmitText: 'Sign Up',
        Fields: [
            { Id: 'email', Name: 'email', Label: 'Email', Type: 'email' },
            { Id: 'name',  Name: 'name',  Label: 'Name',  Type: 'text'  }
        ]
    }
}));
```

## Async Mode

Pass a callback to `parseString` to run asynchronously — parser
functions can complete on their own schedule (via the WordTree's
`addPatternBoth` async-parser slot). The sync mode used above is
selected automatically when no callback is supplied.

## Comparison with Template Service

| Feature | Template (`fable.Utility.template`) | MetaTemplate |
|---------|-------------------------------------|--------------|
| Syntax | `<%= %>` / `<% %>` (underscore) | Whatever you register via `addPattern` |
| Built-in conditionals | JavaScript `<% if %>` | None — write parser-function logic |
| Built-in loops | JavaScript `<% for %>` | None — write parser-function logic |
| JavaScript execution | Yes (compiled function body) | No — pure callbacks |
| Use case | Code-heavy templates | Custom tag syntaxes, replacement-only templates |

## Notes

- MetaTemplate has no built-in tag vocabulary; everything is `addPattern`.
- `parseString` is synchronous unless you pass a callback.
- The `Record` variable convention used in the iteration examples above
  is a JS-side helper inside the iteration parser function — there is
  nothing in MetaTemplate that names it.
- For pattern end strings longer than 2 characters, see the limitation
  note at the top — keep ends short.
