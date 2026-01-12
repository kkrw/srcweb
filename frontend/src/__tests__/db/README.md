# IndexedDB Manual Tests

IndexedDB の動作確認用のマニュアルテストです。

## 概要

このテストファイルは、ブラウザの Console で IndexedDB の動作を確認するためのものです。
開発環境（`npm run dev`）では、アプリケーション起動時に自動実行されます。

## 実行方法

### 自動実行（推奨）

開発サーバーを起動すると、自動的にテストが実行されます。

```bash
cd frontend
npm run dev
```

ブラウザを開いて http://localhost:5173 にアクセスすると、Console にテスト結果が表示されます。

### 手動実行

Console から手動でテストを実行することもできます。

```javascript
// ブラウザの Console で実行
import('./db/__tests__/manual-test').then(m => m.runAllTests());
```

## テスト内容

### Test 1: DB Initialization & Schema Verification

データベースの初期化とスキーマの検証を行います。

- ✅ データベースの初期化
- ✅ データベース名の検証（`kkrw.srcweb-engine`）
- ✅ データベースバージョンの検証（`1`）
- ✅ ObjectStore の存在確認（5つのテーブル）
- ✅ 全テーブルのインデックス検証
  - saveData: by_scenarioId, by_timestamp
  - scenarioCache: by_fetchedAt
  - assetCache: by_scenarioId, by_expiresAt
  - userSettings: (インデックスなし)
  - downloadProgress: by_scenarioId, by_status, by_scenarioId_type

### Test 2: CRUD Operations

基本的な CRUD 操作のテストを行います。

- ✅ CREATE: レコードの作成
  - SaveData
  - UserSettings
  - AssetCache
- ✅ READ: レコードの読み取り
  - 主キーによる取得
  - インデックスによるクエリ
- ✅ UPDATE: レコードの更新
- ✅ DELETE: レコードの削除

### Test 3: Zod Validation

Zod バリデーションのテストを行います。

- ✅ 有効なデータのバリデーション
  - SaveData
  - UserSettings
  - AssetCache
- ✅ 無効なデータのバリデーション
  - 必須フィールドの欠落
  - 型エラー
  - 範囲エラー

## テスト結果の見方

### Console 出力

テストが実行されると、Console に以下のような出力が表示されます：

```
🧪 IndexedDB Manual Tests Starting...
Open the browser console to view detailed results.

============================================================
Test 1: DB Initialization & Schema Verification
============================================================
✅ DB Initialization
   Database initialized successfully
✅ Database Name
   Database name is correct: "kkrw.srcweb-engine"
✅ Database Version
   Database version is correct: 1
...
```

### アイコンの意味

- ✅ テスト成功（緑色）
- ❌ テスト失敗（赤色）

### サマリー

全テストの実行後、以下のようなサマリーが表示されます：

```
============================================================
Test Summary
============================================================
Total Tests: 35
Passed: 35
Failed: 0

✅ All tests passed!
```

## トラブルシューティング

### テストが実行されない

- ブラウザの Console を開いているか確認してください
- 開発サーバーが起動しているか確認してください（`npm run dev`）
- Console にエラーメッセージが表示されていないか確認してください

### テストが失敗する

- IndexedDB がブラウザでサポートされているか確認してください
- ブラウザのプライベートモードでは IndexedDB が制限されている場合があります
- 既存のデータベースをクリアしてから再実行してください：
  ```javascript
  // Console で実行
  import('./db/index').then(m => m.deleteDatabase()).then(() => location.reload());
  ```

### データベースをクリアしたい

開発中にデータベースをリセットしたい場合：

```javascript
// Console で実行
import('./db/index').then(m => m.clearAllTables());
// または
import('./db/index').then(m => m.deleteDatabase()).then(() => location.reload());
```

## 本番環境での動作

本番環境（`npm run build`）では、テストは自動実行されません。
開発環境でのみ実行されます。

## カスタマイズ

テストを追加・変更する場合は、`manual-test.ts` を編集してください。

### 新しいテストの追加

```typescript
export async function testMyFeature(): Promise<void> {
  logTestSection("Test 4: My Feature");

  try {
    // テストコードをここに記述
    logTestResult("My Test", true, "Test passed");
  } catch (error) {
    logTestResult("My Test", false, "Test failed", error as Error);
  }
}

// runAllTests() に追加
export async function runAllTests(): Promise<void> {
  // ...
  await testDBInitialization();
  await testCRUDOperations();
  await testZodValidation();
  await testMyFeature(); // 追加
  // ...
}
```

## 参考

- [Dexie.js Documentation](https://dexie.org/)
- [Zod Documentation](https://zod.dev/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
