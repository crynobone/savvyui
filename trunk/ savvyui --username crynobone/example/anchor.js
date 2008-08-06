var inpage_selector = SUI.Util.Anchor.extend({
	init: function(i) {
		if(i[0] == 'alert') {
			this.getContent(i[1]);
		}
	},
	getContent: function(i) {
		var v = "";
		if(i == "ajax") {
			new SUI.Ajax({
				method: "GET",
				uri: "anchor.json"
			});
		} else {
			$$("#content").html("You have clicked on the Example 1, or you have loaded #alert page");
		}	
	}
});
var inpage_interval = SUI.Util.Anchor.extend({
	init: function(i) {
		if(i[0] == 'hello') {
			SUI("#content").html("A alert saying 'Hello world' should be shown right now");
			alert('Hello world');
			
		}
	}
});
var a = new inpage_selector('body a');
var i = new inpage_interval();