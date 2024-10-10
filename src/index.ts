import './index.css';
import { WatchModel, WatchView, WatchController } from './watch';

// Instantiate model-view-controller components and run the watch application
document.addEventListener("DOMContentLoaded", () => {
    const model = new WatchModel();
    const view = new WatchView();
    new WatchController(model, view);
});