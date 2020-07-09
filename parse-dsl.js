var labelTypeStyles = {
	"object":"",
	"property": "fill: #fffdcf",
	"alias": "fill: #cfffdb"
};

function toLabelDisplayName(str) {
	return str.replace("_", " ");
}

function toRelationDisplayName(str) {
	// Convert camelCase to Camel Case
	// from https://stackoverflow.com/questions/4149276/how-to-convert-camelcase-to-camel-case
	return str.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); })
	// replace _ with space
	.replace("_", " ");
}

function modelStringToGraph(modelString) {
	console.log("Model to graph:\n" + modelString);
	var j = parser.parse(modelString);

	var g = new dagreD3.graphlib.Graph({multigraph: true});
	g.setGraph({});
	
	for (item of j) {
		// Create nodes from object definitions
		style = labelTypeStyles[item.type];
		if (style != undefined) {
			g.setNode(item.label, { label: toLabelDisplayName(item.label), style: style });
		}
		// Parse edges from relations
		else if (item.type == "relation") {
			var relationDisplayName = toRelationDisplayName(item.name);
			var edgeName = item.subject + "_" + item.name + "_" + item.other;
			g.setEdge(item.subject, item.other, {label : relationDisplayName}, edgeName);
		}
	}
	
	return g;
}