import { shortenedEventToProperStyle } from 'lib/convertEvent';

it('Convert event appropriately', () => {
  expect(shortenedEventToProperStyle('はんふり')).toBe('50m自由形');
  expect(shortenedEventToProperStyle('はんふりにふり')).toBe(
    '50m自由形200m自由形'
  );
  expect(shortenedEventToProperStyle('にばった')).toBe('200mバタフライ');
  expect(shortenedEventToProperStyle('いちこめ 決勝')).toBe(
    '100m個人メドレー 決勝'
  );
  expect(shortenedEventToProperStyle('男子はんぶれ')).toBe('男子50m平泳ぎ');
  expect(shortenedEventToProperStyle('50m 平泳ぎ')).toBe('50m 平泳ぎ');
  expect(shortenedEventToProperStyle('はちこめ')).toBe('はちこめ');

  expect(shortenedEventToProperStyle('半フリ')).toBe('50m自由形');
  expect(shortenedEventToProperStyle('半ふり')).toBe('50m自由形');
  expect(shortenedEventToProperStyle('イチフリ')).toBe('100m自由形');
  expect(shortenedEventToProperStyle('半バック')).toBe('50m背泳ぎ');
  expect(shortenedEventToProperStyle('半バック タイマー決勝')).toBe(
    '50m背泳ぎ たいまー決勝'
  );
  expect(shortenedEventToProperStyle('半バック タイム決勝')).toBe(
    '50m背泳ぎ タイム決勝'
  );
});
