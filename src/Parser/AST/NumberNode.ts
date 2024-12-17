import Token from "../../Token/Token"
import ExpressionNode from "./ExpressionNode"

// нода для числа, присуще какой-либо переменной. хранит в себе соответствующий токен
export default class NumberNode extends ExpressionNode {
	number: Token;

	constructor(number: Token) {
		super()
		this.number = number
	}
}