import Token from "../../Token/Token"
import ExpressionNode from "./ExpressionNode"

// нода для унарных операций (в нашем случае вывод в консоль). хранит в себе токен операции и ноду, выводящуюся в консоль
export default class UnarOperationNode extends ExpressionNode {
	operator: Token;
	operand: ExpressionNode;

	constructor(operator: Token, operand: ExpressionNode) {
		super()
		this.operator = operator
		this.operand = operand
	}
}