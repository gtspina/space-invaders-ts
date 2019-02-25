import SpaceInvadersGame from './spaceInvadersGame';

export type SceneName = 'menu' | 'game';

class SpaceInvadersOptions {
    private spaceInvadersGame: SpaceInvadersGame;

    constructor(spaceInvadersGame: SpaceInvadersGame) {
        this.spaceInvadersGame = spaceInvadersGame;
    }

    public changeScene(sceneName: SceneName) {
        this.spaceInvadersGame.changeScene(sceneName);
    }
}

export default SpaceInvadersOptions;
