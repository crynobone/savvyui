$(document).ready(function() {
	Js.widget.message.init();
	
	var note = function() {
		var texts = [
			"Welcome to my blog", 
			"Howdy there",
			"Looking for something?",
			"Drop a comment while you at it...", 
			"Hope you find the information here useful", 
			"Contact me if you have any enquiry", 
			"Do you have any freelance work for me?", 
			"I just love PHP and JavaScript, do you?",
			"My name is Mior Muhammad Zaki, what's yours?"
		];
		var i = Math.floor(Math.random() * texts.length); // now let display the selected text
		
		Js.widget.message.add({text: texts[i]});
	};
	setInterval(note, 2000);
	// give it 10 second interval delay
});