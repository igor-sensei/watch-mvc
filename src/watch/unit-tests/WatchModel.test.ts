import { WatchModel } from '../WatchModel';
import { TimeModel } from '../TimeModel';

// Importing Jest for unit testing
describe('WatchModel', () => {
  let watch: WatchModel;
  let time: TimeModel;

  beforeEach(() => {
    time = new TimeModel();
    watch = new WatchModel(time);
  });

  test('should initialize with default values', () => {
    expect(watch.time).toBe(time);
    expect(watch.editMode).toBe('NONE');
    expect(watch.isLightOn).toBe(false);
  });

  test('should increment hours when editMode is HOURS', () => {
    watch.toggleEditMode(); // Set to HOURS
    expect(watch.editMode).toBe('HOURS');
    const initialHours = time.hours;
    watch.incrementTime();
    expect(time.hours).toBe((initialHours + 1) % 24);
  });

  test('should increment minutes when editMode is MINUTES', () => {
    watch.toggleEditMode(); // Set to HOURS
    watch.toggleEditMode(); // Set to MINUTES
    expect(watch.editMode).toBe('MINUTES');
    const initialMinutes = time.minutes;
    watch.incrementTime();
    expect(time.minutes).toBe((initialMinutes + 1) % 60);
  });

  test('should toggle light correctly', () => {
    expect(watch.isLightOn).toBe(false);
    watch.toggleLight();
    expect(watch.isLightOn).toBe(true);
    watch.toggleLight();
    expect(watch.isLightOn).toBe(false);
  });

  test('should toggle edit mode correctly', () => {
    expect(watch.editMode).toBe('NONE');
    watch.toggleEditMode();
    expect(watch.editMode).toBe('HOURS');
    watch.toggleEditMode();
    expect(watch.editMode).toBe('MINUTES');
    watch.toggleEditMode();
    expect(watch.editMode).toBe('NONE');
  });

  test('should toggle watch type between digital and analog', () => {
    expect(watch['_isDigital']).toBe(true);
    watch.toggleIsDigital();
    expect(watch['_isDigital']).toBe(false);
    watch.toggleIsDigital();
    expect(watch['_isDigital']).toBe(true);
  });

  test('should update time when update is called', () => {
    const initialSeconds = time.seconds;
    watch.update();
    expect(time.seconds).toBe((initialSeconds + 1) % 60);
  });

  test('should start dragging minute handle on mousedown event', () => {
    watch.onMousedownEvent(50, 50);
    expect(watch.isDraggingMinuteHandle).toBe(true);
  });

  test('should stop dragging minute handle on mouseup event', () => {
    watch.onMousedownEvent(50, 50);
    watch.onMouseupEvent();
    expect(watch.isDraggingMinuteHandle).toBe(false);
  });
});
