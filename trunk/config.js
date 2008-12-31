/**
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.config = {
	test: {
		email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		url: /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/,
		ip: /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/
	},
	util: {
		formSubmit: {
			method: "POST",
			beforeStart: null,
			beforeSend: null,
			success: null
		},
		buttonSubmit: {
			method: "POST",
			beforeStart: null,
			beforeSend: null,
			success: null
		}
	},
	widget: {
		activity: {
			imagePath: "images/",
			boxWidth: 200,
			boxHeight: 20,
			identifier: "widget-activity",
			opacity: 0.6,
			background: "#fff",
			zIndex: 5000
		},
		calendar: {
			navigation: true,
			fieldType: "hidden",
			onUpdate: null,
			beforeStart: null
		},
		iconizer: {
			fileType: "png",
			folder: "icons/"
		},
		notice: {
			overlay: "#overlay-notice",
			cssSuccess: "message-success",
			cssNote: "message-note",
			cssError: "message-error",
			seconds: 5,
			beforeStart: null,
			onClose: null
		},
		simpleTab: {
			handler: "click",
			identifier: "simpletab",
			closable: "closable",
			disabled: "disabled",
			toolbar: "simpletab-toolbar",
			toolbarContainer: "simpletab-toolbar-container",
			container: "simple-container",
			hidden: "simpletab-hidden",
			active: "simpletab-active",
			currentHeader: "current"
		}
	}
};