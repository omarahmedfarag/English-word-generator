import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Word } from '../models/word.model';

@Injectable({ providedIn: 'root' })
export class DictionaryService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  private intermediateWords = [
    'achieve', 'benefit', 'concept', 'deduce', 'establish', 'factor', 'indicate', 'legislate', 'perceive', 'require',
    'significant', 'variable', 'acquire', 'culture', 'economy', 'finance', 'individual', 'method', 'policy', 'role',
    'structure', 'tradition', 'analyze', 'assume', 'context', 'create', 'derive', 'evident', 'identify', 'major',
    'proceed', 'research', 'section', 'source', 'specific'
  ];

  private advancedWords = [
    'ambiguous', 'juxtaposition', 'ephemeral', 'ubiquitous', 'erudite', 'magnanimous', 'ostracize', 'paradigm', 'quixotic', 'sesquipedalian',
    'abnegation', 'conundrum', 'demagogue', 'exacerbate', 'gregarious', 'idiosyncratic', 'laudable', 'nefarious', 'obfuscate', 'pulchritudinous',
    'recalcitrant', 'sycophant', 'vicissitude', 'zephyr', 'alacrity', 'cognizant', 'ebullient', 'fastidious', 'hegemony', 'impetuous',
    'kowtow', 'loquacious', 'mawkish', 'nonplussed', 'obsequious'
  ];

  async generateWord(level: 'Intermediate' | 'Advanced'): Promise<Omit<Word, 'arabicEquivalent'>> {
    const wordList = level === 'Intermediate' ? this.intermediateWords : this.advancedWords;
    // Get a word that hasn't been used recently if possible, simple random for now
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

    try {
      const response = await firstValueFrom(this.http.get<any[]>(`${this.API_URL}${randomWord}`));
      const data = response[0];
      const meaning = data.meanings[0];
      const definition = meaning.definitions[0];

      return {
        word: data.word,
        level: level,
        definition: definition.definition,
        // Provide a fallback sentence if the API doesn't return one
        sentence: definition.example || `The word "${data.word}" is often used in various contexts.`
      };
    } catch (error) {
      console.error(`Could not fetch details for word: ${randomWord}`, error);
      // Provide a fallback in case the API fails for a specific word
      return {
        word: randomWord,
        level: level,
        definition: 'Could not load definition. Please try generating a new word.',
        sentence: ''
      };
    }
  }
}