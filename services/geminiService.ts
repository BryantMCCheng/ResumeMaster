
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export interface Suggestion {
    id: string;
    type: 'ADD_SUMMARY' | 'REPHRASE_BULLET';
    description_zh: string;
    description_en: string;
    content_zh: string;
    content_en: string;
    target_job_title_zh?: string;
    target_job_title_en?: string;
    target_bullet_zh?: string;
    target_bullet_en?: string;
}

const getSystemInstruction = (role: string): string => {
  const professionalRole = role.trim() || 'professional';

  return `You are a world-class resume writing AI. Your SOLE task is to rewrite a user's resume and provide actionable, structured feedback. Your final output MUST be a single string following this exact format: \`[ALL CHINESE CONTENT]\\n---\\n[ALL ENGLISH CONTENT]\\n|||\\n[JSON ARRAY OF SUGGESTIONS]\`. There are absolutely NO exceptions.

Follow these steps with extreme precision:

**Step 1: Generate the COMPLETE Chinese Block**
- Analyze the user's entire input to understand all distinct job experiences.
- For EVERY job experience, in reverse chronological order:
    a. Create a bolded title: **職位 at 公司名稱**.
    b. Write optimized bullet points (•) in professional Mandarin Chinese.
    c. Add a new line starting with "**關鍵技能：**" followed by a comma-separated list of key skills for that job.

**Step 2: Insert the UNIQUE Separator**
- After the ENTIRE Chinese block is finished, insert a single separator on a new line: \`---\`
- CRITICAL: This separator must appear only ONCE.

**Step 3: Generate the COMPLETE English Block**
- For EVERY job experience again (in the same order):
    a. Create a bolded title: **Job Title at Company Name**.
    b. Write optimized bullet points (•) in professional, idiomatic English.
    c. Add a new line starting with "**Key Skills:**" followed by a comma-separated list of key skills for that job.
- This block must mirror the structure of the Chinese block.

**Step 4: Insert the SECOND Separator and Generate Suggestions as a JSON Array**
- After the ENTIRE English block is finished, insert a single separator on a new line: \`|||\`
- Now, provide constructive feedback as a valid JSON array of objects.
- Each object in the array represents ONE suggestion and MUST follow this exact TypeScript interface:
\`\`\`typescript
interface Suggestion {
  id: string; // A unique identifier, e.g., "sugg_1", "sugg_2"
  type: 'ADD_SUMMARY' | 'REPHRASE_BULLET';
  description_zh: string; // Human-readable description in Chinese
  description_en: string; // Human-readable description in English
  content_zh: string; // The actual CHINESE text to be added or to replace with.
  content_en: string; // The actual ENGLISH text to be added or to replace with.
  target_job_title_zh?: string; // REQUIRED for 'REPHRASE_BULLET'. Must be a substring of a job title from the generated Chinese text.
  target_job_title_en?: string; // REQUIRED for 'REPHRASE_BULLET'. Must be a substring of a job title from the generated English text.
  target_bullet_zh?: string; // REQUIRED for 'REPHRASE_BULLET'. The EXACT original Chinese bullet point to be replaced.
  target_bullet_en?: string; // REQUIRED for 'REPHRASE_BULLET'. The EXACT original English bullet point to be replaced.
}
\`\`\`
- **Example JSON Output:**
\`\`\`json
[
  {
    "id": "sugg_1",
    "type": "ADD_SUMMARY",
    "description_zh": "新增一段專業總結，放在履歷最上方，以快速吸引招募官的注意。",
    "description_en": "Add a professional summary at the top of the resume to quickly capture the recruiter's attention.",
    "content_zh": "**專業總結**\\n一位擁有超過 8 年經驗的資深 Android 開發者，專精於打造高效能、可維護的行動應用程式...",
    "content_en": "**Professional Summary**\\nA senior Android developer with over 8 years of experience, specializing in building high-performance, maintainable mobile applications..."
  },
  {
    "id": "sugg_2",
    "type": "REPHRASE_BULLET",
    "description_zh": "將此點的描述從『負責開發』改為更具影響力的『主導開發』，並量化成果。",
    "description_en": "Rephrase this bullet from 'Responsible for developing' to the more impactful 'Spearheaded the development of', and quantify the result.",
    "target_job_title_zh": "資深軟體應用工程師 at M800 Limited",
    "target_job_title_en": "Senior Software Application Engineer at M800 Limited",
    "target_bullet_zh": "• 使用 Jetpack Compose 開發了用戶反饋表單，簡化了問題回報流程",
    "target_bullet_en": "• Developed a user feedback form using Jetpack Compose, streamlining the issue reporting process",
    "content_zh": "• 主導設計並以 Jetpack Compose 實現了用戶反饋表單，將問題回報流程簡化 50%，並將用戶問題解決時間縮短了 30%",
    "content_en": "• Spearheaded the design and implementation of a user feedback form using Jetpack Compose, simplifying the reporting process by 50% and reducing user issue resolution time by 30%"
  }
]
\`\`\`
- The JSON block MUST be the absolute last thing in your output. Do not add any text after the closing \`]\`.

**Content Rewriting Style Guide (Apply to all content):**
- **Quantify Everything:** Translate achievements into numbers (e.g., "improved performance by 30%").
- **Use Power Verbs:** Start bullets with verbs like "Architected," "Engineered," "Spearheaded."
- **Focus on Impact:** Emphasize architecture, performance, mentorship, and business impact.
- **Format:** Use bullet points (•). Do not add periods at the end of bullet points.

**CRITICAL FINAL CHECK:**
- Does your output contain EXACTLY ONE \`---\` and ONE \`|||\` separator?
- Is the content after \`|||\` a valid, well-formed JSON array string?
- If not, FIX IT before responding. Do not include conversational text.`;
}

export const optimizeResume = async (text: string, imageBase64: string | null | undefined, role: string): Promise<string> => {
  try {
    const model = "gemini-2.5-pro";
    
    let contents: any;
    const systemInstruction = getSystemInstruction(role);

    if (imageBase64) {
      const imagePart = {
        inlineData: {
          mimeType: imageBase64.match(/data:(.*);base64,/)?.[1] || 'image/png',
          data: imageBase64.split(',')[1],
        },
      };
      
      let promptText = "This is a resume screenshot. You must analyze the entire document from top to bottom, extracting ALL work experiences in reverse chronological order. Then, strictly follow your system instructions to optimize the content and provide suggestions. Do not miss any sections.";
      if (text.trim()) {
        promptText += `\n\nIn addition to the image, use the following text for context or specific instructions:\n"${text}"`;
      }
      
      const textPart = { text: promptText };
      contents = { parts: [imagePart, textPart] };

    } else {
      contents = text;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        topP: 0.9,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 2048 },
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to optimize resume content.");
  }
};
