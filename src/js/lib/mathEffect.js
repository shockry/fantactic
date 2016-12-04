export function doOperation(operator, operand1, operand2) {
  const ops = {'-': subtract, '+': add};
  return ops[operator](operand1, operand2);
}

function subtract(operand1, operand2) {
  return operand1 - operand2;
}

function add(operand1, operand2) {
  return operand1 + operand2;
}
