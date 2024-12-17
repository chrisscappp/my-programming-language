import Token from "../../Token/Token"
import ExpressionNode from "./ExpressionNode"

// нода для переменной. хранит в себе соответствующий токен с названием и значением
export default class VariableNode extends ExpressionNode {
	variable: Token;

	constructor(variable: Token) {
		super()
		this.variable = variable
	}
}