import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Word } from '../models/word.model';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getMovieSentence(word: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Using the word '${word}', write a single, short, dramatic sentence that could be from a movie script.`,
      });
      return response.text.trim();
    } catch (error) {
      console.error('Error generating movie sentence:', error);
      throw new Error('Failed to generate a movie sentence.');
    }
  }

  async getEquivalentWord(word: string, targetLang: string): Promise<string> {
    if (!word) return '';
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `What is the single-word equivalent of the English word "${word}" in ${targetLang}? Provide only the single word translation, with no extra explanation or punctuation.`,
      });
      // Remove potential quotes or periods from the response.
      return response.text.trim().replace(/["'.]/g, '');
    } catch (error) {
      console.error(`Error getting equivalent word for "${word}":`, error);
      throw new Error(`Failed to get equivalent word for "${word}".`);
    }
  }

  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    if (!text) return '';
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following text from ${sourceLang} to ${targetLang}: "${text}"`,
      });
      return response.text.trim();
    } catch (error) {
      console.error('Error translating text:', error);
      throw new Error('Translation failed. Please try again.');
    }
  }
}