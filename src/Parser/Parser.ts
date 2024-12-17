import TokenType, { tokenTypeList } from "../Token/TokenType"
import Token from "../Token/Token"
import ExpressionNode from "./AST/ExpressionNode"
import StatementsNode from "./AST/StatementsNode"
import NumberNode from "./AST/NumberNode"
import VariableNode from "./AST/VariableNode"
import BinOperationNode from "./AST/BinOperationNode"
import UnarOperationNode from "./AST/UnarOperation"

export default class Parser {
	tokens: Token[]; // список токенов
	pos: number = 0; // текущая позиция в списке токенов (индекс массива) при обработке конкретного токена
	scope: any = {}; // пара ключ - значение с названием переменной и её значением. сохраняем значения

	constructor(tokens: Token[]) {
		this.tokens = tokens
	}

	// функция по текущей позиции будет возвращать токен из списка, если такой имеется
	match(...expected: TokenType[]): Token | null {
		if (this.pos < this.tokens.length) {
			const currentToken = this.tokens[this.pos]
			// проверяем - если токен (или его ключевое слово) действительно является нашим ключевым словом, то...
			if (expected.find(type => currentToken.type.name === type.name)) {
				// возвращаем текущий токен и увеличиваем позицию на 1
				this.pos += 1
				return currentToken
			}
		}
		return null
	}

	// функция для проверки таких условий как: конец строки, левая + правая скобка в выражении
	// и другие обязательные условия, необходимые для корректной обработки конструкций языка
	// expected - будет содержать токен на текущей итерации. ожидаемый токен
	require(...expected: TokenType[]): Token {
		const token = this.match(...expected)
		if (!token) {
			throw new Error(`На позиции ${this.pos} ожидается ${expected[0].name}`)
		}
		return token
	}

	// функция для парсинга переменных и чисел. простейший случай формулы
	parseVariableOrNumber(): ExpressionNode {
		const number = this.match(tokenTypeList.NUMBER)
		if (number != null) {
			return new NumberNode(number)
		}
		const variable = this.match(tokenTypeList.VARIABLE)
		if (variable != null) {
			return new VariableNode(variable)
		}
		throw new Error(`Ожидается переменная или число на позиции ${this.pos}`)
	}

	// функция для парсинга скобок, либо просто числа или переменной
	parsePerentheses(): ExpressionNode {
		// если выражение начинается со скобки, смотрим что лежит внутри
		if (this.match(tokenTypeList.LPAR) != null) {
			const node = this.parseFormula()
			this.require(tokenTypeList.RPAR)
			return node
			// распарсили выражение в скобках и вернули его
		} else {
			// иначе у нас не скобки, а переменная или число
			return this.parseVariableOrNumber()
		}
		
	}

	// функция для парсинга формулы в выражении. учитывает как простые сценарии (1 + 2),
	// так и вложенные, по типу сумма + (разность - (3 + 4))
	parseFormula(): ExpressionNode {
		let leftNode = this.parsePerentheses()
		let operator = this.match(tokenTypeList.MINUS, tokenTypeList.PLUS)

		// пока в выражении есть операторы для считывания...
		while (operator != null) {
			// парсим вложенность левого операнда. затем перезаписываем его, и так до тех пор, 
			// пока у нас есть операторы в формуле. формула может быть вложенной
			const rightNode = this.parsePerentheses()
			leftNode = new BinOperationNode(operator, leftNode, rightNode)
			operator = this.match(tokenTypeList.MINUS, tokenTypeList.PLUS)
		}

		return leftNode
	}

	// функция вывода значения в консоль
	printNode(): ExpressionNode {
		const operatorLog = this.match(tokenTypeList.LOG)
		if (operatorLog != null) {
			// т.к. операнд может быть либо переменной, либо вложенностью, либо формулой...
			return new UnarOperationNode(operatorLog, this.parseFormula())
		}
		throw new Error(`Ожидается унарный оператор КОНСОЛЬ на позиции ${this.pos}`)
	}

	// функция для парсинга строк. начинается либо с названия переменной, либо со слова КОНСОЛЬ
	// т.к. мы ожидаем либо вывод, либо выражение, то обрабатываем эти два условия
	// возвращает либо ноду с выводом в консоль, либо ноду с выражением (1 + 2)
	parseExpression(): ExpressionNode {
		// если текущий токен не переменная, значит это слово КОНСОЛЬ
		if (this.match(tokenTypeList.VARIABLE) == null) {
			const printNode = this.printNode()
			return printNode
		}
		this.pos -= 1
		let variableNode = this.parseVariableOrNumber()
		const assignOperator = this.match(tokenTypeList.ASSIGN)

		if (assignOperator != null) {
			const rightFormulaNode = this.parseFormula()
			const binaryNode = new BinOperationNode(assignOperator, variableNode, rightFormulaNode)
			return binaryNode
		}

		throw new Error(`После объявления переменной ожидается оператор присваивания на позиции ${this.pos}`)
	}

	// функция, которая возвращает ноду, добавленную в AST дерево
	// каждая нода В ЭТОМ СЛУЧАЕ - это отдельно взятое выражение
	// отдельно взятое выражение - это поддерево. набор каких-либо нод AST дерева
	parseCode(): ExpressionNode {
		const root = new StatementsNode()

		while (this.pos < this.tokens.length) {
			// отдельно взятая строка кода (сумма РАВНО 5 ПЛЮС 1;)
			const codeStringNode = this.parseExpression()
			this.require(tokenTypeList.SEMICOLON)
			// после парсинга строки кода - добавили её в список нод, присуще строкам
			root.addNode(codeStringNode)
		}

		return root
	}

	// функция выполнения кода. обходит AST дерево и выполняет, строчку за строчкой
	runCode(node: ExpressionNode): any {
		if (node instanceof NumberNode) {
			return parseInt(node.number.text)
		}
		if (node instanceof UnarOperationNode) {
			// в нашем случае унарный оператор всего один
			switch (node.operator.type.name) {
				case tokenTypeList.LOG.name: {
					console.log(this.runCode(node.operand))
					return;
				}
			}
		}
		if (node instanceof BinOperationNode) {
			switch (node.operator.type.name) {
				case tokenTypeList.PLUS.name:
					return this.runCode(node.leftNode) + this.runCode(node.rightNode)
				case tokenTypeList.MINUS.name: 
					return this.runCode(node.leftNode) - this.runCode(node.rightNode)
				case tokenTypeList.ASSIGN.name: {
					const rightNodeResult = this.runCode(node.rightNode)
					const variableNodeResult = <VariableNode>node.leftNode
					this.scope[variableNodeResult.variable.text] = rightNodeResult
					return rightNodeResult
				}
			}
		}
		if (node instanceof VariableNode) {
			if (this.scope[node.variable.text]) {
				return this.scope[node.variable.text]
			} else {
				throw new Error(`Перменная с названием ${node.variable.text} не найдена`)
			}
		}
		if (node instanceof StatementsNode) {
			// рекурсивно выполняем выражение по нодам
			node.codeStrings.forEach(codeString => {
				this.runCode(codeString)
			})
			return
		}
		throw new Error('Произошла ошибка при выполнении программы...')
	}
}