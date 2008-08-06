SUI.Tool.include("Debugger", function() {
	SUI.fn.debug = true;
	var div = SUI.Query.create("div#sui-debugger");
	SUI.DOM.Add(div);
		
	var object = SUI.Query.create("ul");
	SUI.DOM.Add(div, object);
	SUI.CSS.Hide(object);
	SUI.fn.logobject = object;
	SUI.fn.logger = function(text) {
		var text = SUI.fn.trim(text);
		SUI.fn.logs.push(text);
		
		try {
			console.log(text);	
		} catch(e) { 
			// do nothing
		}
		var li = SUI.Query.create("li", SUI.fn.logobject);
		SUI.DOM.AddText(li, text);
		SUI.DOM.Add(object, li);
		
		if(!!SUI.Widget.Message) {
			SUI.Widget.Message.Add({text: text, type: "error"});	
		}
	};
});