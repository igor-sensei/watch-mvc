// Convenience timer with time formatting state
export class TimeModel {
    hours: number; // Both getter and setter are needed
    minutes: number;
    seconds: number;
    private _timezone: number; // Time zone offset in hours

    constructor() {
        this._timezone = TimeModel.defaultTimezone();
        this.resetTime();
    }

    static defaultTimezone(): number {
        return Math.floor(-(new Date().getTimezoneOffset() / 60));
    }

    incrementSeconds(): void { // Add one second, update minutes and hours accordingly
        this.seconds++;
        if (this.seconds === 60) {
            this.seconds = 0;
            this.incrementMinutes();
        }
    }
    incrementMinutes(): void {
        this.minutes = (this.minutes + 1) % 60;
        if (this.minutes === 0) {
            this.incrementHours();
        }
    }
    incrementHours(): void {
        this.hours = (this.hours + 1) % 24;
    }

    resetTime(): void {
        const now = new Date();
        this.hours =
            now.getHours() + this.timezone - TimeModel.defaultTimezone();
        this.minutes = now.getMinutes();
        this.seconds = now.getSeconds();
    }

    get timezone(): number {
        return this._timezone;
    }

    set timezone(value: number) {
        this.hours += value - this.timezone;
        this._timezone = value;
    }
}
