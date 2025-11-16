
import React, { useState, useCallback, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { optimizeResume, Suggestion } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [rawOptimizedText, setRawOptimizedText] = useState<string>('');
  
  const [baseChineseResume, setBaseChineseResume] = useState<string>('');
  const [baseEnglishResume, setBaseEnglishResume] = useState<string>('');
  const [displayChineseResume, setDisplayChineseResume] = useState<string>('');
  const [displayEnglishResume, setDisplayEnglishResume] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const handleOptimize = useCallback(async () => {
    if (!inputText.trim() && !image) {
      setError('請輸入您的工作內容或上傳履歷圖片。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRawOptimizedText('');
    setBaseChineseResume('');
    setBaseEnglishResume('');
    setSuggestions([]);
    setAppliedSuggestions(new Set());


    try {
      const result = await optimizeResume(inputText, image, role);
      setRawOptimizedText(result);
    } catch (err) {
      setError('優化失敗，請稍後再試。AI 可能傳回了無效的格式。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, image, role]);

  // Parse raw response from AI
  useEffect(() => {
    if (!rawOptimizedText) return;

    const suggestionSeparator = '|||';
    const resumeSeparator = '---';

    let resumePart = rawOptimizedText;
    let suggestionsJson = '[]';
  
    const suggestionIndex = rawOptimizedText.indexOf(suggestionSeparator);
    if (suggestionIndex !== -1) {
      resumePart = rawOptimizedText.substring(0, suggestionIndex).trim();
      suggestionsJson = rawOptimizedText.substring(suggestionIndex + suggestionSeparator.length).trim();
    }

    const resumeSeparatorIndex = resumePart.indexOf(resumeSeparator);
    const chinese = (resumeSeparatorIndex !== -1 ? resumePart.substring(0, resumeSeparatorIndex) : resumePart).trim();
    const english = (resumeSeparatorIndex !== -1 ? resumePart.substring(resumeSeparatorIndex + resumeSeparator.length) : '').trim();
    
    setBaseChineseResume(chinese);
    setBaseEnglishResume(english);

    try {
        const parsedSuggestions = JSON.parse(suggestionsJson);
        setSuggestions(Array.isArray(parsedSuggestions) ? parsedSuggestions : []);
    } catch (e) {
        console.error("Failed to parse suggestions JSON:", e);
        setSuggestions([]);
        setError("無法解析 AI 提供的建議，將只顯示優化後的履歷。")
    }
  }, [rawOptimizedText]);
  
  const applySuggestions = useCallback((
    baseText: string,
    lang: 'zh' | 'en'
  ): string => {
    if (appliedSuggestions.size === 0) return baseText;

    let newText = baseText;
    const activeSuggestions = suggestions.filter(s => appliedSuggestions.has(s.id));
  
    // 1. Apply ADD_SUMMARY first
    const summarySuggestion = activeSuggestions.find(s => s.type === 'ADD_SUMMARY');
    if (summarySuggestion) {
      const summaryContent = lang === 'zh' ? summarySuggestion.content_zh : summarySuggestion.content_en;
      newText = `${summaryContent}\n\n${newText}`;
    }
  
    // 2. Apply REPHRASE_BULLET
    const rephraseSuggestions = activeSuggestions.filter(s => s.type === 'REPHRASE_BULLET');
    for (const suggestion of rephraseSuggestions) {
      const targetTitle = lang === 'zh' ? suggestion.target_job_title_zh : suggestion.target_job_title_en;
      const targetBullet = lang === 'zh' ? suggestion.target_bullet_zh : suggestion.target_bullet_en;
      const newContent = lang === 'zh' ? suggestion.content_zh : suggestion.content_en;
  
      if (!targetTitle || !targetBullet || !newContent) continue;
      
      const jobSections = newText.split('\n\n**');
      const updatedSections = jobSections.map((section, index) => {
          const fullSectionTitle = (index > 0 ? '**' : '') + section.split('\n')[0];
          
          if (fullSectionTitle.includes(targetTitle)) {
              return section.replace(targetBullet, newContent);
          }
          return section;
      });
      newText = updatedSections.join('\n\n**');
    }
  
    return newText;
  }, [suggestions, appliedSuggestions]);


  // Re-calculate display text when suggestions change
  useEffect(() => {
    setDisplayChineseResume(applySuggestions(baseChineseResume, 'zh'));
    setDisplayEnglishResume(applySuggestions(baseEnglishResume, 'en'));
  }, [baseChineseResume, baseEnglishResume, appliedSuggestions, applySuggestions]);

  const handleToggleSuggestion = (suggestionId: string) => {
    setAppliedSuggestions(prev => {
        const newSet = new Set(prev);
        if (newSet.has(suggestionId)) {
            newSet.delete(suggestionId);
        } else {
            newSet.add(suggestionId);
        }
        return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
          AI 履歷優化達人
        </h1>
        <p className="text-center text-gray-400 mt-1 text-sm md:text-base">將您的工作經歷轉化為專業亮點</p>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InputSection
          inputText={inputText}
          onInputChange={(e) => setInputText(e.target.value)}
          role={role}
          onRoleChange={(e) => setRole(e.target.value)}
          onOptimize={handleOptimize}
          isLoading={isLoading}
          image={image}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
        />
        <OutputSection
          chineseResume={displayChineseResume}
          englishResume={displayEnglishResume}
          suggestions={suggestions}
          appliedSuggestions={appliedSuggestions}
          onToggleSuggestion={handleToggleSuggestion}
          isLoading={isLoading}
          error={error}
        />
      </main>

      <footer className="text-center p-4 text-gray-500 text-xs border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} Resume Optimizer. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
