# Part A: Model-View-Controller architecture of a watch

This is a simple TypeScript implementation of watch application using the Model-View-Controller (MVC) design pattern.
This implementation is structured into the following components:

- `WatchModel` holds and manipulates the state of the watch by handling the timekeeping, edit modes, and background color.

- `WatchView` manages the UI, displaying the current state of the model. It renders the current state of the watch, taking into account the editable sections and background color.

- `WatchController` coordinates user input, updating the model and refreshing the view accordingly.

```mermaid
classDiagram

class WatchModel {
    - int hours
    - int minutes
    - int seconds
    - string editMode
    - boolean lightOn

    + tick()
    + toggleEditMode()
    + incrementTime()
    + toggleLight()

    + getTime()
    + getEditMode()
    + isLightOn()
}

class WatchView {
    - HTMLElement display
    + render(WatchModel model)
}

class WatchController {
    - WatchModel model
    - WatchView view

    + WatchController(WatchModel model, WatchView view)

    + pressModeButton()
    + pressIncreaseButton()
    + pressLightButton()

    + update()
}

WatchModel --> WatchView : observes
WatchController --> WatchModel : updates
WatchController --> WatchView : renders
```
