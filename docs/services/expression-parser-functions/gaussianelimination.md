# gaussianelimination

Solves a system of linear equations using Gaussian elimination.

## Syntax

```
gaussianelimination(coefficientMatrix, constantVector)
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `coefficientMatrix` | Array | Matrix of coefficients (n×n) |
| `constantVector` | Array | Vector of constants (length n) |

## Returns

Array - Solution vector.

## Description

The `gaussianelimination` function solves a system of linear equations Ax = b using Gaussian elimination with back substitution.

## Examples

### Basic Usage

```expression
// Solve:
// 2x + y = 5
// x + 3y = 10

A = [[2, 1], [1, 3]]
b = [5, 10]
Solution = GAUSSIANELIMINATION(A, b)
// Result: [1, 3] meaning x=1, y=3
```

### 3x3 System

```expression
// Three equations with three unknowns
Coefficients = [[1, 2, 1], [2, 6, 1], [1, 1, 4]]
Constants = [2, 7, 3]
Solution = GAUSSIANELIMINATION(Coefficients, Constants)
```

### Engineering Problem

```expression
// Solve circuit/structure equations
Values = GAUSSIANELIMINATION(SystemMatrix, LoadVector)
```

## Use Cases

- **Engineering**: Structural analysis
- **Physics**: Equilibrium problems
- **Economics**: Input-output models
- **Optimization**: Constraint systems

## Related Functions

- [matrixinverse](./matrixinverse.md) - Alternative via inverse
- [matrixmultiply](./matrixmultiply.md) - Verify solutions
- [leastsquares](./leastsquares.md) - Overdetermined systems

## Notes

- Efficient for dense systems
- Handles n×n systems
- May have numerical precision limits
- Uses the Math service's `gaussianElimination` method
