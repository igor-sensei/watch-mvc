import { WatchModel, WatchView, WatchController } from "./single-watch";

export class PageController {
    private draggedWidget: HTMLElement | null;
    private offsetX: number;
    private offsetY: number;
    private dragStartX: string;
    private dragStartY: string;
    private widgets: WatchController[];

    constructor() {
        this.draggedWidget = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragStartX = "0px";
        this.dragStartY = "0px";
        this.widgets = [];

        const createWidgetButton = document.getElementById('createWidgetButton') as HTMLButtonElement;
        createWidgetButton.addEventListener('click', () => this.createWidget());

        for (let i = 1; i <= 3; i++) {
            this.createWidget();
        }

        document.body.addEventListener('dragover', (e) => this.handleDragOver(e));
        document.body.addEventListener('drop', (e) => this.handleDrop(e));

        setInterval(() => {
            this.widgets.forEach((widget) => widget.update());
        }, 1000);
    }

    private createWidget(): void {
        const model = new WatchModel();
        const view = new WatchView(this.widgets.length);
        this.widgets.push(new WatchController(model, view));
        document.body.appendChild(view.widget);
        this.addDragAndDropListeners(view.widget);
        this.addRemoveButtonListener(view.widget.querySelector('.remove-button') as HTMLButtonElement);
    }

    private addDragAndDropListeners(widget: HTMLElement): void {
        widget.addEventListener('dragstart', (e) => this.handleDragStart(e, widget));
        widget.addEventListener('dragover', (e) => e.preventDefault());
        widget.addEventListener('drop', (e) => this.handleDropOnWidget(e, widget));
    }

    private addRemoveButtonListener(button: HTMLButtonElement): void {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering drag events
            const widget = button.parentElement;
            if (widget) {
                document.body.removeChild(widget);
            }
        });
    }

    private handleDragStart(e: DragEvent, widget: HTMLElement): void {
        this.draggedWidget = widget;
        this.offsetX = e.offsetX;
        this.offsetY = e.offsetY;
        this.dragStartX = widget.style.left;
        this.dragStartY = widget.style.top;
        widget.style.zIndex = "-1";
        e.dataTransfer?.setDragImage(new Image(), 0, 0); // Hide default drag image
    }

    private handleDragOver(e: DragEvent): void {
        e.preventDefault();
        if (this.draggedWidget) {
            this.draggedWidget.style.left = `${e.pageX - this.offsetX}px`;
            this.draggedWidget.style.top = `${e.pageY - this.offsetY}px`;
        }
    }

    private handleDrop(e: DragEvent): void {
        e.preventDefault();
        if (this.draggedWidget) {
            this.draggedWidget.style.zIndex = ""; // Reset the z-index after dropping
            this.draggedWidget = null;
        }
    }

    private handleDropOnWidget(e: DragEvent, targetWidget: HTMLElement): void {
        e.preventDefault();
        if (this.draggedWidget && targetWidget !== this.draggedWidget) {
            // Swap the positions of the dragged widget and the target widget
            const tempX = targetWidget.style.left;
            const tempY = targetWidget.style.top;

            targetWidget.style.left = this.dragStartX;
            targetWidget.style.top = this.dragStartY;

            this.draggedWidget.style.left = tempX;
            this.draggedWidget.style.top = tempY;
        }
    }
}