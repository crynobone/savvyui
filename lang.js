/**
 * @projectDescription Language configuration for Savvy.UI (English)
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.language = {
	ext: {
		validate: {
			string: "Require alphanumeric character input",
			number: "Require numberic input",
			email: "Require valid e-mail address input",
			required: "This input field is required",
			length: "This input field require {type} {value} character.",
			lengthExact: "exactly",
			lengthMinimum: "minimum",
			lengthMaximum: "maximum"
		}
	},
	util: {
		editable: {
			message: "Please enter a new option value...",
			title: "Editable Widget"
		}
	},
	widget: {
		datePicker: {
			selectMonthYear: "Jump to specific month and year",
			todayButton: "Select Today",
			days: ["S", "M", "T", "W", "T", "F", "S"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			shortMonths: ["Jan", "Feb", "Mac", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
		},
		notice: {
			titleSuccess: "Congratulation",
			titleNote: "Note",
			titleError: "Error has Occur",
			timer: "This message will automatically close in 5 seconds"
		}
	}
};
