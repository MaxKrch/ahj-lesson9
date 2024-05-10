export default class Liker {
	constructor(container) {
		this.container = document.querySelector(container);
		this.likeButton;
		this.likes = [];
		this.eventListeners = {
			likeButton: {
				click: null,
			},
			likes: {
				animationend: null,
			},
		}
		
		this.init();
	}

	init() {

		this.parserElements();
		this.saveEventListeners();
		this.registerEvents();
	}

	parserElements() {
		this.likeButton = this.container.querySelector('.liker-button');
	}

	saveEventListeners() {
		this.eventListeners.likeButton.click = this.byClickLikeButton.bind(this);
		this.eventListeners.likes.animationend = this.byAnimationend.bind(this);
	}

	registerEvents() {
		this.likeButton.addEventListener('click', event => this.eventListeners.likeButton.click())
		this.likeButton.addEventListener('animationend', event => this.eventListeners.likes.animationend(event))
	}

	byClickLikeButton() {
		const newLike = this.renderLike();
		this.likes.push(newLike);
		this.addLikeToDOM(newLike);
	}

	byAnimationend(event) {
		if(event.animationName !== "heart-fly-top") {
			return
		}
		const like = event.target;
		this.removeLikeFromDOM(like);
	}

	renderLike() {
		const like = document.createElement('div');
		const numbTrajector = this.selectTrajector();
		like.classList.add(`heart`, `heart-fly-${numbTrajector}`);
	
		return like;
	}

	addLikeToDOM(like) {
		this.likeButton.append(like)
	}

	removeLikeFromDOM(like) {
		const index = this.likes.indexOf(like);
		this.likes.splice(index, 1);
		like.remove();
	}

	selectTrajector() {
		const numb = Math.floor((Math.random() * 4) + 1);
		return numb;	
	}
}