import ExpressionNode from "./ExpressionNode"

// самый корневой узел AST дерева. будет хранить в себе строки кода (сумма РАВНО 5 ПЛЮС 1;)
export default class StatementsNode extends ExpressionNode {
	codeStrings: ExpressionNode[] = [];

	// метод добавления узла (ноды) в список строк кода
	// каждая строчка будет парситься в ноду и добавлятся в массив
	addNode(node: ExpressionNode) {
		this.codeStrings.push(node)
	}
}