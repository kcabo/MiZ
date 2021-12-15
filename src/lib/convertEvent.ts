// 注意: クソコード

export function shortenedEventToProperStyle(originEvent: string) {
  const notContainHan = originEvent.replace('半', 'はん');

  const result = challengeConvert(notContainHan);
  if (result) return result;

  const allHiragana = toHiragana(notContainHan);
  const result2 = challengeConvert(allHiragana);
  if (result2) return result2;

  return originEvent;
}

function challengeConvert(origin: string) {
  const after = hiraganaToEvent(origin);
  if (origin === after) return false;
  return after;
}

function hiraganaToEvent(hiragana: string) {
  return hiragana
    .replace('はんふり', '50m自由形')
    .replace('いちふり', '100m自由形')
    .replace('にふり', '200m自由形')
    .replace('よんふり', '400m自由形')
    .replace('はちふり', '800m自由形')
    .replace('せんご', '1500m自由形')
    .replace('はんばっく', '50m背泳ぎ')
    .replace('いちばっく', '100m背泳ぎ')
    .replace('にばっく', '200m背泳ぎ')
    .replace('はんぶれ', '50m平泳ぎ')
    .replace('いちぶれ', '100m平泳ぎ')
    .replace('にぶれ', '200m平泳ぎ')
    .replace('はんばた', '50mバタフライ')
    .replace('いちばた', '100mバタフライ')
    .replace('にばた', '200mバタフライ')
    .replace('はんばった', '50mバタフライ')
    .replace('いちばった', '100mバタフライ')
    .replace('にばった', '200mバタフライ')
    .replace('いちこめ', '100m個人メドレー')
    .replace('にこめ', '200m個人メドレー')
    .replace('よんこめ', '400m個人メドレー')
    .replace('いちこんめ', '100m個人メドレー')
    .replace('にこんめ', '200m個人メドレー')
    .replace('よんこんめ', '400m個人メドレー')
    .replace('いちけい', '100mフリーリレー')
    .replace('にけい', '200mフリーリレー')
    .replace('よんけい', '400mフリーリレー')
    .replace('はちけい', '800mフリーリレー')
    .replace('にめりれ', '200mメドレーリレー')
    .replace('よんめりれ', '400mメドレーリレー')
    .replace('めりれ', '400mメドレーリレー')
    .replace('たいむ', 'タイム'); // タイム決勝がたいむ決勝に変換されたのを戻す
}

function toHiragana(str: string) {
  return str.replace(/[\u30a1-\u30f6]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0x60)
  );
}
