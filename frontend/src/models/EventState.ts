import type { HotPoint } from "./HotPoint";

/**
 * イベント実行状態のデータモデル
 *
 * イベントスクリプトの実行状態を管理します。
 * 中断セーブや状態復元のために必要な情報を保持します。
 */
export interface EventState {
  /**
   * グローバル変数
   * ユーザー定義変数（フラグ等）を Key-Value 形式で管理
   */
  globalVariables: Map<string, string | number>;

  /**
   * ローカル変数
   * イベント実行中の一時変数
   * 中断セーブに含まれます
   */
  localVariables: Map<string, string | number>;

  /**
   * イベントラベルの状態
   * 各イベントラベルの有効/無効（Enable）状態
   * 一度しか起きないイベントの管理に使用
   */
  eventLabels: Map<string, boolean>;

  /**
   * 追加イベントファイル名のリスト
   * Require コマンドで動的に読み込まれたイベントファイル
   */
  additionalEventFiles: string[];

  /**
   * ホットポイントのリスト
   * マップ上のクリック可能領域
   */
  hotPoints: HotPoint[];

  /**
   * 現在の実行行番号
   * スクリプトのどこまで実行したか
   */
  currentLineNum: number;

  /**
   * コールスタック
   * Call コマンドでサブルーチンに飛んでいる場合の戻り先行番号
   */
  callStack: number[];

  /**
   * 呼び出し階層の深さ
   * 現在のネストの深さ
   */
  callDepth: number;

  /**
   * 引数スタック
   * サブルーチンに渡された引数の状態
   */
  argStack: (string | number)[];

  /**
   * ローカル変数スタック
   * サブルーチン内で定義されたローカル変数の状態
   */
  varStack: Map<string, string | number>[];

  /**
   * Forループカウンタスタック
   * For ループの現在のカウンタ値
   */
  forIndexStack: number[];

  /**
   * Forループ上限スタック
   * For ループの終了条件値
   */
  forLimitStack: number[];

  /**
   * ForEachインデックス
   * ForEach ループの現在位置
   */
  forEachIndex: number;

  /**
   * ForEachセット
   * ForEach ループで使用しているコレクション
   */
  forEachSet: string[];
}

/**
 * EventState のファクトリ関数
 */
export function createEventState(params: Partial<EventState> = {}): EventState {
  return {
    globalVariables: params.globalVariables || new Map(),
    localVariables: params.localVariables || new Map(),
    eventLabels: params.eventLabels || new Map(),
    additionalEventFiles: params.additionalEventFiles || [],
    hotPoints: params.hotPoints || [],
    currentLineNum: params.currentLineNum || 0,
    callStack: params.callStack || [],
    callDepth: params.callDepth || 0,
    argStack: params.argStack || [],
    varStack: params.varStack || [],
    forIndexStack: params.forIndexStack || [],
    forLimitStack: params.forLimitStack || [],
    forEachIndex: params.forEachIndex || 0,
    forEachSet: params.forEachSet || [],
  };
}
