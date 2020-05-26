class KeyboardContext {
    constructor(window) {
        this.window = window;
        this.keySet = new Set();
        this.listeners = [];
    }

    listen() {
        const onKeyDown = (event) => {
            this._handleEvent(event.which, KeyAction.PRESS);
        };
        this.window.document.addEventListener("keydown", onKeyDown, false);

        const onKeyUp = (event) => {
            this._handleEvent(event.which, KeyAction.RELEASE);
        };
        this.window.document.addEventListener("keyup", onKeyUp, false);
    }

    _handleEvent(code, eventType) {
        if ([KeyCode.UP, KeyCode.W].includes(code))
            this._updateKeys(KeyCommand.UP, eventType);
        else if ([KeyCode.DOWN, KeyCode.S].includes(code))
            this._updateKeys(KeyCommand.DOWN, eventType);
        else if ([KeyCode.LEFT, KeyCode.A].includes(code))
            this._updateKeys(KeyCommand.LEFT, eventType);
        else if ([KeyCode.RIGHT, KeyCode.D].includes(code))
            this._updateKeys(KeyCommand.RIGHT, eventType);
    }

    _updateKeys(keyCommand, eventType) {
        if (eventType == KeyAction.RELEASE)
            this.keySet.delete(keyCommand);
        else if (eventType == KeyAction.PRESS)
            this.keySet.add(keyCommand);
        else
            throw new Error("Invalid key event type");
    }

    registerListener(listener) {
        this.listeners.push(listener);
    }

    update(dt) {
        this.listeners.forEach((listener) => {
            listener(this.keySet, dt);
        });
    }
}

const KeyCommand = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
};
Object.freeze(KeyCommand);

const KeyCode = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
};
Object.freeze(KeyCode);

const KeyAction = {
    PRESS: 1,
    RELEASE: 2,
};
Object.freeze(KeyAction);

export { KeyboardContext, KeyCommand };
