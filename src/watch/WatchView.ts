import { Point } from "./Geometry";
import { WatchModel } from "./WatchModel";
import { TimeModel } from "./TimeModel";

export class WatchView {
    private _container: HTMLElement;
    private _buttonContainer: HTMLDivElement;
    private _timezoneSelect: HTMLSelectElement;

    private _displayContainer: HTMLElement;
    watchDisplay: WatchDisplay;

    constructor(widgetCounter: number) {
        this._container = document.createElement("div");
        this._container.className = "widget";
        this._container.id = `widget${widgetCounter}`;
        this._container.draggable = true;
        this._container.innerHTML = `Watch ${widgetCounter} <button class="remove-button">X</button>`;

        let { top, left } = this.findEmptyPosition();
        this._container.style.top = `${top}px`;
        this._container.style.left = `${left}px`;

        this._displayContainer = document.createElement("div");
        this._displayContainer.id = "watch-display";
        this.watchDisplay = new WatchDisplay(this._displayContainer);
        this._container.appendChild(this._displayContainer);

        // Create the buttons
        this._buttonContainer = document.createElement("div");
        this._buttonContainer.id = "button-container";
        this._buttonContainer.innerHTML = `
        <div class="time-display"></div>
        <button class="mode-btn">Edit Mode</button>
        <button class="increase-btn">Increase</button>
        <button class="light-btn">Light</button>
        <button class="reset-btn">Reset</button>
        <button class="24h-format-btn">12/24h Format</button>
        <button class="ui-choice-btn">Digital/Analog</button>
        `;
        this._container.appendChild(this._buttonContainer);

        const timezoneContainer: HTMLDivElement = document.createElement("div");
        timezoneContainer.id = "timezone-widget";

        // Create select element for timezones
        this._timezoneSelect = document.createElement("select");
        this._timezoneSelect.id = "timezone-select";

        // Map from hour offset to timezone name
        const timezoneMap: { [key: string]: string } = {
            "0": "UTC (Reykjavik)",
            "1": "UTC+1 (London)",
            "2": "UTC+2 (Berlin, Paris, Madrid)",
            "3": "UTC+3 (Nairobi, Istanbul, Athens)",
            "4": "UTC+4 (Dubai, Baku, Samara)",
            "5": "UTC+5 (Karachi, Tashkent, Yekaterinburg)",
            "6": "UTC+6 (Dhaka, Almaty, Omsk)",
            "7": "UTC+7 (Bangkok, Jakarta, Krasnoyarsk)",
            "8": "UTC+8 (Beijing, Singapore, Perth)",
            "9": "UTC+9 (Tokyo, Seoul, Yakutsk)",
            "10": "UTC+10 (Sydney, Vladivostok, Port Moresby)",
            "11": "UTC+11 (Magadan, Noumea, Honiara)",
            "12": "UTC+12 (Auckland, Suva, Petropavlovsk-Kamchatsky)",
            "-1": "UTC-1 (Azores, Cape Verde)",
            "-2": "UTC-2 (South Georgia & South Sandwich Islands)",
            "-3": "UTC-3 (Buenos Aires, Montevideo, Nuuk)",
            "-4": "UTC-4 (Santiago, Caracas, La Paz)",
            "-5": "UTC-5 (New York, Bogota, Lima)",
            "-6": "UTC-6 (Mexico City, Chicago, Guatemala City)",
            "-7": "UTC-7 (Denver, Phoenix, Chihuahua)",
            "-8": "UTC-8 (Los Angeles, Vancouver, Tijuana)",
            "-9": "UTC-9 (Anchorage, Gambier Islands)",
            "-10": "UTC-10 (Honolulu, Papeete)",
            "-11": "UTC-11 (Pago Pago, Niue)",
            "-12": "UTC-12 (Baker Island, Howland Island)",
        };
        Object.keys(timezoneMap).forEach((key) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = key;
            option.text = timezoneMap[key];
            this._timezoneSelect.appendChild(option);
        });
        this._timezoneSelect.value = String(TimeModel.defaultTimezone());

        timezoneContainer.appendChild(this._timezoneSelect);
        this._container.appendChild(timezoneContainer);

