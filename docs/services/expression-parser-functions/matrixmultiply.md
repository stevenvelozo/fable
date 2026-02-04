# matrixmultiply

Multiplies two matrices together.

## Syntax

```
matrixmultiply(matrix1, matrix2)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `matrix1` | Array | First matrix (m×n) |
| `matrix2` | Array | Second matrix (n×p) |

## Returns

Array - The resulting matrix (m×p).

## Description

The `matrixmultiply` function performs matrix multiplication of two matrices. The number of columns in the first matrix must equal the number of rows in the second matrix.

## Examples

### Basic Usage

```expression
// A = [[1, 2], [3, 4]]
// B = [[5, 6], [7, 8]]
Result = MATRIXMULTIPLY([[1, 2], [3, 4]], [[5, 6], [7, 8]])
// Result: [[19, 22], [43, 50]]
```

### Different Dimensions

```expression
// 2x3 matrix times 3x2 matrix
A = [[1, 2, 3], [4, 5, 6]]
B = [[7, 8], [9, 10], [11, 12]]
Result = MATRIXMULTIPLY(A, B)
// Result: 2x2 matrix
```

### Transformation

```expression
// Apply transformation matrix
Transformed = MATRIXMULTIPLY(TransformMatrix, DataMatrix)
```

## Use Cases

- **Linear algebra**: Matrix computations
- **Transformations**: Apply linear transforms
- **Systems of equations**: Solve matrix equations
- **Computer graphics**: Coordinate transformations

## Related Functions

- [matrixtranspose](./matrixtranspose.md) - Transpose matrix
- [matrixvectormultiply](./matrixvectormultiply.md) - Matrix-vector multiplication
- [matrixinverse](./matrixinverse.md) - Matrix inverse

## Notes

- Dimensions must be compatible (m×n × n×p = m×p)
- Not commutative (A×B ≠ B×A generally)
- Uses the Math service's `matrixMultiply` method
