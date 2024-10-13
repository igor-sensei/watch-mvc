import { TimeModel } from '../TimeModel';

describe('TimeModel', () => {
  let timeModel: TimeModel;

  beforeEach(() => {
    timeModel = new TimeModel();
  });

  test('should initialize with default values', () => {
    expect(timeModel.hours).toBeGreaterThanOrEqual(0);
    expect(timeModel.hours).toBeLessThan(24);
    expect(timeModel.minutes).toBeGreaterThanOrEqual(0);
    expect(timeModel.minutes).toBeLessThan(60);
    expect(timeModel.seconds).toBeGreaterThanOrEqual(0);
    expect(timeModel.seconds).toBeLessThan(60);
    expect(timeModel.is24HourFormat).toBe(true);
  });

  test('should increment seconds correctly', () => {
    timeModel.hours = 0;
    timeModel.minutes = 0;
    timeModel.seconds = 59;
    timeModel.incrementSeconds();
    expect(timeModel.seconds).toBe(0);
    expect(timeModel.minutes).toBe(1);
  });

  test('should increment minutes correctly', () => {
    timeModel.hours = 1;
    timeModel.minutes = 59;
    timeModel.seconds = 2;
    timeModel.incrementMinutes();
    expect(timeModel.minutes).toBe(0);
    expect(timeModel.hours).toBe(2);
  });

  test('should increment hours correctly', () => {
    timeModel.hours = 23;
    timeModel.incrementHours();
    expect(timeModel.hours).toBe(0);
  });

  test('should reset time correctly', () => {
    timeModel.hours = 10;
    timeModel.minutes = 30;
    timeModel.seconds = 45;
    timeModel.resetTime();
    const now = new Date();
    expect(timeModel.hours).toBe(now.getHours() + timeModel.timezone - TimeModel.defaultTimezone());
    expect(timeModel.minutes).toBe(now.getMinutes());
    expect(timeModel.seconds).toBe(now.getSeconds());
  });

  test('should toggle 24-hour format', () => {
    expect(timeModel.is24HourFormat).toBe(true);
    timeModel.toggle24HourFormat();
    expect(timeModel.is24HourFormat).toBe(false);
    timeModel.toggle24HourFormat();
    expect(timeModel.is24HourFormat).toBe(true);
  });

  test('should set hours and minutes correctly', () => {
    timeModel.hours = 15;
    timeModel.minutes = 45;
    expect(timeModel.hours).toBe(15);
    expect(timeModel.minutes).toBe(45);
  });

  test('should update timezone correctly', () => {
    const initialHours = timeModel.hours;
    timeModel.timezone = 3;
    expect(timeModel.timezone).toBe(3);
    expect(timeModel.hours).toBe(initialHours + 3 - TimeModel.defaultTimezone());
  });
});
