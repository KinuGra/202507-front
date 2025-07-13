// aws-test時のdb.js
// export async function saveToDynamoDB(activity) {
//     const url = "https://s5kxdx6fgq2trehz625rfpicfa0cznak.lambda-url.us-east-1.on.aws/put";

//     try {
//         const response = await fetch(url, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(activity)
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Activity saved:", result);
//     } catch (error) {
//         console.error("Error saving activity:", error);
//     }
// }

// export async function fetchFromDynamoDB() {
//     const url = "https://s5kxdx6fgq2trehz625rfpicfa0cznak.lambda-url.us-east-1.on.aws/items";

//     try {
//         const response = await fetch(url, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Activities fetched:", result);
//         return result;
//     } catch (error) {
//         console.error("Error fetching activities:", error);
//         return [];
//     }
// }

// ===== /app/features/lambda/db.ts =====
import { v4 as uuidv4 } from "uuid";

const PUT_URL = "https://s5kxdx6fgq2trehz625rfpicfa0cznak.lambda-url.us-east-1.on.aws/put";
const GET_URL = "https://s5kxdx6fgq2trehz625rfpicfa0cznak.lambda-url.us-east-1.on.aws/items";

// 🔸 問題保存関数（Lambda PUT）
export async function saveToDynamoDB(data: {
  uuid?: string;
  question: string;
  answer: string;
}): Promise<void> {
  const payload = {
    uuid: data.uuid ?? uuidv4(), // uuid がなければ自動生成
    question: data.question,
    answer: data.answer,
  };

  try {
    const response = await fetch(PUT_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errText}`);
    }

    const result = await response.json();
    console.log("✅ 問題を保存しました:", result);
  } catch (error) {
    console.error("❌ 問題保存エラー:", error);
  }
}

// 🔸 問題取得関数（Lambda GET）
export async function fetchProblemsFromDynamoDB(): Promise<{
  uuid: string;
  question: string;
  answer: string;
}[]> {
  try {
    const response = await fetch(GET_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();

    // Lambda が { items: [...] } 形式で返す想定
    if (Array.isArray(result.items)) {
      return result.items;
    }

    // 旧形式: 配列が直接返ってくる場合の互換性対応
    if (Array.isArray(result)) {
      return result;
    }

    throw new Error("Unexpected response format");
  } catch (error) {
    console.error("❌ 問題取得エラー:", error);
    return [];
  }
}
