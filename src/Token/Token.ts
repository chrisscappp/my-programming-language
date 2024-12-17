import TokenType from "./TokenType"

export default class Token {
	type: TokenType; // тип токена (переменная, функция, знак, пробел, символ конца строки)
	text: string; // содержимое переменной (число, строка, другая переменная)
	pos: number; // позиция старта этого токена в коде (например, начало строки, или середина)

	constructor(type: TokenType, text: string, pos: number) {
		this.type = type
		this.text = text
		this.pos = pos
	}
}