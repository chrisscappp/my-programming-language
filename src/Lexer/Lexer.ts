import Token from "../Token/Token"
import { tokenTypeList } from "../Token/TokenType"

export default class Lexer {
	code: string;
	pos: number = 0;
	tokenList: Token[] = []

	constructor(code: string) {
		this.code = code
	}

	// функция возвращает список токенов для кода
	lexAnalysis(): Token[] {
		while (this.nextToken()) {}
		// фильтруем список токенов от пробелов, переносов строк, табов. в АСТ дереве они не нужны
		this.tokenList = this.tokenList.filter(token => token.type.name !== tokenTypeList.SPACE.name)
		return this.tokenList
	}

	// функция добавляет к списку токенов новый, если такая возможность есть
	nextToken(): boolean {
		if (this.pos >= this.code.length) {
			return false
			// если больше нечего считывать
		}

		const tokenTypesValues = Object.values(tokenTypeList)

		for (let i = 0; i < tokenTypesValues.length; i++) {
			const tokenType = tokenTypesValues[i]
			const tokenRegex = new RegExp('^' + tokenType.regex)
			const result = this.code.substring(this.pos).match(tokenRegex)
			if (result && result[0]) {
				const token = new Token(tokenType, result[0], this.pos)
				this.pos += result[0].length
				this.tokenList.push(token)
				return true
			}
		}
		throw new Error(`На позиции ${this.pos} допущена лексическая ошибка!`)
	}
}