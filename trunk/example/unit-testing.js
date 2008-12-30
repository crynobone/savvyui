/**
 * @author crynobone
 */
Js.util.Assert = {
	config: {
		appendTo: "#result",
		element: "<p/>"
	},
	echo: function(data) {
		return jQuery(this.config.element).text(data).appendTo(this.config.appendTo);
	},
	isTrue: function(data, expected, comment){
		var result = false;
		if (Jrun.isset(expected)) {
			if (data == expected) {
				result = true;
			}
		}
		else {
			if (Jrun.isset(data)) {
				result = true;
			}
		}
		
		if (Jrun.isset(comment)) {
			if (!!result) {
				this.echo(comment).css({
					"backgroundColor": "green",
					"color": "white",
					"padding": "8px 3px",
					"fontWeight": "bold"
				});
			}
			else {
				this.echo(comment).css({
					"backgroundColor": "red",
					"padding": "8px 3px",
					"color": "white",
					"fontWeight": "bold"
				});
			}
		}
		else {
			if (!!result) {
				this.echo("is true").css({
					"backgroundColor": "green",
					"padding": "8px 3px",
					"color": "white",
					"fontWeight": "bold"
				});
			}
			else {
				this.echo("is false").css({
					"backgroundColor": "red",
					"padding": "8px 3px",
					"color": "white",
					"fontWeight": "bold"
				});
			}
		}
	},
	isFalse: function(data, expected, comment){
		var result = false;
		if (Jrun.isset(expected)) {
			if (data == expected) {
				result = true;
			}
		}
		else {
			if (Jrun.isset(data)) {
				result = true;
			}
		}
		
		if (Jrun.isset(comment)) {
			if (!result) {
				this.echo(comment).css({
					"backgroundColor": "green",
					"color": "white",
					"padding": "8px 3px",
					"fontWeight": "bold"
				});
			}
			else {
				this.echo(comment).css({
					"backgroundColor": "red",
					"padding": "8px 3px",
					"color": "white",
					"fontWeight": "bold"
				});
			}
		}
		else {
			if (!result) {
				this.echo("is true").css({
					"backgroundColor": "green",
					"padding": "8px 3px",
					"color": "white",
					"fontWeight": "bold"
				});
			}
			else {
				this.echo("is false").css({
					"backgroundColor": "red",
					"padding": "8px 3px",
					"color": "white",
					"fontWeight": "bold"
				});
			}
		}
	}
};
