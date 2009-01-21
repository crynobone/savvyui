/**
 * @projectDescription Language configuration for Savvy.UI
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
			lengthOption: {
				exact: "exactly",
				minimum: "minimum",
				maximum: "maximum"
			}
		}
	},
	widget: {
		datePicker: {
			selectMonthYear: "Jump to specific month and year",
			todayButton: "Select Today"
		},
		notice: {
			title: {
				success: "Congratulation",
				note: "Note",
				error: "Error has Occur"
			},
			timer: "This message will automatically close in 5 seconds"
		}
	}
};