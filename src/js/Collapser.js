export default class Collapser {
	constructor(container, time = '1000') {
		this.container = document.querySelector(container)
		this.collapseButton;
		this.collapseContainer;
		this.collapseField;
		this.timeCollapse = `${time}`;
		this.collapseButtonListeners = {
			click: null,
		}
		this.dataAnimation = {
			requestId: null,
			heightField: null,
			heightContainer: null,
			start: null,
			action: null,
			pixelsToFrame: null
		}
	

		this.init();
	}

	init () {
		this.parseElements();
		this.saveEventsListeners();
		this.registerEvents();
	}

	parseElements() {
		this.collapseButton = this.container.querySelector('[data-id="collapseButton"]')
		this.collapseContainer = this.container.querySelector('[data-id="collapseContainer"]')
		this.collapseField = this.container.querySelector('[data-id="collapseField"]')
	}

	saveEventsListeners() {
		this.collapseButtonListeners.click = this.byClickCollapser.bind(this)
	}

	registerEvents() {
		this.collapseButton.addEventListener('click', event => {
			event.preventDefault();

			this.collapseButtonListeners.click(event)
		})
	}

	byClickCollapser(event) {
		this.showOrHideCollapseField(event)
	}

	showOrHideCollapseField(event) {
		if(this.dataAnimation.requestId) {
			cancelAnimationFrame(this.requestId)
		}

		this.clearDataAnimation();

		const isShow = this.collapseField.dataset.show;
	
		if(isShow === "true") {
			this.collapseField.dataset.show = false;
			this.dataAnimation.action = "hide"; 
		} else {
			this.collapseField.dataset.show = true;
			this.dataAnimation.action = "show";
		}

		this.dataAnimation.heightField = this.collapseField.getBoundingClientRect().height;
		this.dataAnimation.heightContainer = this.collapseContainer.getBoundingClientRect().height;
		this.dataAnimation.start = performance.now();
		this.dataAnimation.pixelsToFrame = this.dataAnimation.heightField / this.timeCollapse;
	
		this.dataAnimation.requestId = window.requestAnimationFrame(this.actionCollapser.bind(this));
	}

	clearDataAnimation() {
		for(let key in this.dataAnimation) {
			this.dataAnimation[key] = null;
		}
	}

	actionCollapser() {
		const { action, start, heightField, heightContainer, pixelsToFrame } = this.dataAnimation;
		const passTime = (performance.now() - start);
		const incrPixels = passTime * pixelsToFrame;
		let height;
		let cont = true;

		if(action === 'show') {
			const newHeight = Math.floor(heightContainer + incrPixels);
			if(newHeight >= heightField) {
				height = heightField;
				cont = false;
			} else {
				height = newHeight;
			}
		}

		if(action === 'hide') {
			const newHeight = Math.floor(heightContainer - incrPixels);
			if(newHeight <= 0) {
				height = 0;
				cont = false;
			} else {
				height = newHeight;
			}
		}

		this.collapseContainer.style.height = `${height}px`;

		if(cont) {
			window.requestAnimationFrame(this.actionCollapser.bind(this))
		}
	}  
}