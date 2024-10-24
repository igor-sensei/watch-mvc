import { WatchModel } from "./WatchModel";
import { WatchView } from "./WatchView";

export class WatchController {
    private model: WatchModel;
    private view: WatchView;

    constructor(model: WatchModel, view: WatchView) {
        this.model = model;
        this.view = view;
        this.addEventListeners(this.model, this.view);
    }

    update(): void {
        this.model.update();
        this.view.render(this.model);
    }

    private addEventListeners(model: WatchModel, view: WatchView) {
        view.buttonContainer.addEventListener("click", (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains("mode-btn")) {
                model.toggleEditMode();
            } else if (target.classList.contains("increase-btn")) {
                model.incrementTime();
            } else if (target.classList.contains("light-btn")) {
                model.toggleLight();
            } else if (target.classList.contains("remove-btn")) {
                event.stopPropagation(); // Prevent triggering drag events
                const widget = target.parentElement.parentElement;
                if (widget) {
                    document.body.removeChild(widget);
                }
            } else if (target.classList.contains("reset-btn")) {
                model.time.resetTime();
            } else if (target.classList.contains("24h-format-btn")) {
                model.toggle24HourFormat();

            } else if (target.classList.contains("ui-choice-btn")) {
                model.toggleIsDigital();
                view.watchDisplay.toggleIsDigital();
                if (!view.watchDisplay.isDigital)
                    this.addAnalogWatchEventListners(model, view);
            }
        });
        view.timezoneSelect.addEventListener("change", () => {
            model.time.timezone = Number(view.timezoneSelect.value);
        });
    }

    private addAnalogWatchEventListners(model: WatchModel, view: WatchView) {
        let canvas = view.watchDisplay.canvas;
        canvas.addEventListener("mousedown", (event) => {
            if (model.editMode != "NONE") {
                let [relMouseX, relMouseY] =
                    view.watchDisplay.getRelativeMousePosition(
                        event.clientX,
                        event.clientY,
                    );
                model.onMousedownEvent(relMouseX, relMouseY);
            }
        });
        canvas.addEventListener("mousemove", (event) => {
            let [relMouseX, relMouseY] = view.watchDisplay.getRelativeMousePosition(
                event.clientX,
                event.clientY,
            );
            model.onMousemoveEvent(relMouseX, relMouseY);
            this.view.render(model);
        });
        canvas.addEventListener("mouseup", () => {
            model.onMouseupEvent();
        });
    }
}
