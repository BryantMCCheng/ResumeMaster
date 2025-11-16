
import React, { useState, useEffect } from 'react';
import { Suggestion } from '../services/geminiService';

interface OutputSectionProps {
  chineseResume: string;
  englishResume: string;
  suggestions: Suggestion[];
  appliedSuggestions: Set<string>;
  onToggleSuggestion: (suggestionId: string) => void;
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

const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.421-.622-2.735-1.546-3.82-2.682M12 21a7.5 7.5 0 0 1-7.5 0c-1.421-.622-2.735-1.546-3.82-2.682m15.14 0c-1.085 1.136-2.399 2.06-3.82 2.682m0 0a7.5 7.5 0 0 0-7.5 0M12 6.75a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
    </svg>
);


export const OutputSection: React.FC<OutputSectionProps> = ({ chineseResume, englishResume, suggestions, appliedSuggestions, onToggleSuggestion, isLoading, error }) => {
  const [copied, setCopied] = useState(false);
  const hasContent = chineseResume || englishResume;

  const handleCopy = () => {
    const chineseBlock = chineseResume ? `中文版本\n${chineseResume}` : '';
    const englishBlock = englishResume ? `英文版本\n${englishResume}` : '';
    
    // Also copy the text description of applied suggestions
    const appliedSuggestionsText = suggestions
        .filter(s => appliedSuggestions.has(s.id))
        .map(s => `- ${s.description_zh}\n- ${s.description_en}`)
        .join('\n');

    const suggestionsBlock = appliedSuggestionsText ? `已套用的改進建議\n${appliedSuggestionsText}` : '';

    const textToCopy = [chineseBlock, englishBlock, suggestionsBlock].filter(Boolean).join('\n\n');
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
  }, [chineseResume, englishResume, suggestions]);

  const renderHighlightedText = (fullText: string, lang: 'zh' | 'en') => {
    if (!fullText) return null;

    const activeSuggestions = suggestions.filter(s => appliedSuggestions.has(s.id));
    if (activeSuggestions.length === 0) {
        return fullText; // No highlights needed
    }

    const highlights = activeSuggestions
        .map(s => lang === 'zh' ? s.content_zh : s.content_en)
        // Sort by length descending to handle cases where one highlight is a substring of another
        .sort((a, b) => b.length - a.length);
    
    if (highlights.length === 0) {
        return fullText;
    }

    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const regex = new RegExp(`(${highlights.map(escapeRegExp).join('|')})`, 'g');
    const parts = fullText.split(regex);

    return parts.map((part, index) => {
        if (highlights.includes(part)) {
            return (
                <span key={index} className="bg-teal-500/20 text-teal-300 rounded px-1">
                    {part}
                </span>
            );
        }
        return part;
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
          <p className="mt-4 text-gray-400">AI 正在為您打造專業履歷...</p>
        </div>
      );
    }

    if (error && !hasContent) {
      return (
        <div className="flex items-center justify-center h-full text-red-400">
          <p>{error}</p>
        </div>
      );
    }

    if (!hasContent) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4">優化後的內容將顯示在這裡</p>
        </div>
      );
    }
    
    return (
      <>
        <div className="space-y-6">
            {chineseResume && (
            <div>
                <h3 className="text-lg font-semibold text-teal-300 mb-2 pb-1 border-b border-gray-700">中文版本</h3>
                <div className="whitespace-pre-wrap text-gray-200">{renderHighlightedText(chineseResume, 'zh')}</div>
            </div>
            )}
            {englishResume && (
            <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2 pb-1 border-b border-gray-700">英文版本</h3>
                <div className="whitespace-pre-wrap text-gray-200">{renderHighlightedText(englishResume, 'en')}</div>
            </div>
            )}
        </div>
        {suggestions.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-700">
             <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-300 mb-4">
                <LightbulbIcon className="h-6 w-6" />
                互動式改進建議
             </h3>
             <div className="space-y-3">
                {suggestions.map(suggestion => (
                    <div key={suggestion.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-600 flex items-start gap-3">
                        <input
                            type="checkbox"
                            id={`suggestion-${suggestion.id}`}
                            checked={appliedSuggestions.has(suggestion.id)}
                            onChange={() => onToggleSuggestion(suggestion.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-500 bg-gray-700 text-teal-500 focus:ring-teal-500 cursor-pointer"
                        />
                        <label htmlFor={`suggestion-${suggestion.id}`} className="flex-1 text-sm text-gray-300 cursor-pointer">
                            <p>{suggestion.description_zh}</p>
                            <p className="text-gray-400 mt-1">{suggestion.description_en}</p>
                        </label>
                    </div>
                ))}
             </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-gray-800/60 rounded-xl shadow-2xl p-6 flex flex-col border border-gray-700 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-300">優化結果</h2>
        {hasContent && !isLoading && (
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
        {error && hasContent && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
};
