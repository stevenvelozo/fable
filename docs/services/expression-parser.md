# ExpressionParser Service

The ExpressionParser service provides mathematical expression parsing and evaluation with arbitrary precision support. It converts infix expressions to postfix (Reverse Polish) notation internally and evaluates them using the Math service.

## Access

```javascript
// On-demand service - instantiate when needed
const parser = fable.instantiateServiceProviderIfNotExists('ExpressionParser');
```

## Basic Usage

### The `solve()` Method

The primary method is `solve()`, which parses and evaluates expressions:

```javascript
parser.solve('1 + 1');        // Returns '2'
parser.solve('10 * 2');       // Returns '20'
parser.solve('100 / 4');      // Returns '25'
parser.solve('2 ^ 10');       // Returns '1024'
```

### Full Signature

```javascript
parser.solve(expression, dataObject, resultObject, manifest, destinationObject);
```

- **expression** -- the expression string to evaluate
- **dataObject** -- object containing variable values (optional)
- **resultObject** -- object to store solver metadata/logs (optional)
- **manifest** -- a Manyfest instance for address resolution, or `false` (optional)
- **destinationObject** -- object where named results are written (optional)

### Assigning Results

Use `=` to assign a result to a named destination:

```javascript
const dest = {};
parser.solve('Area = 5 * 10', {}, {}, false, dest);
// dest.Area === '50'
```

### Null Coalescence Assignment

Use `?=` to only assign if the destination property doesn't already exist:

```javascript
parser.solve('Name ?= GETVALUE("AppData.Students[0]")', data, {}, false, dest);
// Only sets dest.Name if it was not previously set
```

## Operators

### Arithmetic Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `+` | Addition | `5 + 3` -> `'8'` |
| `-` | Subtraction | `5 - 3` -> `'2'` |
| `*` | Multiplication | `5 * 3` -> `'15'` |
| `/` | Division | `15 / 3` -> `'5'` |
| `^` | Power | `2 ^ 3` -> `'8'` |
| `%` | Modulus | `10 % 3` -> `'1'` |

### Comparison Operators

Comparison operators evaluate to `'1'` (true) or `'0'` (false). They bind looser than arithmetic, so `2 + 3 > 1 + 2` evaluates the math first.

| Operator | Description | Example |
|----------|-------------|---------|
| `>` | Greater than | `5 > 3` -> `'1'` |
| `>=` | Greater than or equal | `5 >= 5` -> `'1'` |
| `<` | Less than | `3 < 5` -> `'1'` |
| `<=` | Less than or equal | `3 <= 3` -> `'1'` |
| `==` | Equal | `5 == 5` -> `'1'` |
| `!=` | Not equal | `5 != 3` -> `'1'` |

```javascript
parser.solve('Result = 5 > 3', {}, {}, false, dest);
// dest.Result === '1'

parser.solve('Result = 2 + 3 > 1 + 2', {}, {}, false, dest);
// dest.Result === '1' (evaluates as (2+3) > (1+2), i.e. 5 > 3)

parser.solve('Result = Height > Width', { Height: 10, Width: 5 }, {}, false, dest);
// dest.Result === '1'
```

### Ternary Operator

The ternary operator provides inline conditional expressions using `?` and `::` syntax:

```
condition ? trueValue :: falseValue
```

The condition is typically a comparison expression. If it evaluates to a truthy value (non-zero, non-empty), the true branch is returned; otherwise the false branch is returned.

```javascript
parser.solve('Result = 5 > 3 ? 100 :: 200', {}, {}, false, dest);
// dest.Result === '100'

parser.solve('Result = 3 > 5 ? 100 :: 200', {}, {}, false, dest);
// dest.Result === '200'

parser.solve('Winner = Height > Width ? Height :: Width',
    { Height: 10, Width: 5 }, {}, false, dest);
// dest.Winner === '10'

// Arithmetic in branches
parser.solve('Result = A > B ? A + 1 :: B + 1',
    { A: 10, B: 5 }, {}, false, dest);
// dest.Result === '11'

// Nested ternary (use parentheses for inner ternary)
parser.solve('Result = A > 0 ? (B > 0 ? 1 :: 2) :: 3',
    { A: 1, B: 1 }, {}, false, dest);
// dest.Result === '1'
```

The ternary operator uses `::` (double colon) instead of `:` for the false branch separator because `:` is already used as the Expression Begin token in directives like `MAP`, `SERIES`, etc.

Internally, `condition ? trueValue :: falseValue` is desugared to `ternary((condition), trueValue, falseValue)` before evaluation. See the [ternary function documentation](./expression-parser-functions/ternary.md) for details.

