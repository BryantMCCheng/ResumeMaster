
import React, { useRef } from 'react';

interface InputSectionProps {
  inputText: string;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  role: string;
  onRoleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOptimize: () => void;
  isLoading: boolean;
  image: string | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.86a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.12-1.588H6.88a2.25 2.25 0 0 0-2.12 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
    </svg>
);
  
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const InputSection: React.FC<InputSectionProps> = ({ inputText, onInputChange, role, onRoleChange, onOptimize, isLoading, image, onImageChange, onImageRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-gray-800/60 rounded-xl shadow-2xl p-6 flex flex-col border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-teal-300">原始內容</h2>
      <p className="text-sm text-gray-400 mb-4">
        您可以直接貼上文字，或上傳您的履歷圖片 (PNG, JPG)。AI 會自動提取內容並進行優化。
      </p>
      
      {image ? (
        <div className="relative mb-4 border-2 border-dashed border-gray-600 rounded-lg p-2">
          <img src={image} alt="Resume preview" className="w-full h-auto max-h-48 object-contain rounded" />
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            aria-label="Remove image"
            disabled={isLoading}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageChange}
            accept="image/png, image/jpeg"
            className="hidden"
            disabled={isLoading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-600 hover:border-teal-400 bg-gray-900/50 hover:bg-gray-800/70 rounded-lg py-8 px-4 mb-4 transition-colors duration-200"
          >
            <ImageIcon className="h-10 w-10 text-gray-500" />
            <span className="text-gray-400 font-semibold">點擊此處上傳圖片</span>
            <span className="text-xs text-gray-500">支援 PNG, JPG 格式</span>
          </button>
        </>
      )}

      <div className="mb-4">
        <label htmlFor="role-input" className="block text-sm font-medium text-gray-300 mb-2">
            您的職位/領域 (Your Role/Field)
        </label>
        <input
            id="role-input"
            type="text"
            value={role}
            onChange={onRoleChange}
            placeholder="例如：資深前端工程師、產品經理、資料科學家"
            className="w-full p-3 bg-gray-900/70 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors duration-200 text-gray-200 placeholder-gray-500"
            disabled={isLoading}
        />
      </div>

      <textarea
        value={inputText}
        onChange={onInputChange}
        placeholder={image ? "可在此輸入補充說明或特定優化指令..." : "例如：我負責我們公司 App 的一個新功能開發，主要是用 Kotlin 和 Jetpack Compose。我有做一些效能調校，也處理了跟後端 API 的串接。還有，我也幫忙帶了幾個比較新的同事。"}
        className="w-full p-4 bg-gray-900/70 border border-gray-600 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors duration-200 resize-none text-gray-200 placeholder-gray-500"
        rows={image ? 3 : 10}
        disabled={isLoading}
      />
      <button
        onClick={onOptimize}
        disabled={isLoading || (!inputText.trim() && !image)}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            優化中...
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5"/>
            立即優化履歷
          </>
        )}
      </button>
    </div>
  );
};
