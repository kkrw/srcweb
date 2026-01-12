import type { EventState } from "./EventState";
import { createEventState } from "./EventState";
import type { MapData } from "./MapData";

/**
 * ゲーム全体の進行状況を管理するデータモデル
 *
 * シナリオの進行状態、ターン数、資金などのグローバルな情報を保持します。
 */
export interface GameState {
  /**
   * シナリオファイル名
   * 現在実行中のイベントファイル（.eve）のパス
   */
  scenarioFileName: string;

  /**
   * フェイズ名
   * 現在のターン進行状態
   * 例: "味方", "敵", "NPC"
   */
  phase: string;

  /**
   * 次のステージ
   * SetVariableAsString "次ステージ" で管理されるシステム変数
   */
  nextStage: string;

  /**
   * 現在のターン数
   */
  turn: number;

  /**
   * 総ターン数
   * ゲーム開始からの累計ターン数
   */
  totalTurn: number;

  /**
   * 総資金
   * プレイヤーが所持している資金
   */
  money: number;

  /**
   * 読込データセット名のリスト
   * Include コマンドで読み込まれたデータセット名
   * セーブデータの互換性チェックに使用されます
   */
  loadedDatasets: string[];

  /**
   * 乱数シード
   * 再現性を保証するための乱数シード値
   */
  rndSeed: number;

  /**
   * 乱数位置
   * 乱数系列の現在の参照位置
   */
  rndIndex: number;

  /**
   * 現在のマップデータ
   * ゲーム中のマップ状態を保持します
   */
  currentMap: MapData | null;

  /**
   * イベント実行状態
   * イベントスクリプトの実行状態を管理します
   */
  eventState: EventState;
}

/**
 * GameState のファクトリ関数
 */
export function createGameState(params: Partial<GameState> = {}): GameState {
  return {
    scenarioFileName: params.scenarioFileName || "",
    phase: params.phase || "",
    nextStage: params.nextStage || "",
    turn: params.turn || 0,
    totalTurn: params.totalTurn || 0,
    money: params.money || 0,
    loadedDatasets: params.loadedDatasets || [],
    rndSeed: params.rndSeed || 0,
    rndIndex: params.rndIndex || 0,
    currentMap: params.currentMap || null,
    eventState: params.eventState || createEventState(),
  };
}
