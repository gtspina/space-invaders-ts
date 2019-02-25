import CanvasPrinter from './printer/canvasPrinter';
import StarForceGame from './spaceInvadersGame';

const printer = new CanvasPrinter('#myCanvas', 500, 500);
const starForceGame = new StarForceGame(printer);

starForceGame.start();
