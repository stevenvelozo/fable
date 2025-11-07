# Solver Directives

How the implementer of expressions can tell the expression parser to execute
the math.  By default it would do SOLVE and just solve the equation, but other
methods such as:

* Series
* Monte Carlo
* Newton
* Taylor
* Fibonacci
* Summation
* Geometric Series

## For now, IntegrationApproximation is the f

IntegrationApproximationResult = SERIES FROM 13.2 TO 25 STEP 0.2 : ( 1000 + (n / 2) ) ^ seriesStepIndex

MonteCarloResults = MONTECARLO WITH A BETWEEN 1000 AND 50000 AND B BETWEEN 20000 AND 20.321 ITERATIONS 50000 := 1000 + (A / B * 3)

IntegrationApproximationResult = SOLVE E 1000 + (n / 2)




1. Token parser doesn't need to change
2. Before Postfix, detect :