### Order of Operations

```javascript
parser.solve('5 + 2 * 10');           // Returns '25'
parser.solve('3.5 + 5 + 10 * 10 / 5');  // Returns '28.5'
parser.solve('(100 - 10)');           // Returns '90'
```

### Negative Numbers

```javascript
parser.solve('Value = -3', {}, {}, false, dest);
// dest.Value === '-3'

parser.solve('Value2 = (4 + -3)', {}, {}, false, dest);
// dest.Value2 === '1'
```

## Variables

### Using Data Objects

```javascript
parser.solve('X * Y * Z', { X: 5, Y: 3.1, Z: 75 });  // Returns '1162.5'

parser.solve('Area = X * Y * Z', { X: 5.867, Y: 3.1, Z: 75 }, {}, false, dest);
// dest.Area === '1364.0775'
```

### Accessing Fable AppData

Use `GETVALUE()` to read from `fable.AppData`:

```javascript
fable.AppData = { Pit: 'Bottomless' };
parser.solve('PitSize = getvalue("AppData.Pit")', {}, {}, false, dest);
// dest.PitSize === 'Bottomless'

fable.AppData = { Students: ['Kim', 'Jim', 'Joan Jett', 'Tank Girl'] };
parser.solve('Name = GETVALUE("AppData.Students[1]")', {}, {}, false, dest);
// dest.Name === 'Jim'
```

## Built-in Functions

### Math Functions

```javascript
parser.solve('sqrt(16)');           // '4'
parser.solve('sin(rad(60))');       // '0.8660254037844386'
parser.solve('1.5 * sqrt(8 * 2.423782342^2) / 10');  // '1.02832375808904701855'
```

### Rounding

```javascript
parser.solve('ROUND(X * Y * Z)', { X: 5.867, Y: 3.1, Z: 75 });      // '1364'
parser.solve('ROUND(X * Y * Z, 2)', { X: 5.867, Y: 3.1, Z: 75 });    // '1364.08'
parser.solve('ROUND(X * Y * Z, 3, 3)', { X: 5.867, Y: 3.5, Z: 75.248923423 });  // '1545.2'
```

### Aggregate Functions (on Arrays)

```javascript
parser.solve('SUM(ItemCosts)', { ItemCosts: [100, 200, 50, 45, 5] });     // '400'
parser.solve('MEAN(ItemCosts)', { ItemCosts: [100, 200, 50, 45, 5] });    // '80'
parser.solve('MEDIAN(ItemCosts)', { ItemCosts: [100, 200, 50, 45, 5] });  // '50'
parser.solve('COUNT(ItemCosts)', { ItemCosts: [100, 200, 50, 45, 5] });   // '5'
parser.solve('STDEV(Values)', { Values: [1,2,3,4,5,6,7,8,9,10,11] });     // ~3.3166
parser.solve('STDEVP(Values)', { Values: [1,2,3,4,5,6,7,8,9,10,11] });    // ~3.1623
```

### String Functions

```javascript
parser.solve('Names = concat(AppData.Cities[].city)', fable);
// Concatenates all city names (skipping non-string values)

parser.solve('JoinedNames = join("&comma; ", AppData.CityNames)', fable);
// Joins with separator, resolving HTML entities

parser.solve('NameList = STRINGGETSEGMENTS(Names, ",")', { Names: 'Jane,John' });
// Returns ['Jane', 'John']
```

### Conditional Functions

#### Ternary Operator (inline conditional)

The preferred way to write inline conditionals is with the ternary operator:

```javascript
parser.solve('Label = Score >= 70 ? "Pass" :: "Fail"', { Score: 85 }, {}, false, dest);
// dest.Label === 'Pass'
```

