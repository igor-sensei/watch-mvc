import { WatchModel } from "./WatchModel";
import { AnalogWatchDisplay, WatchView } from "./WatchView";

export class WatchController {
    private model: WatchModel;
    private view: WatchView;

    constructor(model: WatchModel, view: WatchView) {
        this.model = model;
        this.view = view;
        this.view.addEventListeners(this.model);
    }

    update(): void {
        this.model.update();
        this.view.render(this.model);
    }
}
