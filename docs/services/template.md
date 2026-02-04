# Template Service

The Template service provides underscore/lodash-style template compilation and rendering. It compiles string templates into reusable functions.

## Access

```javascript
// On-demand service - instantiate when needed
const template = fable.instantiateServiceProvider('Template');

// Or use the Utility service shorthand
const renderFn = fable.Utility.template('Hello, <%= name %>!');
```

## Template Syntax

### Interpolation (`<%= %>`)

Output a value:

```javascript
const template = fable.instantiateServiceProvider('Template');
const render = template.buildTemplateFunction('Hello, <%= name %>!');

render({ name: 'World' });  // Returns 'Hello, World!'
```

### Evaluation (`<% %>`)

Execute JavaScript code:

```javascript
const render = template.buildTemplateFunction(`
    <% for (var i = 0; i < items.length; i++) { %>
        Item: <%= items[i] %>
    <% } %>
`);

render({ items: ['Apple', 'Banana', 'Cherry'] });
```

## Basic Usage

### Create and Use Template

```javascript
const template = fable.instantiateServiceProvider('Template');

// Build the template function
const greetingTemplate = template.buildTemplateFunction('Hello, <%= name %>!');

// Use it multiple times
greetingTemplate({ name: 'Alice' });  // 'Hello, Alice!'
greetingTemplate({ name: 'Bob' });    // 'Hello, Bob!'
```

### Immediate Rendering

Pass data as the second argument to render immediately:

```javascript
const result = template.buildTemplateFunction('Sum: <%= a + b %>', { a: 5, b: 3 });
// Returns 'Sum: 8'
```

## Using the Utility Shorthand

The Utility service provides a convenient wrapper:

```javascript
// Create a template function
const greet = fable.Utility.template('Hello, <%= name %>!');
greet({ name: 'World' });

// Or render immediately
fable.Utility.template('Hello, <%= name %>!', { name: 'World' });
```

### Hashed Templates

Register templates for reuse by name:

```javascript
// Register a template
fable.Utility.buildHashedTemplate('user-card', `
    <div class="card">
        <h2><%= user.name %></h2>
        <p><%= user.email %></p>
    </div>
`);

// Use the registered template
fable.Utility.templates['user-card']({ user: { name: 'John', email: 'john@example.com' } });
```

## Examples

### HTML Generation

```javascript
const cardTemplate = template.buildTemplateFunction(`
    <div class="card">
        <h2><%= title %></h2>
        <p><%= description %></p>
        <% if (showButton) { %>
            <button><%= buttonText %></button>
        <% } %>
    </div>
`);

cardTemplate({
    title: 'Welcome',
    description: 'This is a card component',
    showButton: true,
    buttonText: 'Click Me'
});
```

### Lists and Loops

```javascript
const listTemplate = template.buildTemplateFunction(`
    <ul>
        <% for (var i = 0; i < items.length; i++) { %>
            <li><%= items[i].name %>: $<%= items[i].price %></li>
        <% } %>
    </ul>
`);

listTemplate({
    items: [
        { name: 'Apple', price: 1.50 },
        { name: 'Banana', price: 0.75 }
    ]
});
```

### Conditional Content

```javascript
const statusTemplate = template.buildTemplateFunction(`
    <% if (status === 'active') { %>
        <span class="badge-green">Active</span>
    <% } else if (status === 'pending') { %>
        <span class="badge-yellow">Pending</span>
    <% } else { %>
        <span class="badge-red">Inactive</span>
    <% } %>
`);

statusTemplate({ status: 'active' });
```

### Nested Data

```javascript
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

profileTemplate({
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
});
```

### Print Function

Use `print()` for inline output:

```javascript
const template = template.buildTemplateFunction(`
    <% print('Hello'); print(' '); print('World'); %>
`);

template({});  // Returns 'Hello World'
```

## Template Source Access

After building a template, you can access the generated source:

```javascript
const tpl = fable.instantiateServiceProvider('Template');
tpl.buildTemplateFunction('Hello, <%= name %>!');

// Access the generated function source
console.log(tpl.TemplateSource);
console.log(tpl.TemplateSourceCompiled);
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
