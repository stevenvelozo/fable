# ExpressionParser Functions Reference

This directory contains documentation for all functions available in the Fable ExpressionParser service.

## Function Categories

### Mathematical Functions

Basic math operations with arbitrary precision:

- [sqrt](./sqrt.md) - Square root
- [abs](./abs.md) - Absolute value
- [floor](./floor.md) - Floor value
- [ceil](./ceil.md) - Ceiling value
- [round](./round.md) - Round to decimal places
- [tofixed](./tofixed.md) - Format to fixed decimal places
- [percent](./percent.md) - Compute percentage
- [compare](./compare.md) - Compare two values

### Constants

- [pi](./pi.md) - Pi constant (π)
- [euler](./euler.md) - Euler's number (e)

### Trigonometry

- [sin](./sin.md) - Sine
- [cos](./cos.md) - Cosine
- [tan](./tan.md) - Tangent
- [rad](./rad.md) - Convert degrees to radians

### Logarithms and Exponentials

- [log](./log.md) - Logarithm
- [exp](./exp.md) - Euler's number raised to power

### Statistical Functions

- [sum](./sum.md) - Sum of values
- [avg](./avg.md) / [mean](./mean.md) - Average/Mean
- [median](./median.md) - Median value
- [mode](./mode.md) - Mode (most frequent)
- [min](./min.md) - Minimum value
- [max](./max.md) - Maximum value
- [count](./count.md) / [countset](./countset.md) - Count elements
- [var](./var.md) / [vara](./vara.md) - Sample variance
- [varp](./varp.md) - Population variance
- [stdev](./stdev.md) / [stdeva](./stdeva.md) - Sample standard deviation
- [stdevp](./stdevp.md) - Population standard deviation

### Set Operations

- [sortset](./sortset.md) - Sort a set
- [bucketset](./bucketset.md) - Bucket values
- [sorthistogram](./sorthistogram.md) - Sort histogram
- [sorthistogrambykeys](./sorthistogrambykeys.md) - Sort histogram by keys
- [entryinset](./entryinset.md) - Get entry from set by index
- [smallestinset](./smallestinset.md) - Get smallest entry
- [largestinset](./largestinset.md) - Get largest entry
- [setconcatenate](./setconcatenate.md) - Concatenate sets

### Cumulative Operations

- [cumulativesummation](./cumulativesummation.md) - Cumulative sum
- [subtractingsummation](./subtractingsummation.md) - Subtracting sum
- [iterativeseries](./iterativeseries.md) - Iterative series operations

### Histogram Functions

- [aggregationhistogram](./aggregationhistogram.md) - Aggregate by exact value
- [aggregationhistogrambyobject](./aggregationhistogrambyobject.md) - Aggregate from object
- [distributionhistogram](./distributionhistogram.md) - Distribution histogram
- [distributionhistogrambyobject](./distributionhistogrambyobject.md) - Distribution from object

### Array/Object Utilities

- [objectkeystoarray](./objectkeystoarray.md) - Get object keys as array
- [objectvaluestoarray](./objectvaluestoarray.md) - Get object values as array
- [createarrayfromabsolutevalues](./createarrayfromabsolutevalues.md) - Create array from values
- [flatten](./flatten.md) - Flatten nested arrays
- [slice](./slice.md) - Slice array
- [arrayconcat](./arrayconcat.md) - Concatenate arrays

### Value Access

- [getvalue](./getvalue.md) - Get value from application state
- [getvaluearray](./getvaluearray.md) - Get array of values
- [getvalueobject](./getvalueobject.md) - Get value object
- [createvalueobjectbyhashes](./createvalueobjectbyhashes.md) - Create object from hashes
- [cleanvaluearray](./cleanvaluearray.md) - Clean value array
- [cleanvalueobject](./cleanvalueobject.md) - Clean value object

### Search Functions

- [findfirstvaluebyexactmatch](./findfirstvaluebyexactmatch.md) - Find by exact match
- [findfirstvaluebystringincludes](./findfirstvaluebystringincludes.md) - Find by string includes
- [match](./match.md) - MATCH function (like spreadsheets)

### String Functions

- [concat](./concat.md) - Concatenate strings
- [concatraw](./concatraw.md) - Concatenate raw values
- [join](./join.md) - Join strings with separator
- [joinraw](./joinraw.md) - Join raw values
- [resolvehtmlentities](./resolvehtmlentities.md) - Resolve HTML entities
- [stringcountsegments](./stringcountsegments.md) - Count string segments
- [stringgetsegments](./stringgetsegments.md) - Get string segments

### Conditional Functions

- [if](./if.md) - Conditional comparison
- [when](./when.md) - Truthy check

### Date Functions

- [datefromparts](./datefromparts.md) - Create date from parts
- [datemilliseconddifference](./datemilliseconddifference.md) - Millisecond difference
- [dateseconddifference](./dateseconddifference.md) - Second difference
- [dateminutedifference](./dateminutedifference.md) - Minute difference
- [datehourdifference](./datehourdifference.md) - Hour difference
- [datedaydifference](./datedaydifference.md) - Day difference
- [dateweekdifference](./dateweekdifference.md) - Week difference
- [datemonthdifference](./datemonthdifference.md) - Month difference
- [dateyeardifference](./dateyeardifference.md) - Year difference
- [datemathadd](./datemathadd.md) - Generic date math
- [dateaddmilliseconds](./dateaddmilliseconds.md) - Add milliseconds
- [dateaddseconds](./dateaddseconds.md) - Add seconds
- [dateaddminutes](./dateaddminutes.md) - Add minutes
- [dateaddhours](./dateaddhours.md) - Add hours
- [dateadddays](./dateadddays.md) - Add days
- [dateaddweeks](./dateaddweeks.md) - Add weeks
- [dateaddmonths](./dateaddmonths.md) - Add months
- [dateaddyears](./dateaddyears.md) - Add years

### Random Data Generation

- [randominteger](./randominteger.md) - Random integer
- [randomintegerbetween](./randomintegerbetween.md) - Random integer in range
- [randomintegerupto](./randomintegerupto.md) - Random integer up to max
- [randomfloat](./randomfloat.md) - Random float
- [randomfloatbetween](./randomfloatbetween.md) - Random float in range
- [randomfloatupto](./randomfloatupto.md) - Random float up to max

### Regression and Matrix Functions

- [polynomialregression](./polynomialregression.md) - Polynomial regression
- [leastsquares](./leastsquares.md) / [linest](./linest.md) - Least squares regression
- [predict](./predict.md) - Predict from regression model
- [matrixtranspose](./matrixtranspose.md) - Transpose matrix
- [matrixmultiply](./matrixmultiply.md) - Multiply matrices
- [matrixvectormultiply](./matrixvectormultiply.md) - Multiply matrix by vector
- [matrixinverse](./matrixinverse.md) - Inverse matrix
- [gaussianelimination](./gaussianelimination.md) - Gaussian elimination

### Other Utilities

- [generatearrayofobjectsfromsets](./generatearrayofobjectsfromsets.md) - Generate objects from sets
- [objectvaluessortbyexternalobjectarray](./objectvaluessortbyexternalobjectarray.md) - Sort by external array

## Expression Syntax

Functions are called using parentheses:

```
Result = functionname(arg1, arg2, ...)
```

Variables are referenced by name:

```
Result = X * Y + sqrt(Z)
```

Quoted strings are supported:

```
Result = concat("Hello ", Name)
```
