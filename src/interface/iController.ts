import { GameCommandType } from '../gameCommandType';

export interface IController {
    configure: () => void;
    getCommands: () => GameCommandType[];
    isCommandPressed: (gameCommand: GameCommandType) => boolean;
}
