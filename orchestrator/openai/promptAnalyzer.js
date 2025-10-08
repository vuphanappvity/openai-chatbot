import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.info('Analyzer initialized...');

export async function analyzePrompt(prompt) {
  const detect = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Detect language and translate if not English.' },
      { role: 'user', content: prompt }
    ]
  });

  const response = detect.choices[0].message.content;
  // Simple heuristic
  return { translatedPrompt: response, language: response === prompt ? 'en' : 'non-en' };
}