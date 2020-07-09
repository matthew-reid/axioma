function tokensToRegex(tokens) {
	return new RegExp("(?:" + tokens.join("|") + ")");
}

allKeywords = [	"object", "property", "alias", "relationType", "hasProperty", "hasAlias"];

CodeMirror.defineSimpleMode("axioma", {
	start: [
		{regex: tokensToRegex(allKeywords), token: "keyword"},
		{regex: /#.*/, token: "comment"}
	],
	meta: {
		dontIndentStates: ["comment"],
		lineComment: "#"
	}
});

// Register an array of completion words for this mode
CodeMirror.registerHelper("hintWords", "axioma",
                          allKeywords);

var editor = CodeMirror.fromTextArea(document.getElementById('modelDefinitionInput'), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    autoCloseTags: true,
	mode: "axioma",
    extraKeys: {"'`'": "autocomplete"}
});
