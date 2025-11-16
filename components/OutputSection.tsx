import React, { useState, useEffect } from 'react';

interface OutputSectionProps {
  optimizedText: string;
  isLoading: boolean;
  error: string | null;
}

const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25H9a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const getParsedParts = (text: string) => {
    const separator = '---';
    const separatorIndex = text.indexOf(separator);

    if (separatorIndex === -1) {
      return {
        chinesePart: text.trim(),
        englishPart: '',
      };
    }

    return {
      chinesePart: text.substring(0, separatorIndex).trim(),
      englishPart: text.substring(separatorIndex + separator.length).trim(),
    };
};

export const OutputSection: React.FC<OutputSectionProps> = ({ optimizedText, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const { chinesePart, englishPart } = getParsedParts(optimizedText);
    const chineseBlock = chinesePart ? `中文版本\n${chinesePart}` : '';
    const englishBlock = englishPart ? `英文版本\n${englishPart}` : '';

    const textToCopy = [chineseBlock, englishBlock].filter(Boolean).join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  useEffect(() => {
    setCopied(false);
  }, [optimizedText]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
          <p className="mt-4 text-gray-400">AI 正在為您打造專業履歷...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-400">
          <p>{error}</p>
        </div>
      );
    }

    if (!optimizedText) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4">優化後的內容將顯示在這裡</p>
        </div>
      );
    }
    
    const { chinesePart, englishPart } = getParsedParts(optimizedText);

    return (
      <div>
        {chinesePart && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teal-300 mb-2 pb-1 border-b border-gray-700">中文版本</h3>
            <div className="whitespace-pre-wrap text-gray-200">{chinesePart}</div>
          </div>
        )}
        {englishPart && (
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2 pb-1 border-b border-gray-700">英文版本</h3>
            <div className="whitespace-pre-wrap text-gray-200">{englishPart}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800/60 rounded-xl shadow-2xl p-6 flex flex-col border border-gray-700 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-300">優化結果</h2>
        {optimizedText && !isLoading && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200"
            title="複製到剪貼簿"
          >
            {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
            {copied ? '已複製！' : '複製'}
          </button>
        )}
      </div>
      <div className="flex-grow w-full p-4 bg-gray-900/70 border border-gray-600 rounded-md overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};