# Math Service

The Math service provides arbitrary precision mathematical operations using `big.js` under the hood. All operations return string values to preserve precision.

## Access

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

// Auto-instantiated, available directly
console.log('fable.Math:', typeof fable.Math);
```

## Constants

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log('pi:',    fable.Math.pi);        // Pi to 100 decimal places
console.log('euler:', fable.Math.euler);     // Euler's number to 100 decimal places
```

## Rounding Methods

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log('roundDown:',     fable.Math.roundDown);     // 0 - Truncate toward zero
console.log('roundHalfUp:',   fable.Math.roundHalfUp);   // 1 - Round to nearest, ties away from zero
console.log('roundHalfEven:', fable.Math.roundHalfEven); // 2 - Round to nearest, ties to even
console.log('roundUp:',       fable.Math.roundUp);       // 3 - Always round away from zero
```

## Basic Operations

### Addition

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.addPrecise('1.5', '2.5'));  // Returns '4'
console.log(fable.Math.addPrecise(1.5, 2.5));      // Also works with numbers
```

### Subtraction

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.subtractPrecise('10', '3.5'));  // Returns '6.5'
```

### Multiplication

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.multiplyPrecise('2.5', '4'));  // Returns '10'
```

### Division

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.dividePrecise('10', '3'));  // Returns '3.33333...'
```

### Power

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.powerPrecise('2', '10'));  // Returns '1024'
```

### Modulo

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.modPrecise('10', '3'));  // Returns '1'
```

### Square Root

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.sqrtPrecise('16'));  // Returns '4'
```

### Absolute Value

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.absPrecise('-5.5'));  // Returns '5.5'
```

### Floor and Ceiling

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.floorPrecise('3.7'));  // Returns '3'
console.log(fable.Math.ceilPrecise('3.2'));   // Returns '4'
```

## Rounding and Formatting

### Round to Decimal Places

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.roundPrecise('3.14159', 2));  // Returns '3.14'
console.log(fable.Math.roundPrecise('3.14159', 2, fable.Math.roundUp));  // Returns '3.15'
```

### Fixed Decimal Places

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.toFixedPrecise('3.1', 4));  // Returns '3.1000'
```

## Comparison Operations

### Compare Values

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.comparePrecise('5', '3'));   // Returns 1 (left > right)
console.log(fable.Math.comparePrecise('3', '5'));   // Returns -1 (left < right)
console.log(fable.Math.comparePrecise('5', '5'));   // Returns 0 (equal)
```

### Compare Within Tolerance

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.comparePreciseWithin('1.0001', '1.0002', '0.001'));  // Returns 0 (within tolerance)
```

### Boolean Comparisons

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.gtPrecise('5', '3'));   // Returns true
console.log(fable.Math.gtePrecise('5', '5'));  // Returns true
console.log(fable.Math.ltPrecise('3', '5'));   // Returns true
console.log(fable.Math.ltePrecise('5', '5'));  // Returns true
```

## Parsing

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.parsePrecise('123.456'));           // Returns '123.456'
console.log(fable.Math.parsePrecise('invalid', '0'));      // Returns '0' (default value)
console.log(fable.Math.parsePrecise('not a number', null)); // Returns null
```

## Percentage

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.percentagePrecise('25', '100'));  // Returns '25' (25 is 25% of 100)
console.log(fable.Math.percentagePrecise('1', '4'));     // Returns '25' (1 is 25% of 4)
```

## Trigonometry

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.sin(Math.PI / 2));  // Returns 1
console.log(fable.Math.cos(0));            // Returns 1
console.log(fable.Math.tan(0));            // Returns 0
console.log(fable.Math.radPrecise('180')); // Converts degrees to radians
```

## Logarithms and Exponentials

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.logPrecise('100', 10));     // Returns log base 10 of 100
console.log(fable.Math.logPrecise('8', 2));        // Returns log base 2 of 8
console.log(fable.Math.expPrecise('2'));           // Returns e^2
```

## Statistical Functions (Sets)

### Count Elements

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.countSetElements([1, 2, 3, 4, 5]));  // Returns 5
console.log(fable.Math.countSetElements({a: 1, b: 2}));     // Returns 2
```

### Sum

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.sumPrecise([1, 2, 3, 4, 5]));  // Returns '15'
```

### Mean (Average)

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.meanPrecise([1, 2, 3, 4, 5]));     // Returns '3'
console.log(fable.Math.averagePrecise([1, 2, 3, 4, 5]));  // Same as meanPrecise
```

### Median

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.medianPrecise([1, 2, 3, 4, 5]));  // Returns '3'
console.log(fable.Math.medianPrecise([1, 2, 3, 4]));     // Returns '2.5'
```

### Mode

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.modePrecise([1, 2, 2, 3, 3, 3]));  // Returns ['3']
```

### Min/Max

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.minPrecise([5, 2, 8, 1, 9]));  // Returns '1'
console.log(fable.Math.maxPrecise([5, 2, 8, 1, 9]));  // Returns '9'
```

### Variance and Standard Deviation

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

// Sample variance (default)
console.log(fable.Math.variancePrecise([1, 2, 3, 4, 5]));

// Population variance
console.log(fable.Math.populationVariancePrecise([1, 2, 3, 4, 5]));

// Sample standard deviation
console.log(fable.Math.standardDeviationPrecise([1, 2, 3, 4, 5]));

// Population standard deviation
console.log(fable.Math.populationStandardDeviationPrecise([1, 2, 3, 4, 5]));
```

### Sorting

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.sortSetPrecise([3, 1, 4, 1, 5]));  // Returns ['1', '1', '3', '4', '5']
```

### Histogram

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

console.log(fable.Math.histogramPrecise([1, 2, 2, 3, 3, 3]));
// Returns { '1': 1, '2': 2, '3': 3 }

console.log(fable.Math.bucketSetPrecise([1, 2, 3, 4, 5, 6], 2));
// Bucketize by size 2
```

## Linear Algebra

### Matrix Operations

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

// Matrix transpose
console.log(fable.Math.matrixTranspose([[1, 2], [3, 4]]));

// Matrix multiplication
console.log(fable.Math.matrixMultiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]));

// Matrix inverse
console.log(fable.Math.matrixInverse([[1, 2], [3, 4]]));
```

### Regression

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

// Least squares regression
const coefficients = fable.Math.leastSquares(
    [1, 2, 3, 4, 5],     // X values
    [2, 4, 5, 4, 5]      // Y values
);
console.log('coefficients:', coefficients);

// Predict from regression model
console.log('prediction at x=6:', fable.Math.predictFromRegressionModel(coefficients, 6));

// Polynomial regression
const xValues = [1, 2, 3, 4, 5];
const yValues = [1, 4, 9, 16, 25];
const degree  = 2;
console.log('polynomial regression:', fable.Math.polynomialRegression(xValues, yValues, degree));
```

## Cumulative Operations

```javascript
const libFable = require('fable');
const fable = new libFable({ Product: 'MathDemo', ProductVersion: '1.0.0' });

const data = [
    { value: 10 },
    { value: 20 },
    { value: 30 }
];

// Cumulative summation
fable.Math.cumulativeSummation(data, 'value', 'cumulative');
// Adds 'cumulative' property: 10, 30, 60
console.log('After cumulativeSummation:', data);

// Subtracting summation (starting from a value)
fable.Math.subtractingSummation(data, 'value', 'remaining', '100');
// Subtracts from 100: 90, 70, 40
console.log('After subtractingSummation:', data);
```
