import assetsPath from './assetsPath';
import KeyboardController from './controller/KeyboardController';
import { IGameScene } from './interface/iGameScene';
import { IImageAsset } from './interface/iImageAsset';
import IPrinter, { AlignType } from './interface/iPrinter';
import { ISoundAsset } from './interface/iSoundAsset';
import GameScene from './scene/gameScene';
import MainMenuScene from './scene/mainMenuScene';
import SpaceInvadersOptions, { SceneName } from './spaceInvadersOptions';

class SpaceInvadersGame {
    private printer: IPrinter | null = null;
    private currentScene: IGameScene | null = null;
    private gameOptions: SpaceInvadersOptions = new SpaceInvadersOptions(this);

    private images: IImageAsset = {};
    private sounds: ISoundAsset = {};

    private controller = new KeyboardController();

    constructor(printer: IPrinter) {
        this.printer = printer;
        this.controller.configure();
    }

    public start(): void {
        const onFinishPreLoad = () => {
            this.currentScene = new MainMenuScene();
            this.currentScene.create(this.images, this.sounds, this.printer!);

            this.printer!.assignOnPrintEvent(() => {
                this.currentScene!.update(this.controller, this.gameOptions);
                this.currentScene!.draw();
            });
        };

        this.preloadAssets(onFinishPreLoad);
    }

    public changeScene(sceneName: SceneName) {
        this.currentScene!.destroy();

        switch (sceneName) {
            case 'game':
                this.currentScene = new GameScene();
                break;
            case 'menu':
                this.currentScene = new MainMenuScene();
                break;
        }

        this.currentScene!.create(this.images, this.sounds, this.printer!);

        console.log('Change scene.');
    }

    private preloadAssets(onFinish: () => void) {
        const that = this;
        let missingsAssets = assetsPath.length;
        const onLoadImage = (name: string, image: HTMLImageElement) => {
            that.images[name] = image;
            console.log(`Asset image ${name} has loaded.`);

            missingsAssets -= 1;

            if (missingsAssets < 1) {
                console.log('Game start.');
                onFinish();
            }
        };

        const onLoadSound = (name: string, sound: HTMLAudioElement) => {
            that.sounds[name] = sound;
            console.log(`Asset sound ${name} has loaded.`);
            missingsAssets -= 1;

            if (missingsAssets < 1) {
                console.log('Game start.');
                onFinish();
            }
        };

        assetsPath.forEach((assetPath) => {
            if (assetPath.type === 'image') {
                const image = new Image();

                image.src = assetPath.path;

                image.onload = () => {
                    onLoadImage(assetPath.name, image);
                };
            } else if (assetPath.type === 'sound') {
                const sound = new Audio();

                sound.src = assetPath.path;

                sound.onloadeddata = () => {
                    onLoadSound(assetPath.name, sound);
                };
            }

        });
    }
}

export default SpaceInvadersGame;
