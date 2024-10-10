// A few simple tests for WatchModel and WatchController.
// WatchView is more delicate to test separately, skipping for simplicity.

import { WatchModel, WatchView, WatchController } from './watch';
import { JSDOM } from 'jsdom';

describe('WatchModel', () => {
    let model: WatchModel;

    beforeEach(() => {
        model = new WatchModel();
    });

    test('initial state should be correct', () => {
        const now = new Date();
        const { hours, minutes, seconds } = model.getTime();
        expect(model.getEditMode()).toBe("NONE");
        expect(model.isLightOn()).toBe(false);
    });

    test('tick should increase seconds', () => {
        const time = model.getTime();
        model.tick();
        expect(model.getTime().seconds).toBe((time.seconds + 1) % 60);
    });

    test('toggleEditMode should cycle through modes', () => {
        const modes = ["HOURS", "MINUTES", "NONE"]; // The same order as defined in constructor
        modes.forEach(mode => {
            model.toggleEditMode();
            expect(model.getEditMode()).toBe(mode);
        });
    });

    test('increaseTime should increase hours or minutes based on edit mode', () => {
        const time = model.getTime();
        model.toggleEditMode();
        model.incrementTime();
        expect(model.getTime().hours).toBe((time.hours + 1) % 24);

        model.toggleEditMode();
        model.incrementTime();
        expect(model.getTime().minutes).toBe((time.minutes + 1) % 60);
    });

    test('increasing minutes 60 times should result in an hour increase', () => {
        const time = model.getTime();
        model.toggleEditMode(); // Set to MINUTES edit mode
        model.toggleEditMode();
        for (let i = 0; i < 60; i++) {
            model.incrementTime();
        }
        expect(model.getTime().minutes).toBe(time.minutes);
        expect(model.getTime().hours).toBe((time.hours + 1) % 24);
    });

    test('toggleLight should toggle light state', () => {
        model.toggleLight();
        expect(model.isLightOn()).toBe(true);
        model.toggleLight();
        expect(model.isLightOn()).toBe(false);
    });
});


describe('WatchController', () => {
    let model: WatchModel;
    let view: WatchView;
    let controller: WatchController;

    beforeEach(() => {
        // Simulate the DOM with jsdom
        const dom = new JSDOM(`
      <div id="watch-display"></div>
      <button id="mode-button">Mode</button>
      <button id="increase-button">Increase</button>
      <button id="light-button">Light</button>
    `, { url: "http://localhost/" });
        (global as any).document = dom.window.document;
        (global as any).window = dom.window;
        model = new WatchModel();
        view = new WatchView();
        controller = new WatchController(model, view);
    });

    test('mode button should toggle edit mode', () => {
        document.getElementById('mode-button')!.click();
        expect(model.getEditMode()).toBe("HOURS");
    });

    test('increase button should increase time based on edit mode', () => {
        const time = model.getTime()
        model.toggleEditMode();
        document.getElementById('increase-button')!.click();
        expect(model.getTime().hours).toBe((time.hours + 1) % 24);
    });

    test('light button should toggle light', () => {
        document.getElementById('light-button')!.click();
        expect(model.isLightOn()).toBe(true);
    });
});
