import IPrinter, { AlignType } from '../interface/iPrinter';
import { IVector2 } from '../interface/iVector2';

export class GUIElement {
    private active: boolean = true;
    private pos: IVector2 = { x: 0, y: 0 };
    private fontSize: number = 0;
    private fontType: string = '';
    private color: string = 'white';
    private text: string = '';
    private alignType: AlignType = AlignType.start;

    constructor(
        pos: IVector2,
        fontSize: number,
        fontType: string,
        color: string,
        text: string,
        alignType: AlignType,
    ) {
        this.pos = pos,
            this.fontSize = fontSize,
            this.fontType = fontType,
            this.color = color,
            this.text = text,
            this.alignType = alignType;
    }

    public update() {

    }

    public draw(printer: IPrinter) {
        if (!this.active) {
            return;
        }

        printer.drawText(
            this.pos.x,
            this.pos.y,
            this.text,
            this.color,
            this.fontType,
            this.fontSize,
            this.alignType,
        );
    }

    public enable() {
        this.active = true;
    }

    public disable() {
        this.active = false;
    }

    public setText(text: string) {
        this.text = text;
    }
}
