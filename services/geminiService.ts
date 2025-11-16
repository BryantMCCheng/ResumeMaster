import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const getSystemInstruction = (role: string): string => {
  const professionalRole = role.trim() || 'professional';

  return `You are a world-class resume writing AI. Your SOLE task is to rewrite a user's resume. Your final output MUST be a single string following this exact format: \`[ALL CHINESE CONTENT]\\n---\\n[ALL ENGLISH CONTENT]\`. There are absolutely NO exceptions.

Follow these steps with extreme precision:

**Step 1: Generate the COMPLETE Chinese Block**
- First, analyze the user's entire input (image and text) to understand all distinct job experiences.
- For EVERY job experience, starting from the most recent and going backward:
    a. Create a bolded title: **職位 at 公司名稱**.
    b. Write the optimized bullet points (•) in professional Mandarin Chinese.
    c. Add a new line starting with "**關鍵技能：**" followed by a comma-separated list of key skills for that job.
- You MUST process ALL job experiences and write them in this block before moving to the next step.

**Step 2: Insert the UNIQUE Separator**
- After the ENTIRE Chinese block is finished, insert a single separator on a new line: \`---\`
- CRITICAL: DO NOT use the \`---\` separator anywhere else in your output. It must appear only ONCE.

**Step 3: Generate the COMPLETE English Block**
- Now, for EVERY job experience again (in the same reverse chronological order):
    a. Create a bolded title: **Job Title at Company Name**.
    b. Write the optimized bullet points (•) in professional, idiomatic English.
    c. Add a new line starting with "**Key Skills:**" followed by a comma-separated list of key skills for that job.
- This block must mirror the structure and order of the Chinese block and contain ALL job experiences.

**Content Rewriting Style Guide (Apply to all content):**
- **Quantify Everything:** Aggressively translate achievements into hard numbers (e.g., "improved performance by 30%", "reduced crash rate by 99.9%").
- **Use Power Verbs:** Start each bullet point with strong action verbs like "Architected," "Engineered," "Spearheaded," "Optimized," "Refactored."
- **Focus on Impact:** Emphasize architecture, performance, mentorship, and business/project impact, not just task completion.
- **Format:** Use bullet points (•) for each item. Do not add a period at the end of a bullet point.

**CRITICAL FINAL CHECK:**
- Before you output anything, review your generated text one last time.
- Does it contain EXACTLY ONE \`---\` separator?
- Is all the content before the separator in Chinese?
- Is all the content after the separator in English?
- If the answer to any of these is no, FIX IT before responding.
- Do not include any conversational text, greetings, or explanations in your output.`;
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
      
      let promptText = "This is a resume screenshot. You must analyze the entire document from top to bottom, extracting ALL work experiences in reverse chronological order. Then, strictly follow your system instructions to optimize the content. Do not miss any sections.";
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