        document.body.appendChild(this._container);
    }

    private findEmptyPosition() {
        let positionFound = false;
        const newWidgetRect = this._container.getBoundingClientRect();
        let top = 100;
        let left = 100;
        while (!positionFound) {
            positionFound = true;
            document.querySelectorAll(".widget").forEach((widget) => {
                const widgetRect = widget.getBoundingClientRect();
                if (
                    Math.abs(widgetRect.top - top) < widgetRect.height &&
                    Math.abs(widgetRect.left - left) < widgetRect.width
                ) {
                    positionFound = false;
                    left += 150; // Move to the next position
                    if (left > window.innerWidth - newWidgetRect.width - 300) {
                        // If it reaches the edge of the screen
                        left = 100;
                        top += newWidgetRect.height + 150;
                    }
                }
            });
        }
        return { top, left };
    }

    get container(): HTMLElement {
        return this._container;
    }
    get buttonContainer(): HTMLDivElement {
        return this._buttonContainer;
    }
    get timezoneSelect(): HTMLSelectElement {
        return this._timezoneSelect;
    }

    render(model: WatchModel): void {
        this.watchDisplay.render(model);
    }
}

export class WatchDisplay {
    readonly _display: HTMLElement;
    private _isDigital: boolean = true;

    private hourHandle: Point;
    private minuteHandle: Point;
    private secondHandle: Point;
    private center: Point;
    canvas: HTMLCanvasElement;

    constructor(display: HTMLElement) {
        this._display = display;
        if (this._isDigital)
            this._display.textContent = "00:00:00";
        else
            this._display.innerHTML =
                '<canvas id="watchCanvas" width="400" height="400"></canvas>';
        this.hourHandle = new Point(0, -50);
        this.minuteHandle = new Point(0, -70);
        this.secondHandle = new Point(0, -90);
        this.center = new Point(0, 0);
    }

    render(model: WatchModel): void {
        if (this._isDigital) this.renderDigital(model);
        else this.renderAnalog(model);
    }

    toggleIsDigital(): void {
        if (this._isDigital) {
            this._isDigital = false;
            this._display.innerHTML =
                '<canvas id="watchCanvas" width="400" height="400"></canvas>';
            this.canvas = this._display.querySelector(
                "canvas",
            ) as HTMLCanvasElement;
            this._display.appendChild(this.canvas);
        } else {
            this._isDigital = true;
            this.canvas = null;
            this._display.textContent = "00:00:00";
        }
    }

    get isDigital(): boolean {
        return this._isDigital;
    }

    private getLightColor(isLightOn: boolean): string {
        if (isLightOn) {
            return "#FBE106";
        } else {
            return "#FFFFFF";
        }
    }

    private renderDigital(model: WatchModel): void {
        const time = model.time;
        const editMode = model.editMode;
        let hourStr = model.is24HourFormat
            ? String(time.hours).padStart(2, "0")
            : String(time.hours % 12 || 12).padStart(2, "0");
        if (editMode === "HOURS")
            hourStr = `<span class="blink">${hourStr}</span>`;

        let minuteStr = String(time.minutes).padStart(2, "0");
        if (editMode === "MINUTES")
            minuteStr = `<span class="blink">${minuteStr}</span>`;

        let secondStr = String(time.seconds).padStart(2, "0");
        let ampm = model.is24HourFormat ? "" : time.hours >= 12 ? " PM" : " AM";
        this._display.innerHTML = `${hourStr}:${minuteStr}:${secondStr}${ampm}`;
        this._display.style.backgroundColor = this.getLightColor(
            model.isLightOn,
        );
    }

    // Analog watch methods
    private renderAnalog(model: WatchModel) {
        this.canvas.style.backgroundColor = this.getLightColor(model.isLightOn);

        const hourAngle =
            (model.time.hours % 12) * 30 + model.time.minutes * 0.5;
        const minuteAngle = model.time.minutes * 6;
        const secondAngle = model.time.seconds * 6;

        this.hourHandle = new Point(0, -50).rotate(hourAngle);
        this.minuteHandle = new Point(0, -70).rotate(minuteAngle);
        this.secondHandle = new Point(0, -90).rotate(secondAngle);
        const ctx = this.canvas.getContext("2d");

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.beginPath();
        ctx.arc(
            this.canvas.width / 2,
            this.canvas.height / 2,
            100,
            0,
            2 * Math.PI,
        );
        ctx.strokeStyle = "black";
        ctx.stroke();

        this.drawHandle(ctx, this.hourHandle, "black");
        this.drawHandle(ctx, this.minuteHandle, "blue");
        this.drawHandle(ctx, this.secondHandle, "red");
    }

    getRelativeMousePosition(
        clientX: number,
        clientY: number,
    ): [number, number] {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        const watchCenterX = this.canvas.width / 2;
        const watchCenterY = this.canvas.height / 2;
        const deltaX = mouseX - watchCenterX;
        const deltaY = mouseY - watchCenterY;
        return [deltaX, deltaY];
    }

    private drawHandle(
        ctx: CanvasRenderingContext2D,
        handle: Point,
        color: string,
    ) {
        ctx.beginPath();
        ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        const endPoint = handle.translate(
            this.canvas.width / 2,
            this.canvas.height / 2,
        );
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}
