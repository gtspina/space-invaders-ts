export enum AlignType {
    center = 'center',
    start = 'start',
}
interface IPrinter {
    drawRect(x: number, y: number, widht: number, height: number, color: string): void;
    drawImage(x: number, y: number, image: HTMLImageElement): void;
    drawText(
        x: number,
        y: number,
        text: string,
        color: string,
        fontType: string,
        fontSize: number,
        alignType: AlignType,
    ): void;
    clear(): void;
    assignOnPrintEvent(callback: () => void): void;

    getWidth(): number;
    getHeight(): number;
}

export default IPrinter;
