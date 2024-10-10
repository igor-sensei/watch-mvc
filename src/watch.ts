export class WatchModel {
  // Watch state
  private hours: number;
  private minutes: number;
  private seconds: number;
  private editMode: "NONE" | "HOURS" | "MINUTES";
  private lightOn: boolean;

  // Create default state of the watch
  constructor() {
    const now = new Date();
    this.hours = now.getHours();
    this.minutes = now.getMinutes();
    this.seconds = now.getSeconds();
    this.editMode = "NONE";
    this.lightOn = false;
  }


  //////////////////
  // Modify state //
  //////////////////

  // Advance time by one second
  public tick(): void {
    if (this.editMode === "NONE") {
      this.seconds++;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes++;
        if (this.minutes === 60) {
          this.minutes = 0;
          this.hours = (this.hours + 1) % 24;
        }
      }
    }
  }
  public toggleEditMode(): void {
    if (this.editMode === "NONE") {
      this.editMode = "HOURS";
    } else if (this.editMode === "HOURS") {
      this.editMode = "MINUTES";
    } else {
      this.editMode = "NONE";
    }
  }
  public incrementTime() {
    if (this.editMode === "HOURS") {
      this.incrementHours();
    } else if (this.editMode === "MINUTES") {
      this.incrementMinutes();
    }
  }
  incrementHours(): void {
    this.hours = (this.hours + 1) % 24;
  }
  incrementMinutes(): void {
    this.minutes = (this.minutes + 1) % 60;
    if (this.minutes === 0) {
      this.incrementHours();
    }
  }
  public toggleLight(): void {
    this.lightOn = !this.lightOn;
  }


  ////////////////////
  // Retrieve state //
  ////////////////////
  public getTime(): { hours: number; minutes: number; seconds: number } {
    return { hours: this.hours, minutes: this.minutes, seconds: this.seconds };
  }
  public getEditMode(): "NONE" | "HOURS" | "MINUTES" {
    return this.editMode;
  }
  public isLightOn(): boolean {
    return this.lightOn;
  }
}


// Handles the presentation layer
export class WatchView {
  private display: HTMLElement;

  constructor() {
    this.display = document.getElementById("watch-display")!;
  }

  public render(model: WatchModel): void {
    const { hours, minutes, seconds } = model.getTime();
    const editMode = model.getEditMode();

    let timeString = "";
    if (editMode === "HOURS") {
      timeString = `<span class="blink">${hours.toString().padStart(2, "0")}</span>:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else if (editMode === "MINUTES") {
      timeString = `${hours.toString().padStart(2, "0")}:<span class="blink">${minutes.toString().padStart(2, "0")}</span>:${seconds.toString().padStart(2, "0")}`;
    } else {
      timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    this.display.innerHTML = timeString;

    if (model.isLightOn()) {
      this.display.style.backgroundColor = "#FBE106";
    } else {
      this.display.style.backgroundColor = "#FFFFFF";
    }
  }
}


// Handles user interactions
export class WatchController {
  private model: WatchModel;
  private view: WatchView;

  constructor(model: WatchModel, view: WatchView) {
    this.model = model;
    this.view = view;

    document.getElementById("mode-button")!.addEventListener("click", () => this.handleModeButtonClick());
    document.getElementById("increase-button")!.addEventListener("click", () => this.handleIncreaseButtonClick());
    document.getElementById("light-button")!.addEventListener("click", () => this.handleLightButtonClick());

    setInterval(() => this.update(), 1000);
  }

  private handleModeButtonClick(): void {
    this.model.toggleEditMode();
  }

  private handleIncreaseButtonClick(): void {
    this.model.incrementTime();
  }

  private handleLightButtonClick(): void {
    this.model.toggleLight();
  }

  private update(): void {
    this.model.tick();
    this.view.render(this.model);
  }
}
