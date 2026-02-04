# matrixinverse

Calculates the inverse of a square matrix.

## Syntax

```
matrixinverse(matrix)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `matrix` | Array | Square matrix (n×n) |

## Returns

Array - The inverse matrix.

## Description

The `matrixinverse` function calculates the inverse of a square matrix. The inverse matrix A⁻¹ satisfies A × A⁻¹ = I (identity matrix).

## Examples

### Basic Usage

```expression
// Matrix: [[4, 7], [2, 6]]
Result = MATRIXINVERSE([[4, 7], [2, 6]])
// Result: [[0.6, -0.7], [-0.2, 0.4]]
```

### 3x3 Matrix

```expression
Matrix3x3 = [[1, 2, 3], [0, 1, 4], [5, 6, 0]]
Inverse = MATRIXINVERSE(Matrix3x3)
```

### Solving Equations

```expression
// Solve Ax = b  →  x = A⁻¹b
Solution = MATRIXVECTORMULTIPLY(MATRIXINVERSE(A), B)
```

## Use Cases

- **Solving linear systems**: Find solutions to Ax = b
- **Transformations**: Reverse transformations
- **Regression**: Part of least squares solution
- **Control systems**: System analysis

## Related Functions

- [matrixmultiply](./matrixmultiply.md) - Verify inverse
- [gaussianelimination](./gaussianelimination.md) - Alternative solver
- [matrixtranspose](./matrixtranspose.md) - Transpose matrix

## Notes

- Matrix must be square
- Matrix must be invertible (non-singular)
- Throws error for singular matrices
- Uses the Math service's `matrixInverse` method
