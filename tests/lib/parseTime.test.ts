import { PayloadTooLarge, WrongMessageFormat } from 'exceptions';
import { parseToRaceCoreData, __local__ } from 'lib/parseTime';
import { RaceCoreData } from 'types';

const { toCentiSeconds, toCentiSecondsArray, applyPattern } = __local__;

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

test('Time Parsing (array)', () => {
  expect(toCentiSecondsArray('11234\n３０0０\n９１1\n12３4５6')).toStrictEqual([
    7234, 3000, 911, 75456,
  ]);
  expect(toCentiSecondsArray('123\n'.repeat(21))).toStrictEqual(
    new PayloadTooLarge('too long time')
  );
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
  expect(parseToRaceCoreData(userInput)).toStrictEqual(output);
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
  expect(parseToRaceCoreData(userInput)).toStrictEqual(output);
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
  invalidInputs.map((input) => {
    expect(parseToRaceCoreData(input)).toStrictEqual(new WrongMessageFormat());
  });
});

test('regex match', () => {
  const userInput = `テスト君2
200mバタフライ
2822
５９３０
13２11
20873`;
  const output = {
    swimmer: 'テスト君2',
    event: '200mバタフライ',
    reactionStr: undefined,
    cumulativeTimeStr: `2822
５９３０
13２11
20873`,
  };
  expect(applyPattern(userInput)).toStrictEqual(output);
});

test('regex match with reaction', () => {
  const userInput = `テスト君2
200mバタフライ
0２０
2822
５９３０
13２11
20873`;
  const output = {
    swimmer: 'テスト君2',
    event: '200mバタフライ',
    reactionStr: '0２０',
    cumulativeTimeStr: `2822
５９３０
13２11
20873`,
  };
  expect(applyPattern(userInput)).toStrictEqual(output);
});
