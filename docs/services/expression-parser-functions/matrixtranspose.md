# matrixtranspose

Transposes a matrix (swaps rows and columns).

## Syntax

```
matrixtranspose(matrix)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `matrix` | Array | 2D array representing the matrix |

## Returns

Array - The transposed matrix.

## Description

The `matrixtranspose` function swaps the rows and columns of a matrix. Element at position [i][j] moves to position [j][i].

## Examples

### Basic Usage

```expression
// Given matrix:
// [[1, 2, 3],
//  [4, 5, 6]]
Result = MATRIXTRANSPOSE([[1, 2, 3], [4, 5, 6]])
// Result:
// [[1, 4],
//  [2, 5],
//  [3, 6]]
```

### Square Matrix

```expression
Matrix = [[1, 2], [3, 4]]
Transposed = MATRIXTRANSPOSE(Matrix)
// Result: [[1, 3], [2, 4]]
```

### Data Orientation

```expression
// Convert row-oriented data to column-oriented
ColumnData = MATRIXTRANSPOSE(RowData)
```

## Use Cases

- **Linear algebra**: Matrix operations
- **Data transformation**: Row/column conversion
- **Statistical analysis**: Data orientation
- **Grid manipulation**: Rotate data structure

## Related Functions

- [matrixmultiply](./matrixmultiply.md) - Multiply matrices
- [matrixinverse](./matrixinverse.md) - Invert matrix
- [matrixvectormultiply](./matrixvectormultiply.md) - Matrix-vector multiplication

## Notes

- 2x3 matrix becomes 3x2 matrix
- Works with rectangular matrices
- Uses the Math service's `matrixTranspose` method
