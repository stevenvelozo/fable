# matrixvectormultiply

Multiplies a matrix by a vector.

## Syntax

```
matrixvectormultiply(matrix, vector)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `matrix` | Array | 2D array representing the matrix (m×n) |
| `vector` | Array | 1D array representing the vector (length n) |

## Returns

Array - The resulting vector (length m).

## Description

The `matrixvectormultiply` function multiplies a matrix by a column vector. The vector length must equal the number of columns in the matrix.

## Examples

### Basic Usage

```expression
// Matrix: [[1, 2], [3, 4]]
// Vector: [5, 6]
Result = MATRIXVECTORMULTIPLY([[1, 2], [3, 4]], [5, 6])
// Result: [17, 39]
// [1*5 + 2*6, 3*5 + 4*6] = [17, 39]
```

### Transformation

```expression
// Apply transformation to point
NewPoint = MATRIXVECTORMULTIPLY(RotationMatrix, Point)
```

### Linear Combination

```expression
// Compute linear combination of basis vectors
Result = MATRIXVECTORMULTIPLY(BasisMatrix, Coefficients)
```

## Use Cases

- **Linear transformations**: Apply transforms to points
- **Solving equations**: Part of solving Ax = b
- **Graphics**: Coordinate transformations
- **Physics**: Linear operations

## Related Functions

- [matrixmultiply](./matrixmultiply.md) - Matrix-matrix multiplication
- [matrixtranspose](./matrixtranspose.md) - Transpose matrix
- [matrixinverse](./matrixinverse.md) - Matrix inverse

## Notes

- Vector treated as column vector
- Vector length must match matrix columns
- Uses the Math service's `matrixVectorMultiply` method
