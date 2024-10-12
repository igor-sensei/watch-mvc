import { WatchModel } from "./WatchModel";
import { WatchView } from "./WatchView";

// Handles user interactions
export class WatchController {
  private model: WatchModel;
  private view: WatchView;

  constructor(model: WatchModel, view: WatchView) {
    this.model = model;
    this.view = view;
    this.addEventListeners();
  }

  addEventListeners() {
    this.view.buttonContainer.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("mode-btn")) {
        this.model.toggleEditMode();
      } else if (target.classList.contains("increase-btn")) {
        this.model.incrementTime();
      } else if (target.classList.contains("light-btn")) {
        this.model.toggleLight();
      } else if (target.classList.contains("remove-btn")) {
        event.stopPropagation(); // Prevent triggering drag events
        const widget = target.parentElement.parentElement;
        if (widget) {
          document.body.removeChild(widget);
        }
      } else if (target.classList.contains("reset-btn")) {
        this.model.time.resetTime();
      } else if (target.classList.contains("format-btn")) {
        this.model.time.toggle24HourFormat();
      }
    });

    this.view.timezoneSelect.addEventListener('change', () => {
      this.model.time.timezone = Number(this.view.timezoneSelect.value);
    });
  }

  update(): void {
    this.model.time.tick();
    this.view.render(this.model);
  }
}

