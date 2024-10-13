import { TimeModel } from "./TimeModel";

export class WatchModel {
    private _time: TimeModel;

    // Common watch state
    private _editMode: "NONE" | "HOURS" | "MINUTES";
    private _isLightOn: boolean = false;
    private _isDigital: boolean = true;

    // Analog watch state
    isDraggingMinuteHandle: boolean = false;
    prevAngle: number = 0;
    updatedAngle: boolean = false;

    constructor(time: TimeModel = new TimeModel()) {
        this._time = time;
        this._editMode = "NONE";
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
    toggleIsDigital(): void {
        this._isDigital = !this._isDigital;
    }
    toggleEditMode(): void {
        if (this._editMode === "NONE") {
            if (this._isDigital) this._editMode = "HOURS";
            else this._editMode = "MINUTES";
        } else if (this._editMode === "HOURS") {
            this._editMode = "MINUTES";
        } else {
            this._editMode = "NONE";
        }
    }

    update() {
        if (!this._isDigital && this._editMode != "NONE") return;
        this.time.incrementSeconds();
    }

    // Analog watch events for dragging handles with mouse
    onMousedownEvent(relMouseX: number, relMouseY: number): void {
        const distance = Math.hypot(relMouseX, relMouseY);
        if (distance <= 100) {
            this.isDraggingMinuteHandle = true;
        }
    }
    onMousemoveEvent(relMouseX: number, relMouseY: number): void {
        if (this.isDraggingMinuteHandle) {
            let angle = (Math.atan2(relMouseY, relMouseX) / Math.PI) * 180;
            let time = this.time;

            // Adjust the angle to account for the 90 degrees offset.
            let minuteAngle = angle + 90;

            // Adjust the angle to be between 0 and 2*PI.
            if (minuteAngle < 0) {
                minuteAngle += 360;
            }

            // Update hour handle only once
            time.minutes = Math.floor((minuteAngle / 360) * 60) % 60;
            if (!this.updatedAngle)
                if (
                    this.prevAngle > -90 &&
                    time.minutes > 50 &&
                    time.minutes <= 59
                ) {
                    time.hours -= 1;
                    this.updatedAngle = true;
                } else if (
                    this.prevAngle < -90 &&
                    time.minutes >= 0 &&
                    time.minutes < 10
                ) {
                    time.hours += 1;
                    this.updatedAngle = true;
                }

            if (Math.abs(angle - this.prevAngle) > 10) this.prevAngle = angle;

            if (Math.abs(angle + 90) > 10) this.updatedAngle = false;
        }
    }
    onMouseupEvent(): void {
        this.time.hours = (this.time.hours + 24) % 24;
        this.time.minutes = (this.time.minutes + 60) % 60;
        this.isDraggingMinuteHandle = false;
    }
}
