import GamePage from '../pages/game-page'
import GameOverPage from '../pages/game-over-page'

class GameView {
	constructor(){

	}

	restartGame() {
		this.GamePage.restart()
	}

	showGameOverPage () {
		this.GameOverPage.show();
	}

	initGameOverPage(callbacks){
		this.gameOverPage = new GameOverPage(callbacks)
		this.gameOverPage.init()
	}

	initGamePage(callbacks){
		this.gamePage = new GamePage(callbacks)
		this.gamePage.init()
	}
}

// 导出一个实例, 单例模式
export default new GameView()