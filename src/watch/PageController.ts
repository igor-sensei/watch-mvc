import { WatchModel } from "./WatchModel";
import { WatchView } from "./WatchView";
import { WatchController } from "./WatchController";

// Enables dragging watches thoughtout the page, and swapping watches in case of overlap
export class PageController {
    private draggedContainer: HTMLElement | null;
    private offsetX: number;
    private offsetY: number;
    private dragStartX: string;
    private dragStartY: string;
    private watches: WatchController[];

    constructor() {
        this.draggedContainer = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragStartX = "0px";
        this.dragStartY = "0px";
        this.watches = [];

        // Populate page with one clock to start with
        this.addWatch();

        this.addButtons();

        // Update all the timers in sync
        setInterval(() => {
            this.watches.forEach((controller) => controller.update());
        }, 1000);
    }

    private addButtons() {
        const addWatchButton = document.getElementById(
            "addWatchButton"
        ) as HTMLButtonElement;
        addWatchButton.addEventListener("click", () => this.addWatch());
        document.body.addEventListener("dragover", (e) => this.handleDragOver(e)
        );
        document.body.addEventListener("drop", (e) => this.handleDrop(e));
    }

    private addWatch(): void {
        let model: WatchModel = new WatchModel();
        let view: WatchView = new WatchView(this.watches.length);
        let controller = new WatchController(model, view);
        this.watches.push(controller);
        this.addDragAndDropListeners(view.container);
        this.addRemoveButtonListener(
            view.container.querySelector(".remove-button") as HTMLButtonElement,
        );
    }

    private addDragAndDropListeners(container: HTMLElement): void {
        container.addEventListener("dragstart", (e) =>
            this.handleDragStart(e, container),
        );
        container.addEventListener("dragover", (e) => e.preventDefault());
        container.addEventListener("drop", (e) =>
            this.handleDropOnContainer(e, container),
        );
    }

    private addRemoveButtonListener(button: HTMLButtonElement): void {
        button.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent triggering drag events
            const container = button.parentElement;
            if (container) {
                document.body.removeChild(container);
            }
        });
    }

    private handleDragStart(e: DragEvent, container: HTMLElement): void {
        this.draggedContainer = container;
        this.offsetX = e.offsetX;
        this.offsetY = e.offsetY;
        this.dragStartX = container.style.left;
        this.dragStartY = container.style.top;
        container.style.zIndex = "-1";
        e.dataTransfer?.setDragImage(new Image(), 0, 0); // Hide default drag image
    }
    private handleDragOver(e: DragEvent): void {
        e.preventDefault();
        if (this.draggedContainer) {
            this.draggedContainer.style.left = `${e.pageX - this.offsetX}px`;
            this.draggedContainer.style.top = `${e.pageY - this.offsetY}px`;
        }
    }
    private handleDrop(e: DragEvent): void {
        e.preventDefault();
        if (this.draggedContainer) {
            // Reset the z-index after dropping
            // because the event loop depends on the z offset
            this.draggedContainer.style.zIndex = "";
            this.draggedContainer = null;
        }
    }
    private handleDropOnContainer(e: DragEvent, targetContainer: HTMLElement): void {
        e.preventDefault();
        if (this.draggedContainer && targetContainer !== this.draggedContainer) {
            // Swap the positions of the dragged container and the target container
            const tempX = targetContainer.style.left;
            const tempY = targetContainer.style.top;

            targetContainer.style.left = this.dragStartX;
            targetContainer.style.top = this.dragStartY;

            this.draggedContainer.style.left = tempX;
            this.draggedContainer.style.top = tempY;
        }
    }
}
