# MetaTemplate Service

> **Note on examples**: MetaTemplate's actual surface is `addPattern(start, end, parserFn)` + `parseString(string, data, callback, ...)`. The simplified `metaTemplate.render(template, data)` examples below are conceptual demonstrations of the `{~ ~}` templating syntax — they show what a configured MetaTemplate produces, not the literal method call. See `Fable-Service-MetaTemplate.js` for the real `parseString` signature.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');
console.log('metaTemplate:', typeof metaTemplate);
```

## Basic Usage

### Simple Template

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

// Conceptual demonstration — the real API is metaTemplate.parseString(...)
// with patterns registered via metaTemplate.addPattern(start, end, parserFn):
console.info("Template:  'Hello, {~Name~}!'");
console.info("Data:      { Name: 'World' }");
console.info("Output:    'Hello, World!'");
console.log('metaTemplate service ready:', typeof metaTemplate.parseString);
```

### Template Syntax

MetaTemplate uses a different syntax from the standard Template service:

| Pattern | Description | Example |
|---------|-------------|---------|
| `{~Property~}` | Simple substitution | `{~Name~}` |
| `{~Object.Property~}` | Nested property | `{~User.Name~}` |
| `{~Array[0]~}` | Array access | `{~Items[0]~}` |

## Advanced Features

### Conditional Rendering

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const template = `
{~Begin:If:ShowGreeting~}
Hello, {~Name~}!
{~End:If:ShowGreeting~}
`;

// Conceptual rendering — see top-of-file note about the real parseString API.
console.info('Template:', template);
console.info('With ShowGreeting=true  -> "Hello, World!"');
console.info('With ShowGreeting=false -> ""');
console.log('metaTemplate.parseString is available:', typeof metaTemplate.parseString);
```

### Iteration

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const template = `
{~Begin:Each:Items~}
- {~Record.Name~}: {~Record.Value~}
{~End:Each:Items~}
`;

const data = {
    Items: [
        { Name: 'Apple',  Value: 1.50 },
        { Name: 'Banana', Value: 0.75 }
    ]
};

// Conceptual rendering — see top-of-file note.
console.info('Template:', template);
console.info('Data:',     data);
console.info('Expected output:\n- Apple: 1.50\n- Banana: 0.75');
console.log('metaTemplate ready:', typeof metaTemplate);
```

### Nested Templates

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const outerTemplate = `
<div class="container">
{~InnerContent~}
</div>
`;

const innerContent = '<p>Hello, {~Name~}!</p>';

// Conceptual two-pass rendering — see top-of-file note.
console.info('Inner template:', innerContent);
console.info('Inner data:    { Name: "World" }  -> "<p>Hello, World!</p>"');
console.info('Outer template:', outerTemplate);
console.info('Outer data:    { InnerContent: <inner-result> }  ->  full <div>...</div>');
console.log('metaTemplate ready:', typeof metaTemplate);
```

## Template Inheritance

### Define Base Template

```javascript
const baseTemplate = `
<!DOCTYPE html>
<html>
<head><title>{~Title~}</title></head>
<body>
    <header>{~Header~}</header>
    <main>{~Content~}</main>
    <footer>{~Footer~}</footer>
</body>
</html>
`;
console.log('baseTemplate length:', baseTemplate.length, 'chars');
```

### Extend Template

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const baseTemplate = `
<!DOCTYPE html>
<html>
<head><title>{~Title~}</title></head>
<body>
    <header>{~Header~}</header>
    <main>{~Content~}</main>
    <footer>{~Footer~}</footer>
</body>
</html>
`;

const pageData = {
    Title:   'My Page',
    Header:  '<h1>Welcome</h1>',
    Content: '<p>Main content here</p>',
    Footer:  '<p>&copy; 2024</p>'
};

// Conceptual rendering — see top-of-file note.
console.info('Base template length:', baseTemplate.length);
console.info('Page data:',             pageData);
console.log('Would render a full HTML document with {~Title~}, {~Header~}, {~Content~}, {~Footer~} interpolated.');
```

## Use Cases

### Email Templates

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const emailTemplate = `
Dear {~Recipient.Name~},

{~Begin:If:HasOrder~}
Your order #{~Order.Number~} has been {~Order.Status~}.

Items:
{~Begin:Each:Order.Items~}
- {~Record.Name~} x {~Record.Quantity~}: ${~Record.Price~}
{~End:Each:Order.Items~}

Total: ${~Order.Total~}
{~End:If:HasOrder~}

{~Begin:If:IsPromotion~}
Special offer: {~Promotion.Message~}
{~End:If:IsPromotion~}

Best regards,
{~Sender.Name~}
`;

