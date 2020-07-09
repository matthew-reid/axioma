var presetModels = {
	"Example #1":
`
property Color

object Car
object Engine
object Wheel

relationType object hasComponent object

Car hasComponent Engine
Car hasComponent Wheel

Car hasProperty Color
`,
	"Empty":
``,
};

var sel = document.getElementById('models');
	
for (const [key, value] of Object.entries(presetModels)) {

	var opt = document.createElement('option');
	opt.appendChild( document.createTextNode(key) );
	opt.value = value; 

	sel.appendChild(opt); 
}

function applySelection() {
    editor.getDoc().setValue(sel.options[sel.selectedIndex].value);
	updateGraph();
}

sel.addEventListener("change", function(){ 
	applySelection();
}); 

applySelection();