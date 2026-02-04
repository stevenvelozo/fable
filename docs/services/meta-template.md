# MetaTemplate Service

The MetaTemplate service provides advanced templating with meta-programming capabilities, extending the basic Template service with additional features for dynamic template generation and manipulation.

## Access

```javascript
// On-demand service - instantiate when needed
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');
```

## Basic Usage

### Simple Template

```javascript
const metaTemplate = fable.instantiateServiceProvider('MetaTemplate');

const result = metaTemplate.render('Hello, {~Name~}!', { Name: 'World' });
// Returns 'Hello, World!'
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
const template = `
{~Begin:If:ShowGreeting~}
Hello, {~Name~}!
{~End:If:ShowGreeting~}
`;

metaTemplate.render(template, { ShowGreeting: true, Name: 'World' });
// Returns 'Hello, World!'

metaTemplate.render(template, { ShowGreeting: false, Name: 'World' });
// Returns ''
```

### Iteration

```javascript
const template = `
{~Begin:Each:Items~}
- {~Record.Name~}: {~Record.Value~}
{~End:Each:Items~}
`;

const data = {
    Items: [
        { Name: 'Apple', Value: 1.50 },
        { Name: 'Banana', Value: 0.75 }
    ]
};

metaTemplate.render(template, data);
// Returns:
// - Apple: 1.50
// - Banana: 0.75
```

### Nested Templates

```javascript
const outerTemplate = `
<div class="container">
{~InnerContent~}
</div>
`;

const innerContent = '<p>Hello, {~Name~}!</p>';

// First render inner
const inner = metaTemplate.render(innerContent, { Name: 'World' });

// Then render outer
const outer = metaTemplate.render(outerTemplate, { InnerContent: inner });
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
```

### Extend Template

```javascript
const pageData = {
    Title: 'My Page',
    Header: '<h1>Welcome</h1>',
    Content: '<p>Main content here</p>',
    Footer: '<p>&copy; 2024</p>'
};

const page = metaTemplate.render(baseTemplate, pageData);
```

## Use Cases

### Email Templates

```javascript
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

const email = metaTemplate.render(emailTemplate, emailData);
```

### Report Generation

```javascript
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
```

### Configuration File Generation

```javascript
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

const config = metaTemplate.render(configTemplate, {
    Environment: 'production',
    Server: { Host: '0.0.0.0', Port: 8080 },
    Database: { Host: 'db.example.com', Name: 'myapp', UseSSL: true },
    Features: [
        { Name: 'cache', Enabled: true },
        { Name: 'debug', Enabled: false }
    ]
});
```

### Dynamic Forms

```javascript
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
