import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { AiConfig, ResponseLength, ResponseTone, ResponseLanguage } from '../ai-config/entities/ai-config.entity';

@Injectable()
export class GroqService {
  private client: Groq;

  constructor(private config: ConfigService) {
    this.client = new Groq({
      apiKey: this.config.get<string>('GROQ_API_KEY'),
    });
  }

  async generateResponse(
    question: string,
    category: string,
    experimentTitle: string,
    experimentStep: string,
    learnerLevel: string,
    aiConfig?: AiConfig,
  ): Promise<string> {
    const language = aiConfig?.language === ResponseLanguage.FRENCH ? 'French' : 'English';

    const lengthInstruction =
      aiConfig?.responseLength === ResponseLength.SHORT ? 'Keep your response brief and to the point (2-3 sentences max).' :
      aiConfig?.responseLength === ResponseLength.DETAILED ? 'Provide a comprehensive, detailed explanation with examples.' :
      'Provide a clear, balanced response of moderate length.';

    const toneInstruction =
      aiConfig?.tone === ResponseTone.FORMAL ? 'Use formal academic language.' :
      aiConfig?.tone === ResponseTone.SOCRATIC ? 'Do not give direct answers. Instead ask guiding questions that lead the student to discover the answer themselves.' :
      'Use a friendly, encouraging tone.';

    const directAnswerInstruction = aiConfig?.allowDirectAnswers === false
      ? 'Do not give direct answers. Guide the student step by step without revealing the final answer.'
      : '';

    const customInstruction = aiConfig?.customInstructions
      ? `Additional teacher instructions: ${aiConfig.customInstructions}`
      : '';

    const systemPrompt = `You are AIPASS, an AI assistant for remote laboratory learners.
Always respond in ${language}.
${lengthInstruction}
${toneInstruction}
${directAnswerInstruction}
${customInstruction}
Student proficiency level: ${learnerLevel}.
- BEGINNER: simplified explanations, step-by-step guidance.
- INTERMEDIATE: moderate guidance, some independent reasoning expected.
- ADVANCED: concise, high-level explanations.
Current experiment: ${experimentTitle}.
Current step: ${experimentStep}.`;

    const response = await this.client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Category: ${category}\nQuestion: ${question}` },
      ],
      max_tokens:
        aiConfig?.responseLength === ResponseLength.SHORT ? 150 :
        aiConfig?.responseLength === ResponseLength.DETAILED ? 800 : 500,
    });

    return response.choices[0]?.message?.content || 'Unable to generate response.';
  }

  async consultTeacher(
    teacherQuestion: string,
    studentQuestion: string,
    draftResponse: string,
    learnerLevel: string,
    experimentTitle: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<string> {
    const systemPrompt = `You are an expert educational assistant and pedagogical advisor helping a university teacher make informed decisions about AI-generated remote laboratory support responses.

Context:
- Experiment: ${experimentTitle}
- Student proficiency level: ${learnerLevel}
- Student question: "${studentQuestion}"
- AI draft response:
"""
${draftResponse}
"""

Your role is to help the teacher by:
- Evaluating the pedagogical quality of the AI draft response
- Suggesting better teaching strategies, analogies, or explanations
- Identifying common misconceptions students have about this topic
- Advising whether to approve, edit, or reject the response
- Providing subject matter expertise about the experiment topic
- Recommending how to guide a student at the ${learnerLevel} level

Be concise, practical, and focused on helping the teacher make the best decision for the student's learning. Never rewrite the response for the teacher — only give advice and guidance.`;

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: teacherQuestion },
    ];

    const response = await this.client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 600,
    });

    return response.choices[0]?.message?.content || 'Unable to generate consultation response.';
  }
}