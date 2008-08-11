Js.tool.include("Debugger", function() {
	Js.code.debug = true;
	var div = Js.query.create("div#sui-debugger");
	Js.dom.add(div);
		
	var object = Js.query.create("ul");
	Js.dom.add(div, object);
	Js.style.hide(object);
	
	Js.debug.object = object;
	Js.debug.log = function(text) {
		var text = Js.code.trim(text);
		Js.debug.message[Js.debug.message.length] = text;
		
		try {
			console.log(text);	
		} catch(e) { /* do nothing */ }
		
		var li = Js.query.create("li", Js.debug.object);
		Js.dom.addText(li, text);
		
		if(!!Js.widget.loaded("message")) {
			Js.widget.message.add({text: text, type: "error"});	
		}
	};
});