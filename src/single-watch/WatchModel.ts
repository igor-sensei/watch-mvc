export class TimeModel {
    private _hours: number;
    private _minutes: number;
    private _seconds: number;
    private _timezone: number; // Time zone offset in hours
    private _is24HourFormat: boolean;

    constructor() {
        this._timezone = TimeModel.defaultTimezone();
        this._is24HourFormat = true;
        this.resetTime();
    }

    static defaultTimezone():number {
        return Math.floor(-(new Date().getTimezoneOffset() / 60));
    }

    tick(): void {
        this._seconds++;
        if (this._seconds === 60) {
            this._seconds = 0;
            this._minutes++;
            if (this._minutes === 60) {
                this._minutes = 0;
                this._hours = (this._hours + 1) % 24;
            }
        }
    }
    incrementHours(): void {
        this._hours = (this._hours + 1) % 24;
    }

    incrementMinutes(): void {
        this._minutes = (this._minutes + 1) % 60;
        if (this._minutes === 0) {
            this.incrementHours();
        }
    }
    resetTime(): void {
        const now = new Date();
        this._hours = now.getHours() + this.timezone - TimeModel.defaultTimezone();
        // this._hours = this.timezone;
        this._minutes = now.getMinutes();
        this._seconds = now.getSeconds();
    }
    toggle24HourFormat(): void {
        this._is24HourFormat = !this._is24HourFormat;
    }

    get hours(): number {
        return this._hours;
    }
    get minutes(): number {
        return this._minutes;
    }
    get seconds(): number {
        return this._seconds;
    }
    get timezone(): number {
        return this._timezone;
    }
    get is24HourFormat(): boolean {
        return this._is24HourFormat;
    }

    set timezone(value: number) {
        this._hours += value - this.timezone;
        this._timezone = value;
    } 
}

export class WatchModel {
    private _time: TimeModel;
    private _editMode: "NONE" | "HOURS" | "MINUTES";
    private _isLightOn: boolean;

    // Create default state of the watch
    constructor() {
        this._time = new TimeModel();
        this._editMode = "NONE";
        this._isLightOn = false;
    }

    // Retrieve state
    get time(): TimeModel {
        return this._time;
    }
    get editMode(): "NONE" | "HOURS" | "MINUTES" {
        return this._editMode;
    }
    get isLightOn(): boolean {
        return this._isLightOn;
    }

    // Modify state
    toggleEditMode(): void {
        if (this._editMode === "NONE") {
            this._editMode = "HOURS";
        } else if (this._editMode === "HOURS") {
            this._editMode = "MINUTES";
        } else {
            this._editMode = "NONE";
        }
    }
    incrementTime() {
        if (this._editMode === "HOURS") {
            this._time.incrementHours();
        } else if (this._editMode === "MINUTES") {
            this._time.incrementMinutes();
        }
    }
    toggleLight(): void {
        this._isLightOn = !this._isLightOn;
    }
}