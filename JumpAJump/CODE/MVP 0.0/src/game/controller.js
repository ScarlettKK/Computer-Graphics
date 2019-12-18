import gameView from './view'
// import gameModel from './model'


class GameController {
	constructor(){
		this.gameView = gameView;
		// this.gameModel = gameModel;
	}

	showGameOverPage = () => {
		this.gameView.showGameOverPage()
	}

	gameRestart = () => {
		this.gameView.restartGame()
	}

	initPages(){
		const gamePageCallbacks = {
			showGameOverPage: this.showGameOverPage
		}
		const gameOverPageCallbacks = {
			gameRestart : this.gameRestart
		}
		this.gameView.initGamePage(gamePageCallbacks);
		this.gameView.initGameOverPage(gameOverPageCallbacks);
	}
}

export default new GameController()