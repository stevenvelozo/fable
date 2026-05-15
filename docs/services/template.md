# Template Service

The Template service provides underscore/lodash-style template compilation and rendering. It compiles string templates into reusable functions.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });

// On-demand service - instantiate when needed
const template = fable.instantiateServiceProvider('Template');
console.log('template service:', typeof template);

// Or use the Utility service shorthand
const renderFn = fable.Utility.template('Hello, <%= name %>!');
console.log('renderFn:', typeof renderFn);
```

## Template Syntax

### Interpolation (`<%= %>`)

Output a value:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });

const template = fable.instantiateServiceProvider('Template');
const render = template.buildTemplateFunction('Hello, <%= name %>!');

console.log(render({ name: 'World' }));  // Returns 'Hello, World!'
```

### Evaluation (`<% %>`)

Execute JavaScript code:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });
const template = fable.instantiateServiceProvider('Template');

const render = template.buildTemplateFunction(`
    <% for (var i = 0; i < items.length; i++) { %>
        Item: <%= items[i] %>
    <% } %>
`);

console.log(render({ items: ['Apple', 'Banana', 'Cherry'] }));
```

## Basic Usage

### Create and Use Template

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });

const template = fable.instantiateServiceProvider('Template');

// Build the template function
const greetingTemplate = template.buildTemplateFunction('Hello, <%= name %>!');

// Use it multiple times
console.log(greetingTemplate({ name: 'Alice' }));  // 'Hello, Alice!'
console.log(greetingTemplate({ name: 'Bob' }));    // 'Hello, Bob!'
```

### Immediate Rendering

Pass data as the second argument to render immediately:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });
const template = fable.instantiateServiceProvider('Template');

const result = template.buildTemplateFunction('Sum: <%= a + b %>', { a: 5, b: 3 });
console.log(result);
// Returns 'Sum: 8'
```

## Using the Utility Shorthand

The Utility service provides a convenient wrapper:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });

// Create a template function
const greet = fable.Utility.template('Hello, <%= name %>!');
console.log(greet({ name: 'World' }));

// Or render immediately
console.log(fable.Utility.template('Hello, <%= name %>!', { name: 'World' }));
```

### Hashed Templates

Register templates for reuse by name:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });

// Register a template
fable.Utility.buildHashedTemplate('user-card', `
    <div class="card">
        <h2><%= user.name %></h2>
        <p><%= user.email %></p>
    </div>
`);

// Use the registered template
console.log(fable.Utility.templates['user-card']({ user: { name: 'John', email: 'john@example.com' } }));
```

## Examples

### HTML Generation

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });
const template = fable.instantiateServiceProvider('Template');

const cardTemplate = template.buildTemplateFunction(`
    <div class="card">
        <h2><%= title %></h2>
        <p><%= description %></p>
        <% if (showButton) { %>
            <button><%= buttonText %></button>
        <% } %>
    </div>
`);

console.log(cardTemplate({
    title: 'Welcome',
    description: 'This is a card component',
    showButton: true,
    buttonText: 'Click Me'
}));
```

### Lists and Loops

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });
const template = fable.instantiateServiceProvider('Template');

const listTemplate = template.buildTemplateFunction(`
    <ul>
        <% for (var i = 0; i < items.length; i++) { %>
            <li><%= items[i].name %>: $<%= items[i].price %></li>
        <% } %>
    </ul>
`);

console.log(listTemplate({
    items: [
        { name: 'Apple',  price: 1.50 },
        { name: 'Banana', price: 0.75 }
    ]
}));
```

### Conditional Content

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });
const template = fable.instantiateServiceProvider('Template');

const statusTemplate = template.buildTemplateFunction(`
    <% if (status === "active") { %>
        <span class="badge-green">Active</span>
    <% } else if (status === "pending") { %>
        <span class="badge-yellow">Pending</span>
    <% } else { %>
        <span class="badge-red">Inactive</span>
    <% } %>
`);

console.log(statusTemplate({ status: 'active' }));
```

### Nested Data

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });
const template = fable.instantiateServiceProvider('Template');

const profileTemplate = template.buildTemplateFunction(`
    <div class="profile">
        <h1><%= user.name %></h1>
        <p>Email: <%= user.contact.email %></p>
        <p>Phone: <%= user.contact.phone %></p>
        <h3>Addresses:</h3>
        <% for (var i = 0; i < user.addresses.length; i++) { %>
            <p><%= user.addresses[i].street %>, <%= user.addresses[i].city %></p>
        <% } %>
    </div>
`);

console.log(profileTemplate({
    user: {
        name: 'John Doe',
        contact: {
            email: 'john@example.com',
            phone: '555-1234'
        },
        addresses: [
            { street: '123 Main St', city: 'Anytown' },
            { street: '456 Oak Ave', city: 'Other City' }
        ]
    }
}));
```

### Print Function

Use `print()` for inline output:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });
const template = fable.instantiateServiceProvider('Template');

const printTemplate = template.buildTemplateFunction(`
    <% print("Hello"); print(" "); print("World"); %>
`);

console.log(printTemplate({}));  // Returns 'Hello World'
```

## Template Source Access

After building a template, you can access the generated source:

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'TemplateDemo', ProductVersion: '1.0.0' });

const tpl = fable.instantiateServiceProvider('Template');
tpl.buildTemplateFunction('Hello, <%= name %>!');

// Access the generated function source
console.log('TemplateSource:',         tpl.TemplateSource);
console.log('TemplateSourceCompiled:', tpl.TemplateSourceCompiled);
```

## Escape Handling

The template engine handles these escape sequences:

- `\\` - Backslash
- `'` - Single quote
- `\r` - Carriage return
- `\n` - Newline
- `\t` - Tab
- `\u2028` - Line separator
- `\u2029` - Paragraph separator

## Notes

- This implementation is compatible with underscore/lodash template syntax
- Does NOT implement underscore's escape expressions (`<%- %>`)
- Does NOT implement automatic browser variable assignment
- Templates are compiled to JavaScript functions for performance
- URL-encoded content in templates is automatically decoded

## Performance Tips

1. **Compile once, use many times**: Store template functions and reuse them
2. **Use hashed templates**: For frequently used templates, register them with `buildHashedTemplate`
3. **Avoid complex logic**: Keep template logic simple; move complex operations to the data preparation phase
