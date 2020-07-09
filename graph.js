var errorMessageLabel = document.getElementById('errorMessageLabel');
	
var oldModelDefinitionInputValue;

// Set up zoom support
var svg = d3.select("svg"),
    inner = d3.select("svg g"),
    zoom = d3.zoom().on("zoom", function() {
      inner.attr("transform", d3.event.transform);
    });
svg.call(zoom);

// Create and configure the renderer
var render = dagreD3.render();

var errorMarkers = [];

function clearErrorMarkers(errorMarkers) {
	errorMarkers.forEach(marker => marker.clear());
}

var g;
function updateGraph() {
	console.log("updateGraph");

	editorDoc = editor.getDoc();
	modelDefinition = editorDoc.getValue();
	if (oldModelDefinitionInputValue !== modelDefinition) {
		oldModelDefinitionInputValue = modelDefinition;
		clearErrorMarkers(errorMarkers);
		errorMessageLabel.innerHTML = "";

    try {
      g = modelStringToGraph(modelDefinition);
    } catch (e) {
		console.log(e);
		errorMessageLabel.innerHTML = e.message + " at " + "line: " + e.location.start.line + ", column: " + e.location.start.column;

		let loc = e.location;

		let from = {line: loc.start.line-1, ch: loc.start.column-1 - (loc.start.offset === loc.end.offset)};
		let to = {line: loc.end.line-1, ch: loc.end.column-1};

		errorMarkers.push(editor.markText(from, to, {className: 'syntax-error', title: e.message}));
    }

	if (g != null) {
		// Set margins, if not present
		if (!g.graph().hasOwnProperty("marginx") &&
			!g.graph().hasOwnProperty("marginy")) {
		  g.graph().marginx = 20;
		  g.graph().marginy = 20;
		}

		g.graph().transition = function(selection) {
		  return selection.transition().duration(500);
		};

		// Render the graph into svg g
		d3.select("svg g").call(render, g);
	}
  }
}

editor.on("change", function(cm, change) { updateGraph(); })