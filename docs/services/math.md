# Math Service

The Math service provides arbitrary precision mathematical operations using `big.js` under the hood. All operations return string values to preserve precision.

## Access

```javascript
// Auto-instantiated, available directly
fable.Math
```

## Constants

```javascript
fable.Math.pi        // Pi to 100 decimal places
fable.Math.euler     // Euler's number to 100 decimal places
```

## Rounding Methods

```javascript
fable.Math.roundDown     // 0 - Truncate toward zero
fable.Math.roundHalfUp   // 1 - Round to nearest, ties away from zero
fable.Math.roundHalfEven // 2 - Round to nearest, ties to even
fable.Math.roundUp       // 3 - Always round away from zero
```

## Basic Operations

### Addition

```javascript
fable.Math.addPrecise('1.5', '2.5');  // Returns '4'
fable.Math.addPrecise(1.5, 2.5);      // Also works with numbers
```

### Subtraction

```javascript
fable.Math.subtractPrecise('10', '3.5');  // Returns '6.5'
```

### Multiplication

```javascript
fable.Math.multiplyPrecise('2.5', '4');  // Returns '10'
```

### Division

```javascript
fable.Math.dividePrecise('10', '3');  // Returns '3.33333...'
```

### Power

```javascript
fable.Math.powerPrecise('2', '10');  // Returns '1024'
```

### Modulo

```javascript
fable.Math.modPrecise('10', '3');  // Returns '1'
```

### Square Root

```javascript
fable.Math.sqrtPrecise('16');  // Returns '4'
```

### Absolute Value

```javascript
fable.Math.absPrecise('-5.5');  // Returns '5.5'
```

### Floor and Ceiling

```javascript
fable.Math.floorPrecise('3.7');  // Returns '3'
fable.Math.ceilPrecise('3.2');   // Returns '4'
```

## Rounding and Formatting

### Round to Decimal Places

```javascript
fable.Math.roundPrecise('3.14159', 2);  // Returns '3.14'
fable.Math.roundPrecise('3.14159', 2, fable.Math.roundUp);  // Returns '3.15'
```

### Fixed Decimal Places

```javascript
fable.Math.toFixedPrecise('3.1', 4);  // Returns '3.1000'
```

## Comparison Operations

### Compare Values

```javascript
fable.Math.comparePrecise('5', '3');   // Returns 1 (left > right)
fable.Math.comparePrecise('3', '5');   // Returns -1 (left < right)
fable.Math.comparePrecise('5', '5');   // Returns 0 (equal)
```

### Compare Within Tolerance

```javascript
fable.Math.comparePreciseWithin('1.0001', '1.0002', '0.001');  // Returns 0 (within tolerance)
```

### Boolean Comparisons

```javascript
fable.Math.gtPrecise('5', '3');   // Returns true
fable.Math.gtePrecise('5', '5');  // Returns true
fable.Math.ltPrecise('3', '5');   // Returns true
fable.Math.ltePrecise('5', '5');  // Returns true
```

## Parsing

```javascript
fable.Math.parsePrecise('123.456');           // Returns '123.456'
fable.Math.parsePrecise('invalid', '0');      // Returns '0' (default value)
fable.Math.parsePrecise('not a number', null); // Returns null
```

## Percentage

```javascript
fable.Math.percentagePrecise('25', '100');  // Returns '25' (25 is 25% of 100)
fable.Math.percentagePrecise('1', '4');     // Returns '25' (1 is 25% of 4)
```

## Trigonometry

```javascript
fable.Math.sin(Math.PI / 2);  // Returns 1
fable.Math.cos(0);            // Returns 1
fable.Math.tan(0);            // Returns 0
fable.Math.radPrecise('180'); // Converts degrees to radians
```

## Logarithms and Exponentials

```javascript
fable.Math.logPrecise('100', 10);     // Returns log base 10 of 100
fable.Math.logPrecise('8', 2);        // Returns log base 2 of 8
fable.Math.expPrecise('2');           // Returns e^2
```

## Statistical Functions (Sets)

### Count Elements

```javascript
fable.Math.countSetElements([1, 2, 3, 4, 5]);  // Returns 5
fable.Math.countSetElements({a: 1, b: 2});     // Returns 2
```

### Sum

```javascript
fable.Math.sumPrecise([1, 2, 3, 4, 5]);  // Returns '15'
```

### Mean (Average)

```javascript
fable.Math.meanPrecise([1, 2, 3, 4, 5]);     // Returns '3'
fable.Math.averagePrecise([1, 2, 3, 4, 5]);  // Same as meanPrecise
```

### Median

```javascript
fable.Math.medianPrecise([1, 2, 3, 4, 5]);  // Returns '3'
fable.Math.medianPrecise([1, 2, 3, 4]);     // Returns '2.5'
```

### Mode

```javascript
fable.Math.modePrecise([1, 2, 2, 3, 3, 3]);  // Returns ['3']
```

### Min/Max

```javascript
fable.Math.minPrecise([5, 2, 8, 1, 9]);  // Returns '1'
fable.Math.maxPrecise([5, 2, 8, 1, 9]);  // Returns '9'
```

### Variance and Standard Deviation

```javascript
// Sample variance (default)
fable.Math.variancePrecise([1, 2, 3, 4, 5]);

// Population variance
fable.Math.populationVariancePrecise([1, 2, 3, 4, 5]);

// Sample standard deviation
fable.Math.standardDeviationPrecise([1, 2, 3, 4, 5]);

// Population standard deviation
fable.Math.populationStandardDeviationPrecise([1, 2, 3, 4, 5]);
```

### Sorting

```javascript
fable.Math.sortSetPrecise([3, 1, 4, 1, 5]);  // Returns ['1', '1', '3', '4', '5']
```

### Histogram

```javascript
fable.Math.histogramPrecise([1, 2, 2, 3, 3, 3]);
// Returns { '1': 1, '2': 2, '3': 3 }

fable.Math.bucketSetPrecise([1, 2, 3, 4, 5, 6], 2);
// Bucketize by size 2
```

## Linear Algebra

### Matrix Operations

```javascript
// Matrix transpose
fable.Math.matrixTranspose([[1, 2], [3, 4]]);

// Matrix multiplication
fable.Math.matrixMultiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]);

// Matrix inverse
fable.Math.matrixInverse([[1, 2], [3, 4]]);
```

### Regression

```javascript
// Least squares regression
const coefficients = fable.Math.leastSquares(
    [1, 2, 3, 4, 5],     // X values
    [2, 4, 5, 4, 5]      // Y values
);

// Predict from regression model
fable.Math.predictFromRegressionModel(coefficients, 6);

// Polynomial regression
fable.Math.polynomialRegression(xValues, yValues, degree);
```

## Cumulative Operations

```javascript
const data = [
    { value: 10 },
    { value: 20 },
    { value: 30 }
];

// Cumulative summation
fable.Math.cumulativeSummation(data, 'value', 'cumulative');
// Adds 'cumulative' property: 10, 30, 60

// Subtracting summation (starting from a value)
fable.Math.subtractingSummation(data, 'value', 'remaining', '100');
// Subtracts from 100: 90, 70, 40
```
