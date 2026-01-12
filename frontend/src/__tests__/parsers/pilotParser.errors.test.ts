import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ParseError } from "../../parsers/ParseResult";
import { parsePilotFile } from "../../parsers/pilotParser";
import { decodeShiftJIS } from "../../parsers/utils";

describe("Pilot Parser", () => {
  // ==========================================================================
  // エラーケース
  // ==========================================================================
  describe("エラーケース", () => {
    const readErrorFile = (filename: string): string => {
      return decodeShiftJIS(
        readFileSync(join(__dirname, "fixtures", "error_pilots", filename))
      );
    };

    it("愛称が空の場合エラー", () => {
      const text = readErrorFile("error_empty_nickname.txt");
      const result = parsePilotFile(text, "error_empty_nickname.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("愛称の設定が抜けています");
        expect(parseError.lineNumber).toBe(6); // 実際のデータ行
      }
    });

    it("パラメータ行のフィールド不足の場合エラー", () => {
      const text = readErrorFile("error_missing_fields.txt");
      const result = parsePilotFile(text, "error_missing_fields.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("設定に抜けがあります");
        expect(parseError.lineNumber).toBe(6);
      }
    });

    it("余分なカンマ（7フィールド以上）の場合エラー", () => {
      const text = readErrorFile("error_extra_comma.txt");
      const result = parsePilotFile(text, "error_extra_comma.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("余分な「,」があります");
        expect(parseError.lineNumber).toBe(6);
      }
    });

    it("特殊能力行がない場合エラー", () => {
      const text = readErrorFile("error_missing_skill_section.txt");
      const result = parsePilotFile(text, "error_missing_skill_section.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("特殊能力の設定が抜けています");
        expect(parseError.lineNumber).toBe(7);
      }
    });

    it("ステータス行のフィールド不足の場合エラー", () => {
      const text = readErrorFile("error_missing_stats.txt");
      const result = parsePilotFile(text, "error_missing_stats.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("設定に抜けがあります");
        expect(parseError.lineNumber).toBe(8);
      }
    });

    it("SP行がない場合エラー", () => {
      const text = readErrorFile("error_missing_sp_line.txt");
      const result = parsePilotFile(text, "error_missing_sp_line.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain(
          "スペシャルパワーの設定が抜けています"
        );
        expect(parseError.lineNumber).toBe(9);
      }
    });

    it("MIDI設定がない場合エラー", () => {
      const text = readErrorFile("error_missing_midi.txt");
      const result = parsePilotFile(text, "error_missing_midi.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("ＭＩＤＩの設定が抜けています");
        expect(parseError.lineNumber).toBe(10);
      }
    });

    it("名称にスペースが含まれる場合エラー", () => {
      const text = readErrorFile("error_name_has_space.txt");
      const result = parsePilotFile(text, "error_name_has_space.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain(
          "名称に半角スペースを使うことは出来ません"
        );
        expect(parseError.lineNumber).toBe(5);
      }
    });

    it("名称に全角括弧が含まれる場合エラー", () => {
      const text = readErrorFile("error_name_has_fullwidth_paren.txt");
      const result = parsePilotFile(text, "error_name_has_fullwidth_paren.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("全角括弧");
        expect(parseError.lineNumber).toBe(5);
      }
    });

    it("名称にダブルクォートが含まれる場合エラー", () => {
      const text = readErrorFile("error_name_has_quote.txt");
      const result = parsePilotFile(text, "error_name_has_quote.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("ダブルクオート");
        expect(parseError.lineNumber).toBe(5);
      }
    });

    it("名称にカンマが含まれる場合エラー", () => {
      const text = readErrorFile("error_name_has_comma.txt");
      const result = parsePilotFile(text, "error_name_has_comma.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("名称の設定が抜けています");
        expect(parseError.lineNumber).toBe(5);
      }
    });

    it("SP値がない場合エラー", () => {
      const text = readErrorFile("error_missing_sp_value.txt");
      const result = parsePilotFile(text, "error_missing_sp_value.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("ＳＰ値の設定が抜けています");
        expect(parseError.lineNumber).toBe(9);
      }
    });

    it("行継続後のステータス行でフィールド不足エラー - 正しい行番号", () => {
      const text = readErrorFile("error_line_continuation_stats.txt");
      const result = parsePilotFile(text, "error_line_continuation_stats.txt");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
        const parseError = result.error as ParseError;
        expect(parseError.message).toContain("設定に抜けがあります");
        // 継続行を含む論理行の開始行番号
        expect(parseError.lineNumber).toBe(9);
      }
    });

    it("エラー発生後、後続データはパースされない", () => {
      const text = readErrorFile("error_empty_nickname.txt");
      const result = parsePilotFile(text, "error_empty_nickname.txt");

      // エラーで終了
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ParseError);
      }
      // データは返されない（後続の正常パイロットもパースされない）
    });
  });
});