See [Ternary Operator](#ternary-operator) above and the [ternary function reference](./expression-parser-functions/ternary.md).

#### When (truthy check)

```javascript
parser.solve('Name = When(AppData.Cities[0].city, AppData.Cities[0].city)', fable, {}, false, dest);
// If first arg is truthy, returns second arg; otherwise returns ''
```

#### If (comparison)

```javascript
parser.solve('GTE = If(latitude, "<", "50", "west", "east")', data, {}, false, dest);
// If latitude < 50, returns 'west', else 'east'

// Supports ==, ===, <, >, LT, LTE, GT, GTE operators
parser.solve('Equals = If(city, "==", "New York", "yes", "no")', data, {}, false, dest);
```

### Date Functions

```javascript
parser.solve('Result = datemilliseconddifference("2023-08-10T05:00:00.000Z", "2023-08-11T05:00:00.000Z")');
// Returns '86400000'

parser.solve('Result = datehourdifference(StartDate, EndDate)', { StartDate: '2023-08-10T05:00:00.000Z', EndDate: '2023-08-11T05:00:00.000Z' });
// Returns '24'

parser.solve('DATEFROMPARTS(2025, 4, 1)');
// Returns '2025-04-01T00:00:00.000Z'

parser.solve('DATEADDDAYS(DATEFROMPARTS(2025, 4, 1, 13, 03, 51, 761), 87)');
// Returns '2025-06-27T13:03:51.761Z'
```

Also available: `dateseconddifference`, `dateminutedifference`, `datedaydifference`, `dateweekdifference`, `datemonthdifference`, `dateyeardifference`.

### Histogram and Aggregation Functions

```javascript
// Count distribution by field
parser.solve('Result = distributionhistogram("AppData.Cities", "state")', fable, {}, false, dest);
// dest.Result = { Alabama: 12, Colorado: 21, ... }

// Sum a numeric field grouped by another field
parser.solve('Result = aggregationHistogram("AppData.Cities", "state", "population")', fable, {}, false, dest);
// dest.Result = { Alabama: '1279813', ... }
```

### Data Generation Functions

```javascript
parser.solve('RandomIntValue = RANDOMINTEGER()');
parser.solve('RandomIntValueBetween = RANDOMINTEGERBETWEEN(10, 13)');
parser.solve('RandomFloatValue = randomFloat()');
parser.solve('RandomFloatValueBetween = randomFloatBetween(10.5, 13.78)');
```

### Array Functions

```javascript
parser.solve('SLICE(W, 0, 1)', { W: ['3', '4', '5'] });  // Returns ['5'] (first element)
parser.solve('FLATTEN(AppData.Cities[].population, AppData.Cities[].latitude)', fable);
```

## Advanced Features

### MAP Expressions

Map over arrays to transform values:

```javascript
// Simple map
parser.solve('Result = MAP VAR x FROM Values : x + 100',
    { Values: [1, 2, 3, 4, 5] }, {}, manifest, dest);
// dest.Result === ['101', '102', '103', '104', '105']

// Multi-variable map (cross product)
parser.solve('Result = MAP VAR city FROM Cities VAR x FROM Values : city.population + (x * 1000000000000000)',
    data, {}, manifest, dest);
```

### SERIES Expressions

Generate series of computed values:

```javascript
parser.solve('Result = SERIES FROM 13.2 TO 25 STEP 0.2 : 1000 + (n / 2)',
    {}, {}, manifest, dest);
// dest.Result[0] === '1006.6'

// With stepIndex variable
parser.solve('Result = SERIES FROM 13.2 TO 25 STEP 0.5 : (1000 * stepIndex) + n',
    {}, {}, manifest, dest);

// Variables can be used for FROM, TO, STEP
parser.solve('XValues = SERIES FROM StartValue TO EndValue STEP StepValue : (BaseValue * stepIndex) + n',
    appData, {}, manifest, appData);
```

### MONTECARLO Expressions

Run Monte Carlo simulations:

```javascript
parser.solve('Result = MONTECARLO SAMPLECOUNT 1000 VAR x PT x 50 PT x 100 : 10000000 + x',
    {}, {}, manifest, dest);
// dest.Result.Samples.length === 1000

// Multi-variable Rosenbrock function
parser.solve('Result = MONTECARLO SAMPLECOUNT 5000 VAR x PT x -3 PT x 3 VAR y PT y -1 PT y 5 : (1 - x)^2 + 100 * (y - x^2)^2',
    {}, {}, manifest, dest);
```

### MULTIROWMAP Expressions

Iterate over an array of objects (rows) with multi-row lookback and lookahead. Each variable can reference the current row or any row at a relative offset, with configurable defaults for out-of-bounds access.

```javascript
// Syntax:
// Result = MULTIROWMAP ROWS FROM <address>
//   [SERIESSTART <n>] [SERIESSTEP <n>]
//   VAR <name> FROM <property> [OFFSET <n>] [DEFAULT <value>]
//   ... : <expression>

// Basic: compute area from each row's Width and Height
parser.solve('Areas = MULTIROWMAP ROWS FROM Rows VAR w FROM Width VAR h FROM Height : w * h',
    { Rows: [{Width:10,Height:20}, {Width:30,Height:40}] }, {}, manifest, dest);
// dest.Areas === ['200', '1200']

// Previous row lookback (day-over-day change)
parser.solve('Change = MULTIROWMAP ROWS FROM Prices VAR Today FROM Close VAR Yesterday FROM Close OFFSET -1 DEFAULT 0 : Today - Yesterday',
    data, {}, manifest, dest);

// Two-row lookback (Fibonacci verification)
parser.solve('Check = MULTIROWMAP ROWS FROM FibRows VAR Cur FROM Fib VAR P1 FROM Fib OFFSET -1 DEFAULT 0 VAR P2 FROM Fib OFFSET -2 DEFAULT 0 : Cur - (P1 + P2)',
    data, {}, manifest, dest);

// Forward lookback (next row reference)
parser.solve('NextDiff = MULTIROWMAP ROWS FROM Rows VAR Cur FROM Value VAR Next FROM Value OFFSET 1 DEFAULT 0 : Next - Cur',
    data, {}, manifest, dest);

// Central difference (both directions)
parser.solve('Deriv = MULTIROWMAP ROWS FROM Rows VAR Prev FROM Value OFFSET -1 DEFAULT 0 VAR Next FROM Value OFFSET 1 DEFAULT 0 : (Next - Prev) / 2',
    data, {}, manifest, dest);

// SERIESSTART: skip initial rows (start from row 2)
parser.solve('MA = MULTIROWMAP ROWS FROM Prices SERIESSTART 2 VAR c0 FROM Close VAR c1 FROM Close OFFSET -1 DEFAULT 0 VAR c2 FROM Close OFFSET -2 DEFAULT 0 : (c0 + c1 + c2) / 3',
    data, {}, manifest, dest);

// Negative SERIESSTART: start from 2 rows before end
parser.solve('LastTwo = MULTIROWMAP ROWS FROM Rows SERIESSTART -2 VAR v FROM Value : v + 0',
    data, {}, manifest, dest);

// SERIESSTEP -1: iterate backwards
parser.solve('Reversed = MULTIROWMAP ROWS FROM Rows SERIESSTART -1 SERIESSTEP -1 VAR v FROM Value : v + 0',
    data, {}, manifest, dest);

// SERIESSTEP 2: every other row
parser.solve('Sampled = MULTIROWMAP ROWS FROM Rows SERIESSTEP 2 VAR v FROM Value : v + 0',
    data, {}, manifest, dest);
```

**Available variables in MULTIROWMAP expressions:**
- `stepIndex` -- iteration counter (0, 1, 2, ...)
- `rowIndex` -- actual array index of the current row
- Any VAR-mapped variable names

**OFFSET values:**
- `0` (default) -- current row
- `-1` -- previous row, `-2` -- two rows back, `-3` -- three back, etc.
- `1` -- next row, `2` -- two ahead, etc.

### ITERATIVESERIES

Run cumulative computations over arrays:

```javascript
parser.solve('Result = ITERATIVESERIES(Values, "Value", "Resultant", 1, "add")',
    { Values: [{ Value: 10 }, { Value: 20 }, { Value: 5 }] });
// Returns [{ Value: 10, Resultant: '10' }, { Value: 20, Resultant: '30' }, { Value: 5, Resultant: '35' }]
```

### Linear Regression

```javascript
// Compute regression coefficients
parser.solve('Coefficients = LINEST(FLATTEN(AppData.Cities[].latitude), FLATTEN(AppData.Cities[].population))',
    fable, results, false, fable.AppData);

// Predict from coefficients
parser.solve('Predicted = PREDICT(Coefficients, vector)', data, results, false, dest);
```

### Custom Solver Functions

Register custom functions that can be called from expressions:

```javascript
fable.MonkeyFunction = (pParameter) => { return `Monkey says hello to ${pParameter}`; };
parser.addSolverFunction('monkeypatchedfunction', 'fable.MonkeyFunction', 'Documentation string');

parser.solve('Result = monkeypatchedfunction("Jerry")', fable, {}, false, dest);
// dest.Result === 'Monkey says hello to Jerry'
```

## Logging and Debugging

```javascript
// Access solver result logs
parser.Messaging.logFunctionSolve(resultObject);
```

## Notes

- Uses postfix (Reverse Polish) notation internally for evaluation
- All numeric results are returned as strings for arbitrary precision
- Variables are resolved from the dataObject using Manyfest path notation
- Mismatched parentheses cause the expression to fail without mutating the destination
- Non-numeric values used in arithmetic are treated as zero
- The `===` operator in `If()` does exact string comparison; `==` uses epsilon comparison for numbers
