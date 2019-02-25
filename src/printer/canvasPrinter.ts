import IPrinter, { AlignType } from '../interface/iPrinter';

class CanvasPrinter implements IPrinter {
    private elemCanvas: HTMLCanvasElement | null = null;
    private contextCanvas: CanvasRenderingContext2D | null = null;
    private width: number = 0;
    private height: number = 0;

    constructor(targetName: string, width: number, height: number) {
        this.elemCanvas = document.querySelector<HTMLCanvasElement>(targetName)!;
        this.contextCanvas = this.elemCanvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.elemCanvas.width = width;
        this.elemCanvas.height = height;
    }

    public clear() {
        this.contextCanvas!.clearRect(0, 0, this.width, this.height);
    }

    public drawRect(x: number, y: number, width: number, height: number, color: string) {
        this.contextCanvas!.save();
        this.contextCanvas!.fillStyle = color;
        this.contextCanvas!.fillRect(x, y, width, height);
        this.contextCanvas!.restore();
    }

    public drawText(
        x: number,
        y: number,
        text: string,
        color: string,
        fontType: string,
        fontSize: number,
        alignType: AlignType,
    ) {
        this.contextCanvas!.save();
        this.contextCanvas!.fillStyle = color;
        this.contextCanvas!.font = `${fontSize}px ${fontType}`;
        this.contextCanvas!.textAlign = alignType;
        this.contextCanvas!.fillText(text, x, y);
        this.contextCanvas!.restore();
    }

    public drawImage(x: number, y: number, image: HTMLImageElement) {
        this.contextCanvas!.save();
        this.contextCanvas!.drawImage(image, x, y);
        this.contextCanvas!.restore();
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public assignOnPrintEvent(callback: () => void) {
        const that = this;

        window.requestAnimationFrame(() => {
            callback();
            that.assignOnPrintEvent(callback);
        });
    }
}

export default CanvasPrinter;
