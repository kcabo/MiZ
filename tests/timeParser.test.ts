import {
  parseToRaceCoreData,
  toCentiSeconds,
  toCentiSecondsArray,
} from '../src/timeParser';
import { RaceCoreData } from '../src/types';

test('Time Parsing (unit)', () => {
  expect(toCentiSeconds('2')).toBe(2);
  expect(toCentiSeconds('62')).toBe(62);
  expect(toCentiSeconds('129')).toBe(129);
  expect(toCentiSeconds('5999')).toBe(5999);
  expect(toCentiSeconds('10123')).toBe(6123);
  expect(toCentiSeconds('15923')).toBe(11923);
  expect(toCentiSeconds('18000')).toBe(14000);
  expect(toCentiSeconds('182021')).toBe(110021);
});

test('Time Parsing (unit, invalid)', () => {
  expect(() => {
    toCentiSeconds('-2');
  }).toThrow();
  expect(() => {
    toCentiSeconds('Hello');
  }).toThrow();
  expect(() => {
    toCentiSeconds('1234567');
  }).toThrow();
  expect(() => {
    toCentiSeconds('3011 2');
  }).toThrow();
  expect(() => {
    toCentiSeconds('');
  }).toThrow();
});

test('Time Parsing (array)', () => {
  expect(() => {
    toCentiSecondsArray('11234\n３０0０\n９１1\n12３4５67');
  }).toThrow();
  expect(() => {
    toCentiSecondsArray('文字列');
  }).toThrow();
});

test('positive: event, reaction, time', () => {
  const userInput = `テスト君
100m自由形
62
2945
10276`;
  const output: RaceCoreData = {
    swimmer: 'テスト君',
    event: '100m自由形',
    reaction: 62,
    cumulativeTime: [2945, 6276],
  };
  expect(parseToRaceCoreData(userInput)).toEqual({ raceCoreData: output });
});

test('positive: event, time', () => {
  const userInput = `テスト君2
200mバタフライ
2822
５９３０
13２11
20873`;
  const output: RaceCoreData = {
    swimmer: 'テスト君2',
    event: '200mバタフライ',
    cumulativeTime: [2822, 5930, 9211, 12873],
  };
  expect(parseToRaceCoreData(userInput)).toEqual({ raceCoreData: output });
});

test('negative parsing', () => {
  const invalidInputs = [
    '1111\n1111\n1111',
    'テスト君\n1111\n1111',
    'テスト君\nいちふり\n1111\n',
    'テスト君\nいちふり\n1111\n11',
    'テスト君\nいちふり\n1111a\n11',
    '',
    '\n\n',
  ];
  const result = { error: 'unmatching pattern' };
  invalidInputs.map((input) => {
    expect(parseToRaceCoreData(input)).toEqual(result);
  });
});
