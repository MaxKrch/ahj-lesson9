export default class Toggler {
	constructor(container) {
		this.container = document.querySelector(container)
		
		this.page;

		this.chat = {
			form: null,
			textarea: null,
			name: null,
		}
		
		this.ui = {
			toggler: null,
			close: null,
			submit: null,
		}
		
		this.message = {
			success: null,
			error: null,
		}

		this.eventListeners = {
			page: {
				click: null,
			},
			togglerBtn: {
				click: null,
			},
			closeBtn: {
				click: null,
			},
			submitBtn: {
				click: null,
			},
			textarea: {
				keypress: null,
			},
			form: {
				transitionend: null,
				transitioncancel: null,
				submit: null,
			}
		}

		this.state = {
			chat: false,
			success: false,
			error: false,
			toggler: true,
			idError: null,
			idSuccess: null,
		}

		this.init();
	}

	init() {
		this.parseElements();
		this.saveEventsListeners();
		this.registerEvents();
	}

	parseElements() {
		this.parserChatEls();
		this.parserUIEls();
		this.parserMessElms();
		this.page = this.container.closest('section.section-container')
	}

	parserChatEls() {
		this.chat.form = this.container.querySelector('[data-chat="form"]')
		this.chat.textarea = this.container.querySelector('[data-chat="text"]')
		this.chat.name = this.container.querySelector('[data-chat="name"]')
	}

	parserUIEls() {
		this.ui.toggler = this.container.querySelector('[data-ui="toggler"]')
		this.ui.close = this.container.querySelector('[data-ui="close"]')
		this.ui.submit = this.container.querySelector('[data-ui="submit"]')
	}

	parserMessElms() {
		this.message.success = this.container.querySelector('[data-mess="success"]')
		this.message.error = this.container.querySelector('[data-mess="error"]')
	}

	saveEventsListeners() {
		this.eventListeners.togglerBtn.click = this.byClickShowChat.bind(this);
		this.eventListeners.closeBtn.click = this.byClickHideChat.bind(this);
		this.eventListeners.submitBtn.click = this.byClickSubmitBtn.bind(this);

		this.eventListeners.form.submit = this.bySubmitForm.bind(this);
		this.eventListeners.form.transitionend = this.byTransitionEndChat.bind(this);
		this.eventListeners.form.transitioncancel = this.byTrsnsitionCancelChat.bind(this);

		this.eventListeners.textarea.keypress = this.byKeyPressTextarea.bind(this);

		this.eventListeners.page.click = this.byClickOuterSpace.bind(this);
	}

	registerEvents() {
		this.ui.toggler.addEventListener('click', event => this.eventListeners.togglerBtn.click(event));
		this.ui.close.addEventListener('click', event => this.eventListeners.closeBtn.click(event));
		this.ui.submit.addEventListener('click', event => {
			event.preventDefault();
			this.eventListeners.submitBtn.click(event)
		});

		this.chat.form.addEventListener('submit', event => {
			event.preventDefault();
			this.eventListeners.form.submit(event);
		})

		this.chat.form.addEventListener('transitionend', event => this.eventListeners.form.transitionend(event));
		this.chat.form.addEventListener('transitioncancel', event => this.eventListeners.form.transitioncancel(event));	

		this.chat.textarea.addEventListener('keypress', event => this.eventListeners.textarea.keypress(event));

		this.page.addEventListener('click', event =>	this.eventListeners.page.click(event));
	}

	byClickShowChat(event) {
		this.hideTogglerBtn();
		this.showChat();
	}

	byClickHideChat(event) {
		this.startHideChat();
	}

	byClickSubmitBtn(event) {
		this.chat.form.dispatchEvent(new SubmitEvent("submit"));
	}

	bySubmitForm(event) {
		this.chekCurrectForm();
	}

	byKeyPressTextarea(event) {
		if(event.charCode === 13 && !event.shiftKey) {
			this.chat.form.dispatchEvent(new SubmitEvent('submit'));
		}
	}

	byTransitionEndChat(event) {
		if(event.propertyName === 'transform') {
			if(this.state.chat) {
				return;
			}
			this.endHideChat();
			this.showTogglerBtn();
		}

		if(event.propertyName === 'opacity') {

		}
	}

	byTrsnsitionCancelChat(event) {
		if(!this.state.chat) {
			this.endHideChat();
			this.showTogglerBtn();
		}
	}

	byClickOuterSpace(event) {
		if(!this.state.chat) {
			return;
		}
		if(event.target.closest('[data-chat="form"]'))	{
			return;
		}
		if(event.target.dataset.ui === "toggler") {
			return
		}

		this.startHideChat();
	}

	showChat() {
		this.chat.form.classList.remove('hidden-item', 'chat-block_temp')
		this.state.chat = true;
	}

	startHideChat() {
		this.chat.form.classList.add('chat-block_temp')
		this.state.chat = false;
	}

	endHideChat() {
		this.chat.form.classList.add('hidden-item')
	}

	clearChat() {
		this.chat.textarea.value = '';
		this.chat.textarea.selectionEnd = 0;
		this.chat.textarea.blur();
	}

	showTogglerBtn() {
		this.ui.toggler.classList.remove('hidden-item');
		this.state.toggler = true;
	}

	hideTogglerBtn() {
		this.ui.toggler.classList.add('hidden-item');
		this.state.toggler = false;
	}

	chekCurrectForm() {
		const ticket = this.chat.textarea.value.trim();
		if(ticket.length < 5) {
			this.showError('Слишком короткое сообщение');
			return;
		}

		console.log('send formData to server with fetch');
		this.clearChat();
		this.showMessage('Сообщение отправлено')
	}

	showError(error) {
		if(this.state.idError) {
			clearTimeout(this.state.idError)
		}

		this.message.error.textContent = error;
		this.state.idError = setTimeout(() => this.hideError(), 1000)
	}

	hideError() {
		this.message.error.textContent = '';
	}

	showMessage(message) {
		if(this.state.idSuccess) {
			clearTimeout(this.state.idSuccess)
		}
		this.message.success.textContent = message;
		this.message.success.classList.remove('hidden-item');
		this.state.idSuccess = setTimeout(() =>	{
			this.ui.close.dispatchEvent(new MouseEvent('click'));
			this.hideMessage();
		}, 1000);
	}

	hideMessage() {
		this.message.success.textContent = '';
		this.message.success.classList.add('hidden-item');
	}
}