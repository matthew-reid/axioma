
// Test interactivly at https://pegjs.org/online
var parser = PEG.buildParser(`
{
	var objectTypes = [ "object", "property", "alias" ];
    var relationTypes = {
		"hasProperty": {"subjectType": "object", "otherType": "property"},
		"hasAlias": {"subjectType": "object", "otherType": "alias"}
    };
	
	var objects = {};
	var objectAliases = {};
}

main = (objectDeclaration/relationDeclaration/relation/comment)*

objectDeclaration = optionalWhitespace kw:keyword whitespaceSameLine label:label optionalWhitespace {
	if (objects[kw] == undefined) {
    	objects[kw] = [];
    }
    objects[kw].push(label);
	return {"type":kw, "label":label};
}

relationDeclaration = optionalWhitespace "relationType" whitespaceSameLine label1:label whitespaceSameLine relationName:label whitespaceSameLine label2:label optionalWhitespace {
	if (!objectTypes.includes(label1)) {
    	error("unknown object type '" + label1 + "'");
    }
	if (!objectTypes.includes(label2)) {
    	error("unknown object type '" + label2 + "'");
    }
    relationTypes[relationName] = {"subjectType": label1, "otherType": label2};
	return {"type": "relationType", "name": relationName};
}

relation = optionalWhitespace label1:label whitespaceSameLine relationName:label whitespaceSameLine label2:label optionalWhitespace {
	// Validate relation
	var relationType = relationTypes[relationName];
    if (relationType == undefined) {
    	error("unknown relation '" + relationName + "'");
    }
    
    var subjectType = relationTypes[relationName].subjectType;
	var otherType = relationTypes[relationName].otherType;
    
    // Dereference aliases
	if (subjectType == "object") {
		var dereferencedLabel1 = objectAliases[label1];
        
		if (dereferencedLabel1 != undefined) {
			label1 = dereferencedLabel1;
		}
	}
	
	if (otherType == "object") {
		var dereferencedLabel2 = objectAliases[label2];
		if (dereferencedLabel2 != undefined) {
			label2 = dereferencedLabel2;
		}
	}
    
    // Validate label
    var subjects = objects[subjectType];
    if (subjects == undefined || !subjects.includes(label1)) {
    	error("unknown " + subjectType + " '" + label1 + "'");
    }
    
    var others = objects[otherType];
    if (others == undefined || !objects[otherType].includes(label2)) {
    	error("unknown " + otherType + " '" + label2 + "'");
    }
	
	if (relationName == "hasAlias") {
		if (objectAliases[label2] != undefined) {
			error("multiple objects can not have the same alias '" + label2 + "'");
		}
		objectAliases[label2] = label1;
	}
    
	return {"type":"relation", "name":relationName, "subject":label1, "other":label2};
}

comment = optionalWhitespace "#" comment:([^\\n]*) optionalWhitespace { return {"type":"comment", "value":comment.join("") }; }

keyword = "object"/"property"/"alias"/"set"
relationKeywords = "hasMember"/"hasProperty"/"hasAlias"/"hasComponent"

label = word { return text(); }

word = letterOrUnderscore+
letterOrUnderscore = letter/"_"
letter = [a-zA-Z0-9]

listSep = "," optionalWhitespace

optionalWhitespace = [ \\t\\r\\n]*

whitespaceSameLine = [ \\t]+
`);
