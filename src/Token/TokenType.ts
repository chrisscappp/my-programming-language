export default class TokenType {
	name: string; // имя типа токена (variable, assign, function и т.д. - ключевое слово)
	regex: string // регулярное выражение, для проверки содержимого строки на соответсвие какому-либо токену

	constructor(name: string, regex: string) {
		this.name = name
		this.regex = regex
	}
}

export const tokenTypeList = {
	'NUMBER': new TokenType('NUMBER', '[0-9]*'), // звёздочка - символов может повторятся несколько
	'VARIABLE': new TokenType('VARIABLE', '[а-я]*'),
	'ASSIGN': new TokenType('ASSIGN', 'РАВНО'),
	'SEMICOLON': new TokenType('SEMICOLON', ';'),
	'PLUS': new TokenType('PLUS', 'ПЛЮС'),
	'MINUS': new TokenType('MINUS', 'МИНУС'),
	'LOG': new TokenType('LOG', 'КОНСОЛЬ'),
	'LPAR': new TokenType('LPAR', '\\('),
	'RPAR': new TokenType('RPAR', '\\)'),
	'SPACE': new TokenType('SPACE', '[ \\n\\t\\r]'),
}