export default class Toggler {
	constructor(container) {
		this.container = document.querySelector(container)
		
		this.init();
	}

	init() {
		console.log(this.container)
	}
}