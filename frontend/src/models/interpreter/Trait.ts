/**
 * 武器やアビリティの属性（特性）を表すインタフェース
 */
export interface Trait {
  /**
   * 属性の文字列表現 (例: "Ｐ", "Ｂ", "弱火", "効水")
   */
  code: string;
}

/**
 * 属性文字列（例: "ＰＢ弱火"）を解析して Trait の配列を返します
 */
export function parseTraits(traitsStr: string): Trait[] {
  const traits: Trait[] = [];
  let i = 0;
  const len = traitsStr.length;

  while (i < len) {
    const start = i;
    let ch = traitsStr[i];
    let nextI = i + 1;

    // Ｍ（マップ攻撃）があれば、次の文字まで一緒に取得
    // Ｍ直、Ｍ拡、Ｍ扇、Ｍ全、Ｍ投、Ｍ移、Ｍ線
    if (ch === "Ｍ" && nextI < len) {
      const nextCh = traitsStr[nextI];
      if (
        nextCh === "直" ||
        nextCh === "拡" ||
        nextCh === "扇" ||
        nextCh === "全" ||
        nextCh === "投" ||
        nextCh === "移" ||
        nextCh === "線"
      ) {
        nextI++;
      }
    }

    // 弱、効、剋があればその次の文字まで一緒に取得
    // 入れ子可能なためループ (例: 弱効火)
    while ((ch === "弱" || ch === "効" || ch === "剋") && nextI < len) {
      ch = traitsStr[nextI];
      nextI++;
    }

    // 低があればその次の文字まで一緒に取得
    if (ch === "低" && nextI < len) {
      const nextCh = traitsStr[nextI];
      if (
        nextCh === "攻" ||
        nextCh === "防" ||
        nextCh === "運" ||
        nextCh === "移"
      ) {
        nextI++;
      }
    }

    // Treat L, dot, and digits as suffixes (VB5 Logic)
    // They attach to the preceding token.
    // Example: "気L1.4" -> "気" + "L" + "1" + "." + "4" -> "気L1.4"
    // Example: "投L1" -> "投" + "L" + "1" -> "投L1"
    // Example: "Ｍ投L2" -> "Ｍ" + "投" + "L" + "2" -> "Ｍ投L2"
    while (nextI < len) {
      const nextSuffix = traitsStr[nextI];
      // Check if next char is a suffix character: L, ., or Digit
      // Note: VB5 IsNumeric checks for digits. "L" is explicit. "." is explicit.
      if (nextSuffix === "L" || nextSuffix === "." || /^\d$/.test(nextSuffix)) {
        nextI++;
      } else {
        break;
      }
    }

    const code = traitsStr.substring(start, nextI);
    traits.push({ code });
    i = nextI;
  }

  return traits;
}
