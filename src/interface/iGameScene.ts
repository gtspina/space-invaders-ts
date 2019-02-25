import SpaceInvadersOptions from '../spaceInvadersOptions';
import { IController } from './iController';
import { IImageAsset } from './iImageAsset';
import IPrinter from './iPrinter';
import { ISoundAsset } from './iSoundAsset';

export interface IGameScene {
    create: (images: Readonly<IImageAsset>, sounds: Readonly<ISoundAsset>, printer: IPrinter) => void;
    update: (controller: IController, options: SpaceInvadersOptions) => void;
    draw: () => void;
    destroy: () => void;
}
