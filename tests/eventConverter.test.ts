import { shortenedEventToProperStyle } from '../src/eventConverter';

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
});
