/**
 * Parser error and warning messages
 * Based on VB5 UnitDataList.cls implementation
 */

/**
 * Fatal error messages (throw ParseError)
 */
export const ERROR_MESSAGES = {
  // Unit name validation
  NAME_HAS_SPACE: '名称に半角スペースは使用出来ません。',
  NAME_HAS_FULLWIDTH_PAREN: '名称に全角括弧は使用出来ません。',
  NAME_HAS_QUOTE: '名称に"は使用出来ません。',

  // File parsing errors
  UNEXPECTED_EOF: 'ファイルの終端に達しました。',
  MISSING_UNIT_PARAMS: '愛称の設定が抜けています。',
  INSUFFICIENT_PARAMS: '設定に抜けがあります。',
  EXTRA_COMMA: '余分な「,」があります。',
  INVALID_PARAMS_LINE: 'パラメータ行の形式が間違っています。',

  // Movement parameters
  MISSING_MOVEMENT_PARAMS: '移動力の設定が抜けています。',
  INSUFFICIENT_MOVEMENT_PARAMS: '移動可能地形、移動力、サイズ、修理費、経験値の設定が抜けています。',
  MISSING_SIZE: 'サイズの設定が抜けています。',
  MISSING_COST: '修理費の設定が抜けています。',
  MISSING_EXP: '経験値の設定が抜けています。',

  // Special abilities
  MISSING_ABILITIES_SECTION: '特殊能力の設定が抜けています。',
  INVALID_ABILITIES_FORMAT: '特殊能力の設定が抜けています。',

  // Stats
  MISSING_STATS_LINE: '最大ＨＰの設定が抜けています。',
  INSUFFICIENT_STATS: '最大ＨＰ、最大ＥＮ、装甲、運動性の設定が抜けています。',
  MISSING_EN: '最大ＥＮの設定が抜けています。',
  MISSING_ARMOR: '装甲の設定が抜けています。',
  MISSING_MOBILITY: '運動性の設定が抜けています。',

  // Adaptation and bitmap
  MISSING_ADAPTATION_LINE: '地形適応の設定が抜けています。',
  INSUFFICIENT_ADAPTATION_PARAMS: '地形適応、ビットマップの設定が抜けています。',
  MISSING_BITMAP: 'ビットマップの設定が抜けています。',

  // Weapon parameters
  WEAPON_NEEDS_EMPTY_LINE: '武器データの終りには空行を置いてください。',
  INSUFFICIENT_WEAPON_PARAMS: '武器のパラメータが抜けています。',
  MISSING_WEAPON_NAME: '武器名の設定が間違っています。',

  // Ability parameters
  ABILITY_NEEDS_EMPTY_LINE: 'アビリティデータの終りに空行を置いてください。',
  INSUFFICIENT_ABILITY_PARAMS: 'アビリティのパラメータが抜けています。',
  MISSING_ABILITY_NAME: 'アビリティ名の設定が間違っています。',

  // Map file errors
  MAP_FILE_EMPTY: 'マップファイルが空です。',
  MAP_MISSING_SIZE: 'マップサイズ情報がありません。',
  MAP_INVALID_SIZE: 'マップサイズの形式が不正です。',
  MAP_INVALID_SIZE_VALUE: 'マップサイズの値が不正です。',
  MAP_SIZE_OUT_OF_RANGE: 'マップサイズが不正です。',
  MAP_INSUFFICIENT_DATA: 'マップデータが不足しています。',
  MAP_EMPTY_TERRAIN_LINE: '空の地形データ行です。',
  MAP_INVALID_TERRAIN_FORMAT: '地形データの形式が不正です。',
  MAP_INVALID_TERRAIN_VALUE: '地形データの値が不正です。',

  // Terrain data file errors
  TERRAIN_FILE_EMPTY: '地形データファイルが空です。',
  TERRAIN_INVALID_ID: '地形番号が不正です。',
  TERRAIN_ID_OUT_OF_RANGE: '地形番号は0〜1999の範囲で指定してください。',
  TERRAIN_MISSING_NAME_LINE: '地形名称の設定が抜けています。',
  TERRAIN_INVALID_NAME_FORMAT: '地形名称の形式が不正です。',
  TERRAIN_MISSING_TYPE_LINE: '地形タイプの設定が抜けています。',
  TERRAIN_INVALID_TYPE_FORMAT: '地形タイプの形式が不正です。',
  TERRAIN_INVALID_TYPE: '地形タイプが不正です。',
  TERRAIN_INVALID_COST: '移動コストが不正です。',
  TERRAIN_INVALID_EVASION: '回避修正が不正です。',
  TERRAIN_INVALID_DAMAGE: 'ダメージ修正が不正です。',
} as const;

