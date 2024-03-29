Js.config = {
	ext: {
		validate: {
			errorNode: 'span.form-error-message',
			beforeStart: null,
			success: null,
			onError: null,
			auto: true
		}
	},
	
	test: {
		email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		url: /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/,
		ip: /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/,
		username: /^([a-zA-Z0-9_\.\-\+])$/,
		postcode: /^\d{5}$/
	},
	
	util: {
		formSubmit: {
			method: 'POST',
			beforeStart: null,
			beforeSend: null,
			formSuccess: null,
			sendSuccess: null,
			onError: null,
			onSendError: null
		},
		
		buttonSubmit: {
			method: 'POST',
			beforeStart: null,
			beforeSend: null,
			formSuccess: null,
			sendSuccess: null,
			onError: null,
			onSendError: null
		},
		
		editable: {
			identifier: 'Other',
			prefix: '',
			beforeStart: null,
			onBeforeUpdate: null,
			onUpdate: null,
			overlay: true
		}
	},
	
	widget: {
		activity: {
			imagePath: 'images/',
			boxWidth: 200,
			boxHeight: 20,
			identifier: '.widget-activity',
			opacity: 0.3,
			background: '#fff',
			zIndex: 5000
		},
		
		datePicker: {
			daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			dateFormat: /^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/,
			onUpdate: null,
			navigation: true,
			fieldType: 'hidden',
			beforeStart: null
		},
		
		dropmenu: {
			speed: 250,
			zIndex: 100,
			css: 'widget-dropmenu'
		},
		
		iconizer: {
			fileType: 'png',
			folder: 'icons/'
		},
		
		message: {
			identifier: '#overlay-message',
			cssSuccess: 'message-success',
			cssNote: 'message-note',
			cssError: 'message-error',
			seconds: 5
		},
		
		notice: {
			cssSuccess: 'notice-success',
			cssNote: 'notice-note',
			cssError: 'notice-error',
			seconds: 5,
			beforeStart: null,
			onClose: null
		},
		
		panel: {
			title: 'Untitled',
			width: null,
			height: null,
			content: '',
			onClose: null,
			closable: true,
			header: true,
			overlay: true,
			clickOver: false,
			onClickOver: null 
		},
		
		tab: {
			handler: 'click',
			identifier: '.tab',
			closable: 'closable',
			disabled: 'disabled',
			toolbar: 'tab-toolbar',
			toolbarContainer: 'tab-toolbar-container',
			container: 'tab-container',
			cssHidden: 'tab-hidden',
			cssActive: 'tab-active',
			cssCurrent: 'current',
			cssDisabled: 'disabled',
			fx: true,
			header: ''
		}
	}
};
