export const enum Keys {
    left = 37,
    up = 38,
    right = 39,
    down = 40,
    space = 32,
    enter = 13,
}

interface IKeyPressed {
    keyCode: Keys;
    pressed: boolean;
}

class Keyboard {
    private keysStates: IKeyPressed[] = [];

    public configure() {
        const that = this;

        this.createKeysStates();

        document.addEventListener('keydown', (evt: KeyboardEvent) => {
            that.handleEvent(evt, true);
        });

        document.addEventListener('keyup', (evt: KeyboardEvent) => {
            that.handleEvent(evt, false);
        });
    }

    public isPressed(keyCode: Keys): boolean {
        const keyState = this.keysStates.find((item: IKeyPressed) => {
            return keyCode === item.keyCode;
        });

        if (keyState) {
            return keyState.pressed;
        }

        return false;
    }

    private createKeysStates() {
        const that = this;
        const keys = [
            Keys.left,
            Keys.right,
            Keys.down,
            Keys.up,
            Keys.space,
            Keys.enter,
        ];

        keys.forEach((key) => {
            const keyPressed: IKeyPressed = {
                keyCode: key,
                pressed: false,
            };

            that.keysStates.push(keyPressed);
        });
    }

    private handleEvent(evt: KeyboardEvent, pressed: boolean) {
        const keyState = this.keysStates.find((keyPressed: IKeyPressed) => {
            return evt.keyCode === keyPressed.keyCode;
        });

        if (keyState) {
            keyState.pressed = pressed;
        }
    }
}

export default Keyboard;
