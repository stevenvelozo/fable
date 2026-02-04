# bucketset

Groups values into buckets based on specified boundaries.

## Syntax

```
bucketset(values, buckets)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | Array | Array of numeric values to bucket |
| `buckets` | Array | Array of bucket boundaries |

## Returns

Object - Histogram with bucket ranges as keys and counts as values.

## Description

The `bucketset` function groups numeric values into buckets (ranges) based on specified boundaries. This is useful for creating histograms of continuous data.

## Examples

### Basic Usage

```expression
// Group scores into ranges
Scores = [45, 62, 78, 85, 92, 55, 73, 88]
Buckets = BUCKETSET(Scores, [0, 50, 70, 90, 100])
// Result: { '0-50': 1, '50-70': 2, '70-90': 3, '90-100': 2 }
```

### Age Groups

```expression
Ages = [25, 32, 45, 18, 67, 55, 42, 29]
AgeGroups = BUCKETSET(Ages, [0, 18, 30, 50, 65, 100])
// Groups: Under 18, 18-30, 30-50, 50-65, 65+
```

### Price Ranges

```expression
Prices = FLATTEN(AppData.Products.price)
PriceRanges = BUCKETSET(Prices, [0, 25, 50, 100, 500])
```

## Use Cases

- **Analytics**: Group continuous data into ranges
- **Reporting**: Create distribution charts
- **Demographics**: Age/income brackets
- **Grading**: Score ranges

## Related Functions

- [distributionhistogram](./distributionhistogram.md) - Count by exact values
- [sorthistogram](./sorthistogram.md) - Sort bucketed results
- [count](./count.md) - Simple count

## Notes

- Bucket boundaries define range edges
- Values fall into the appropriate range
- Uses the Math service's `bucketSet` method
