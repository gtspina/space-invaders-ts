import { GameCommandType } from '../gameCommandType';
import { IController } from '../interface/iController';
import { IGameScene } from '../interface/iGameScene';
import { IImageAsset } from '../interface/iImageAsset';
import IPrinter, { AlignType } from '../interface/iPrinter';
import { ISoundAsset } from '../interface/iSoundAsset';
import { GUIElement } from '../printer/guiElement';
import SpaceInvadersOptions from '../spaceInvadersOptions';

class MainMenuScene implements IGameScene {
    private printer: IPrinter | null = null;

    private txtTitle: GUIElement | null = null;
    private txtStart: GUIElement | null = null;
    private txtTips: GUIElement | null = null;

    public create(images: Readonly<IImageAsset>, sounds: Readonly<ISoundAsset>, printer: IPrinter) {
        this.printer = printer;

        this.createGUI();
    }

    public update(controller: IController, options: SpaceInvadersOptions) {
        if (controller.isCommandPressed(GameCommandType.ok)) {
            options.changeScene('game');
        }
    }

    public draw() {
        this.printer!.clear();
        this.printer!.drawRect(0, 0, this.printer!.getWidth(), this.printer!.getHeight(), 'black');

        this.txtTitle!.draw(this.printer!);
        this.txtStart!.draw(this.printer!);
        this.txtTips!.draw(this.printer!);
    }

    public destroy() {

    }

    private createGUI() {
        this.txtTitle = new GUIElement(
            { x: this.printer!.getWidth() / 2, y: this.printer!.getHeight() / 2 },
            50,
            'Arial',
            'white',
            'SPACE INVADERS',
            AlignType.center,
        );

        this.txtStart = new GUIElement(
            { x: this.printer!.getWidth() / 2, y: this.printer!.getHeight() / 2 + 50 },
            25,
            'Arial',
            'white',
            'PRESS ENTER TO START',
            AlignType.center,
        );

        this.txtTips = new GUIElement(
            { x: this.printer!.getWidth() / 2, y: this.printer!.getHeight() / 2 + 100 },
            20,
            'Arial',
            'white',
            'SPACE - SHOT, ARROWS - MOVE',
            AlignType.center,
        );
    }
}

export default MainMenuScene;
