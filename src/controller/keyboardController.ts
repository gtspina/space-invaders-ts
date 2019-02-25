import { GameCommandType } from '../gameCommandType';
import Keyboard, { Keys } from '../input/keyboard';
import { IController } from '../interface/iController';

const keysToCommands = [
    { key: Keys.left, command: GameCommandType.left },
    { key: Keys.right, command: GameCommandType.right },
    { key: Keys.up, command: GameCommandType.up },
    { key: Keys.down, command: GameCommandType.down },
    { key: Keys.space, command: GameCommandType.fire },
    { key: Keys.enter, command: GameCommandType.ok },
];

class KeyboardController implements IController {
    private keyboard: Keyboard = new Keyboard();

    public configure() {
        this.keyboard.configure();
    }

    public getCommands() {
        const commands: GameCommandType[] = [];

        keysToCommands.forEach((keyToCommand) => {
            if (this.keyboard.isPressed(keyToCommand.key)) {
                commands.push(keyToCommand.command);
            }
        });

        return commands;
    }

    public isCommandPressed(gameCommand: GameCommandType) {
        const commands = this.getCommands();
        return commands.includes(gameCommand);
    }
}

export default KeyboardController;
