import { useEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

// 開発環境でのみインポート
const isDevelopment = import.meta.env.DEV;

// StrictMode による再マウントでもテストが1回だけ実行されるように
// グローバル変数で管理（コンポーネントインスタンス間で共有）
let testsExecuted = false;

function App() {
  const [count, setCount] = useState(0);
  const [healthStatus, setHealthStatus] = useState("");
  const [testStatus, setTestStatus] = useState("Tests not run yet");

  const checkHealth = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/health");
      const data = await response.json();
      setHealthStatus(`API Status: ${data.status}`);
    } catch (error) {
      setHealthStatus("API Error" + error);
    }
  };

  // 開発環境でIndexedDBテストを自動実行
  // StrictModeによる再マウントでも1回だけ実行されるようグローバル変数を使用
  useEffect(() => {
    if (isDevelopment && !testsExecuted) {
      testsExecuted = true;
      console.log("Running IndexedDB manual tests in development mode...");
      setTestStatus("Running tests...");

      // 動的にテストをインポートして実行
      import("./__tests__/db/manual-test")
        .then((testModule) => {
          return testModule.runAllTests();
        })
        .then(() => {
          setTestStatus("✅ Tests completed! Check console for details.");
          console.log(
            "%cTests completed successfully!",
            "color: green; font-weight: bold"
          );
        })
        .catch((error) => {
          setTestStatus("❌ Tests failed! Check console for details.");
          console.error("Test execution failed:", error);
        });
    }
  }, []); // 空の依存配列で、マウント時のみ実行

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={checkHealth}>Check API Health</button>
        <p>{healthStatus}</p>
        {isDevelopment && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#f0f0f0",
              borderRadius: "5px",
            }}
          >
            <strong>IndexedDB Tests:</strong> {testStatus}
          </div>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
