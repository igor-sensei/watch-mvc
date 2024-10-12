import { TimeModel, WatchModel } from "./WatchModel";

export class WatchView {
    private _widget: HTMLElement;
    private _display: HTMLElement;
    private _buttonContainer: HTMLDivElement;
    private _timezoneSelect: HTMLSelectElement;

    constructor(widgetCounter: number = 0) {
        this._widget = document.createElement("div");
        this._widget.className = "widget";
        this._widget.id = `widget${widgetCounter}`;
        this._widget.draggable = true;
        this._widget.innerHTML = `Widget ${widgetCounter} <button class="remove-button">X</button>`;

        // Find an empty position for the new widget
        let positionFound = false;
        const newWidgetRect = this._widget.getBoundingClientRect();
        let top = 100;
        let left = 100;
        while (!positionFound) {
            positionFound = true;
            document.querySelectorAll('.widget').forEach((widget) => {
                const widgetRect = widget.getBoundingClientRect();
                if (Math.abs(widgetRect.top - top) < widgetRect.height && Math.abs(widgetRect.left - left) < widgetRect.width) {
                    positionFound = false;
                    left += 150; // Move to the next position
                    if (left > window.innerWidth - newWidgetRect.width - 300) { // If it reaches the edge of the screen
                        left = 100;
                        top += newWidgetRect.height + 150;
                    }
                }
            });
        }
        this._widget.style.top = `${top}px`;
        this._widget.style.left = `${left}px`;

        this._display = document.createElement("div");
        this._display.id = "watch-display";
        this._display.textContent = "00:00:00";
        this._widget.appendChild(this._display);

        // Create the buttons
        this._buttonContainer = document.createElement("div");
        this._buttonContainer.id = "button-container";
        this._buttonContainer.innerHTML = `
        <div class="time-display"></div>
        <button class="mode-btn">Mode</button>
        <button class="increase-btn">Increase</button>
        <button class="light-btn">Light</button>
        <button class="reset-btn">Reset</button>
        <button class="format-btn">Format</button>
        `;
        this._widget.appendChild(this._buttonContainer);

        const timezoneContainer: HTMLDivElement = document.createElement('div');
        timezoneContainer.id = 'timezone-widget';

        // Create select element for timezones
        this._timezoneSelect = document.createElement('select');
        this._timezoneSelect.id = 'timezone-select';

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
            const option: HTMLOptionElement = document.createElement('option');
            option.value = key;
            option.text = timezoneMap[key];
            this._timezoneSelect.appendChild(option);
        });
        this._timezoneSelect.value = String(TimeModel.defaultTimezone());

        timezoneContainer.appendChild(this._timezoneSelect);
        this._widget.appendChild(timezoneContainer);

        document.body.appendChild(this._widget);
    }

    get widget(): HTMLElement {
        return this._widget;
    }
    get buttonContainer(): HTMLDivElement {
        return this._buttonContainer;
    }
    get timezoneSelect(): HTMLSelectElement {
        return this._timezoneSelect;
    }
    
    render(model: WatchModel): void {
        const time = model.time;
        const editMode = model.editMode;
        let hourStr = time.is24HourFormat ? String(time.hours).padStart(2, '0') : String(time.hours % 12 || 12).padStart(2, '0');
        if (editMode === "HOURS")
            hourStr = `<span class="blink">${hourStr}</span>`;

        let minuteStr = String(time.minutes).padStart(2, '0');
        if (editMode === "MINUTES")
            minuteStr = `<span class="blink">${minuteStr}</span>`;

        let secondStr = String(time.seconds).padStart(2, '0');
        let ampm = time.is24HourFormat ? '' : (time.hours >= 12 ? ' PM' : ' AM');
        this._display.innerHTML = `${hourStr}:${minuteStr}:${secondStr}${ampm}`;
        if (model.isLightOn) {
            this._display.style.backgroundColor = "#FBE106";
        } else {
            this._display.style.backgroundColor = "#FFFFFF";
        }
    }
}