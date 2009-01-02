/**
 * @memberOf Js
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.config = {
	ext: {
		form: {
			errorNode: "span.form-error-message",
			beforeStart: null,
			success: null,
			onError: null
		}
	},
	test: {
		email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		url: /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/,
		ip: /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/,
		postcode: /^\d{5}$/
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
		message: {
			identifier: "#overlay-message",
			cssSuccess: "message-success",
			cssNote: "message-note",
			cssError: "message-error",
			seconds: 5
		},
		notice: {
			identifier: "#overlay-notice",
			cssSuccess: "notice-success",
			cssNote: "notice-note",
			cssError: "notice-error",
			seconds: 5,
			beforeStart: null,
			onClose: null
		},
		simpleTab: {
			handler: "click",
			identifier: ".simpletab",
			closable: "closable",
			disabled: "disabled",
			toolbar: "simpletab-toolbar",
			toolbarContainer: "simpletab-toolbar-container",
			container: "simple-container",
			cssHidden: "simpletab-hidden",
			cssActive: "simpletab-active",
			cssCurrent: "current"
		},
		tab: {
			handler: "click",
			identifier: ".tab",
			closable: "closable",
			disabled: "disabled",
			toolbar: "tab-toolbar",
			toolbarContainer: "tab-toolbar-container",
			container: "tab-container",
			cssHidden: "tab-hidden",
			cssActive: "tab-active",
			cssCurrent: "current",
			cssDisabled: "disabled"
		}
	}
};