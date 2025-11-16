
import React, { useState, useCallback } from 'react';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { optimizeResume } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [optimizedText, setOptimizedText] = useState<string>('');
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
    setOptimizedText('');

    try {
      const result = await optimizeResume(inputText, image, role);
      setOptimizedText(result);
    } catch (err) {
      setError('優化失敗，請稍後再試。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, image, role]);

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
          optimizedText={optimizedText}
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
