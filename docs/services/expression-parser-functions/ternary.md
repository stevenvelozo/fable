# ternary

Numeric-aware conditional selection. This is the function behind the `? ::` ternary operator syntax, and can also be called directly.

## Ternary Operator Syntax

The ternary operator provides inline if/else logic within expressions:

```
condition ? trueValue :: falseValue
```

This is syntactic sugar that gets rewritten to a `ternary()` function call before evaluation. The double colon `::` is used instead of a single `:` because `:` is already reserved for directive syntax (MAP, SERIES, etc.).

### How It Works

When the expression parser encounters `? ... ::`, it rewrites the expression into a function call:

```
Height > Width ? Height :: Width
```

Becomes:

```
ternary((Height > Width), Height, Width)
```

The condition is automatically wrapped in parentheses to ensure correct precedence when combined with arithmetic. This means **you never need to worry about operator precedence** in ternary conditions -- it just works.

## Function Syntax

```
ternary(condition, onTrue)
ternary(condition, onTrue, onFalse)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `condition` | Any | required | Value to evaluate for truthiness |
| `onTrue` | Any | required | Value returned if condition is truthy |
| `onFalse` | Any | `""` | Value returned if condition is falsy |

## Returns

The `onTrue` value if `condition` is truthy, otherwise `onFalse`.

## Truthiness

The `ternary` function uses numeric-aware truthiness, designed to work correctly with comparison operators that return `"1"` and `"0"` as strings:

### Falsy values
- `false`, `null`, `undefined`, `NaN`
- `0` (numeric zero)
- `""` (empty string)
- `"0"` (string zero -- this is the key difference from `when`)
- `[]` (empty array)
- `{}` (empty object)

### Truthy values
- `"1"` or any non-zero number/string
- Any non-empty string (except `"0"`)
- Any non-empty array or object

## Examples

### Basic Ternary

```expression
Result = 5 > 3 ? 100 :: 200
// 5 > 3 evaluates to "1" (truthy)
// Result: "100"

Result = 3 > 5 ? 100 :: 200
// 3 > 5 evaluates to "0" (falsy)
// Result: "200"
```

### With Variables

```expression
Winner = Height > Width ? Height :: Width
// With data: { Height: 10, Width: 5 }
// 10 > 5 evaluates to "1" (truthy)
// Result: "10"
```

### Arithmetic in Branches

```expression
Result = A > B ? A + 1 :: B + 1
// With data: { A: 10, B: 5 }
// A > B is truthy, so A + 1 = 11
// Result: "11"
```

### Arithmetic in Condition

```expression
Result = 2 + 3 > 1 + 2 ? 100 :: 200
// (2 + 3) > (1 + 2) => 5 > 3 => "1" (truthy)
// Result: "100"
```

### With Assignment

```expression
SomeValue = Height > Width ? A :: B
// With data: { Height: 10, Width: 5, A: 42, B: 99 }
// Height > Width is truthy, selects A
// SomeValue: "42"
```

### Equality Checks

```expression
Label = Score == 100 ? "Perfect" :: "Keep trying"
// With data: { Score: 100 }
// Result: "Perfect"
```

### Nested Ternary

Use parentheses to nest ternary expressions:

```expression
Grade = Score >= 90 ? "A" :: (Score >= 80 ? "B" :: (Score >= 70 ? "C" :: "F"))
// With data: { Score: 85 }
// Score >= 90 is false, check inner: Score >= 80 is true
// Result: "B"
```

### Inside MAP Expressions

```expression
Labels = MAP VAR x FROM Values : x > 0 ? "positive" :: "non-positive"
// With data: { Values: [5, -3, 0, 10] }
// Result: ["positive", "non-positive", "non-positive", "positive"]
```

## Comparison with `if` and `when`

| Feature | `ternary` / `? ::` | `if()` | `when()` |
|---------|---------------------|--------|----------|
| Syntax style | Infix operator | Function call | Function call |
| Condition | Truthiness check | Explicit comparison | Truthiness check |
| `"0"` handling | Falsy | N/A (uses operators) | Truthy |
| Parameters | 2-3 | 5 | 2-3 |
| Best for | Inline conditionals | Comparing two values | Null/empty checking |

### When to use each

**Use `? ::`** for inline conditionals, especially with comparison operators:
```expression
Price = Quantity > 100 ? BulkPrice :: RetailPrice
```

**Use `if()`** when you need the comparison operator as a parameter (useful in MAP expressions with dynamic operators):
```expression
Result = If(Score, ">=", Threshold, "Pass", "Fail")
```

**Use `when()`** for simple existence/null checks where `"0"` should be truthy:
```expression
Name = When(UserName, UserName, "Anonymous")
```

## Notes

- The `::` separator must be used (not `:`) to avoid conflicts with directive syntax
- Comparison operators (`>`, `>=`, `<`, `<=`, `==`, `!=`) return `"1"` or `"0"`, which the ternary function interprets correctly
- The ternary operator desugaring happens before expression evaluation, so it works seamlessly with all other expression features
- Nested ternary expressions require parentheses around the inner ternary

## Related Functions

- [if](./if.md) - Conditional comparison with explicit operator
- [when](./when.md) - Truthy check (treats `"0"` as truthy)
