import Lexer from "./Lexer/Lexer"
import Parser from "./Parser/Parser"
const fs = require("fs")

const _fileExtension = 'mpl'
const fileName = 'code.mpl'

const filenameExtension = fileName
	.split('.')
	.filter(Boolean)
	.slice(1)
	.join('.')

if (filenameExtension !== _fileExtension) {
	throw new Error(`Расширение файла не соответствует ${_fileExtension}`)
} else {
	fs.readFile(`./src/${fileName}`, 'utf8', (error: string, code: string) => {
		if (error) {
			throw new Error(`Произошла ошибка при чтении файла: ${error}`)
		}
		const lexer = new Lexer(code)
		lexer.lexAnalysis()

		const parser = new Parser(lexer.tokenList)

		const rootNode = parser.parseCode()

		parser.runCode(rootNode)
	})
}

