import Token from "../../Token/Token"
import ExpressionNode from "./ExpressionNode"

// нода для бинарных операций. хранит в себе оператор, левый операнд и правый операнд
export default class BinOperationNode extends ExpressionNode {
  operator: Token; // + или -
  leftNode: ExpressionNode; // левый операнд в выражении
  rightNode: ExpressionNode; // правый операнд в выражении

  // типы операндов могут быть разными. либо NUMBER, либо VARIABLE. это необходимо учитывать

  constructor(operator: Token, leftNode: ExpressionNode, rightNode: ExpressionNode) {
    super();
    this.operator = operator
	this.leftNode = leftNode
	this.rightNode = rightNode
  }
}