/**
 * Warning message templates (non-fatal, auto-corrected)
 */
export const WARNING_TEMPLATES = {
  // Unit class
  INVALID_UNIT_CLASS: 'ユニットクラスの設定が間違っています。',

  // Numeric fields with range validation
  INVALID_PILOT_NUM: 'パイロット数の設定が間違っています。',
  INVALID_ITEM_NUM: 'アイテム数の設定が間違っています。',
  INVALID_MOVEMENT_TYPE: '移動可能地形の設定が間違っています。',
  INVALID_SPEED: '移動力の設定が間違っています。',
  INVALID_SIZE: 'サイズの設定が間違っています。',
  INVALID_COST: '修理費の設定が間違っています。',
  INVALID_EXP: '経験値の設定が間違っています。',

  INVALID_HP: '最大ＨＰの設定が間違っています。',
  INVALID_EN: '最大ＥＮの設定が間違っています。',
  INVALID_ARMOR: '装甲の設定が間違っています。',
  INVALID_MOBILITY: '運動性の設定が間違っています。',

  INVALID_ADAPTATION: '地形適応の設定が間違っています。',
  INVALID_BITMAP: 'ビットマップの設定が間違っています。',

  // Weapon field warnings
  INVALID_WEAPON_POWER: (name: string) => `${name}の攻撃力の設定が間違っています。`,
  INVALID_WEAPON_MIN_RANGE: (name: string) => `${name}の最小射程の設定が間違っています。`,
  INVALID_WEAPON_MAX_RANGE: (name: string) => `${name}の最大射程の設定が間違っています。`,
  INVALID_WEAPON_ACCURACY: (name: string) => `${name}の命中率の設定が間違っています。`,
  INVALID_WEAPON_AMMO: (name: string) => `${name}の弾数の設定が間違っています。`,
  INVALID_WEAPON_EN: (name: string) => `${name}の消費ＥＮの設定が間違っています。`,
  INVALID_WEAPON_MORALE: (name: string) => `${name}の必要気力の設定が間違っています。`,
  INVALID_WEAPON_ADAPTATION: (name: string) => `${name}の地形適応の設定が間違っています。`,
  INVALID_WEAPON_CRITICAL: (name: string) => `${name}のクリティカル率の設定が間違っています。`,
  INVALID_WEAPON_TRAITS: (name: string) => `${name}の武器属性の設定が間違っています。`,
  WEAPON_TRAITS_HAS_LV: (name: string) => `${name}の属性のレベル指定が間違っています。`,

  // Ability field warnings
  INVALID_ABILITY_RANGE: (name: string) => `${name}の射程の設定が間違っています。`,
  INVALID_ABILITY_STOCK: (name: string) => `${name}の回数の設定が間違っています。`,
  INVALID_ABILITY_EN: (name: string) => `${name}の消費ＥＮの設定が間違っています。`,
  INVALID_ABILITY_MORALE: (name: string) => `${name}の必要気力の設定が間違っています。`,
  INVALID_ABILITY_TRAITS: (name: string) => `${name}のアビリティ属性の設定が間違っています。`,
  ABILITY_TRAITS_HAS_LV: (name: string) => `${name}の属性のレベル指定が間違っています。`,
} as const;

/**
 * Range validation message
 */
export function rangeWarning(fieldName: string, min: number, max: number, correctedValue: number): string {
  return `${fieldName}の設定が間違っています（${min}～${max}）。${correctedValue}に設定されました。`;
}

/**
 * Size validation message
 */
export function sizeWarning(correctedValue: string): string {
  return `サイズの設定が間違っています（XL, LL, L, M, S, SS）。${correctedValue}に設定されました。`;
}

/**
 * Adaptation validation message
 */
export function adaptationWarning(correctedValue: string): string {
  return `地形適応の設定が間違っています（4文字必要）。${correctedValue}に設定されました。`;
}

/**
 * Bitmap validation message
 */
export function bitmapWarning(correctedValue: string): string {
  return `ビットマップの設定が間違っています（.bmpファイルが必要）。${correctedValue}に設定されました。`;
}

/**
 * Summary message for warnings
 */
export function warningSummary(count: number): string {
  return `データ解析中に${count}件の警告が発生しました。`;
}