const emailData = {
    Recipient: { Name: 'John' },
    HasOrder: true,
    Order: {
        Number: '12345',
        Status: 'shipped',
        Items: [
            { Name: 'Widget', Quantity: 2, Price: '29.99' },
            { Name: 'Gadget', Quantity: 1, Price: '49.99' }
        ],
        Total: '109.97'
    },
    IsPromotion: false,
    Sender: { Name: 'Support Team' }
};

// Conceptual rendering — see top-of-file note.
console.info('Email template length:', emailTemplate.length);
console.info('Email data:',            emailData);
console.log('Would render an email with order details, items, totals, and signature.');
```

### Report Generation

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const reportTemplate = `
# {~Report.Title~}
Generated: {~Report.Date~}

## Summary
- Total Records: {~Summary.TotalRecords~}
- Processed: {~Summary.Processed~}
- Errors: {~Summary.Errors~}

## Details
{~Begin:Each:Details~}
### {~Record.Category~}
{~Record.Description~}
Count: {~Record.Count~}
{~End:Each:Details~}

{~Begin:If:HasWarnings~}
## Warnings
{~Begin:Each:Warnings~}
- {~Record~}
{~End:Each:Warnings~}
{~End:If:HasWarnings~}
`;

// Conceptual rendering — see top-of-file note.
const reportData = {
    Report:  { Title: 'Sales Report', Date: '2024-01-15' },
    Summary: { TotalRecords: 1000, Processed: 980, Errors: 20 },
    Details: [
        { Category: 'Q1', Description: 'First-quarter results', Count: 240 },
        { Category: 'Q2', Description: 'Second-quarter results', Count: 260 }
    ],
    HasWarnings: true,
    Warnings:    ['Two outliers detected', 'Network timeout on row 412']
};
console.info('Report template length:', reportTemplate.length);
console.info('Report data:',             reportData);
console.log('Would render a Markdown report with summary, details, and warnings sections.');
```

### Configuration File Generation

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const configTemplate = `
# Application Configuration
# Generated for {~Environment~}

server:
  host: {~Server.Host~}
  port: {~Server.Port~}

database:
  host: {~Database.Host~}
  name: {~Database.Name~}
  {~Begin:If:Database.UseSSL~}
  ssl: true
  {~End:If:Database.UseSSL~}

{~Begin:Each:Features~}
{~Record.Name~}:
  enabled: {~Record.Enabled~}
{~End:Each:Features~}
`;

// Conceptual rendering — see top-of-file note.
const configData = {
    Environment: 'production',
    Server:   { Host: '0.0.0.0',       Port: 8080 },
    Database: { Host: 'db.example.com', Name: 'myapp', UseSSL: true },
    Features: [
        { Name: 'cache', Enabled: true },
        { Name: 'debug', Enabled: false }
    ]
};
console.info('Config template length:', configTemplate.length);
console.info('Config data:',             configData);
console.log('Would render a YAML-like configuration file.');
```

### Dynamic Forms

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MetaTemplateDemo', ProductVersion: '1.0.0' });
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const formTemplate = `
<form action="{~Form.Action~}" method="{~Form.Method~}">
{~Begin:Each:Form.Fields~}
    <div class="field">
        <label for="{~Record.Id~}">{~Record.Label~}</label>
        <input type="{~Record.Type~}" id="{~Record.Id~}" name="{~Record.Name~}"
               {~Begin:If:Record.Required~}required{~End:If:Record.Required~}>
    </div>
{~End:Each:Form.Fields~}
    <button type="submit">{~Form.SubmitText~}</button>
</form>
`;

// Conceptual rendering — see top-of-file note.
const formData = {
    Form: {
        Action:     '/signup',
        Method:     'POST',
        SubmitText: 'Sign Up',
        Fields: [
            { Id: 'email', Name: 'email', Label: 'Email', Type: 'email', Required: true },
            { Id: 'name',  Name: 'name',  Label: 'Name',  Type: 'text',  Required: false }
        ]
    }
};
console.info('Form template length:', formTemplate.length);
console.info('Form data:',             formData);
console.log('Would render an HTML form with two fields.');
```

## Comparison with Template Service

| Feature | Template | MetaTemplate |
|---------|----------|--------------|
| Syntax | `<%= %>` / `<% %>` | `{~ ~}` |
| Conditionals | JavaScript `if` | `{~Begin:If~}` |
| Loops | JavaScript `for` | `{~Begin:Each~}` |
| JavaScript execution | Yes | Limited |
| Use case | Code-heavy templates | Data-driven templates |

## Best Practices

1. **Use MetaTemplate for data-driven content**: When templates are mostly about inserting values
2. **Use Template for logic-heavy content**: When you need complex JavaScript logic
3. **Keep templates readable**: Use clear section names
4. **Validate data before rendering**: Ensure required properties exist

## Notes

- MetaTemplate is designed for safer, more declarative templates
- Less JavaScript execution means less risk of injection
- Templates can be stored in files and loaded dynamically
- The `Record` variable is special within `Each` blocks
