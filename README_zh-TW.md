<div align="center">

# 🚀 AI 履歷優化達人

<img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini">

**將您的工作經歷轉化為專業亮點的 AI 助手**

[English](./README.md) | 正體中文

</div>

---

## ✨ 功能特色

- 🤖 **AI 驅動優化** - 整合 Google Gemini 2.5 Pro，智慧重寫履歷內容
- 🌐 **雙語輸出** - 一次輸入，同時產生專業的中英文版本
- 📸 **圖片識別** - 支援上傳履歷截圖，AI 自動擷取並優化內容
- 💡 **互動式建議** - 提供可選擇套用的改進建議，包含新增摘要與重述要點
- 📋 **一鍵複製** - 快速複製優化後的內容到剪貼簿
- 🎨 **現代化介面** - 採用 TailwindCSS 打造的深色主題響應式設計

---

## 🖼️ 功能展示

### 主要功能

| 功能 | 說明 |
|------|------|
| **文字輸入** | 直接貼上您的工作經歷描述 |
| **圖片上傳** | 支援 PNG、JPG 格式的履歷截圖 |
| **職位/領域設定** | 指定您的目標職位以獲得更精準的優化 |
| **互動式建議** | 透過勾選方式即時套用 AI 提供的改進建議 |

---

## 🛠️ 技術架構

```
ResumeMaster/
├── App.tsx                 # 主應用程式元件
├── index.html             # HTML 入口點
├── index.tsx              # React 應用程式進入點
├── components/
│   ├── InputSection.tsx   # 輸入區塊元件（文字/圖片/職位）
│   └── OutputSection.tsx  # 輸出區塊元件（雙語結果/建議）
├── services/
│   └── geminiService.ts   # Google Gemini API 服務層
├── package.json           # 專案配置與依賴項
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 建構工具配置
```

### 核心技術

- **前端框架**: React 19.2
- **建構工具**: Vite 6.2
- **程式語言**: TypeScript 5.8
- **樣式框架**: TailwindCSS
- **AI 服務**: Google Gemini 2.5 Pro (@google/genai)

---

## 🚀 快速開始

### 環境需求

- Node.js 18.0 或更高版本
- npm 或 yarn 套件管理器
- Google Gemini API 金鑰

### 安裝步驟

1. **複製專案**
   ```bash
   git clone https://github.com/your-username/ResumeMaster.git
   cd ResumeMaster
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定環境變數**
   
   在專案根目錄建立 `.env.local` 檔案：
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

5. **開啟瀏覽器**
   
   訪問 `http://localhost:5173` 即可使用

---

## 📖 使用說明

### 基本使用流程

1. **輸入內容**
   - 在左側輸入區塊貼上您的工作經歷描述
   - 或點擊上傳區域選擇履歷截圖

2. **設定職位（選填）**
   - 填入您的目標職位或領域，例如：「資深前端工程師」、「產品經理」

3. **開始優化**
   - 點擊「立即優化履歷」按鈕

4. **檢視結果**
   - 右側將顯示優化後的中英文版本
   - 查看下方的「互動式改進建議」

5. **套用建議**
   - 勾選您想要套用的建議，內容會即時更新
   - 被套用的內容會以高亮顯示

6. **複製內容**
   - 點擊「複製」按鈕將優化結果複製到剪貼簿

---

## 🔧 開發指令

```bash
# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

---

## 📝 AI 優化原則

履歷優化達人遵循以下專業原則：

- **量化成果**: 將成就轉換為具體數據（例如：「效能提升 30%」）
- **使用強力動詞**: 以「架構」、「主導」、「工程化」等動詞開頭
- **聚焦影響力**: 強調架構設計、效能優化、團隊領導與商業價值
- **專業格式**: 使用項目符號，保持簡潔有力

---

## 📄 授權條款

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

---

## 🙏 致謝

- [Google Gemini](https://ai.google.dev/) - 提供強大的 AI 模型支援
- [React](https://react.dev/) - 現代化的前端框架
- [Vite](https://vitejs.dev/) - 快速的建構工具
- [TailwindCSS](https://tailwindcss.com/) - 實用優先的 CSS 框架

---

<div align="center">

**⭐ 如果這個專案對您有幫助，歡迎給予一顆星星！**

</div>
