Operators:
'+', '-', '*', '/' 
- Unless specified otherwise with brackets the operations are calculated in order of '/', '*', '-', '+' for and then from left to right (so 1/3/2=1/6)
- Attempt to divide by 0 at any point will result in a syntax error
- Multiple operators next to each other will result in a syntax error, with the exception of a single '-' indicating the beggining of a negative number will result in a syntax error (2+++2 - syntax error, but 3*-2=-6)

Recursion:
Recursion is enabled with the 'Recursive' button. User then needs to enter some non-zero number k of values for a(0,1,...,k-1). User then can add expressions in the form of a([expression]) where [expression] is a valid formula, resulting in a number from 0 to n-1 for any n in [0,...,upper bound].
- evaluating [expression] to a number outside of that range will result in syntax error.
- evaluating [expression] to a non-whole number will result in syntax error.

Functions:
Functions are called with :[name of function]:([expression1],[expression2],...). Functions implemented so far:
- gcd, gcc: accept any number of expressions each evaluating to a whole number. Any other input will result in a syntax error.