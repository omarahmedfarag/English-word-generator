import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';
import { StorageService } from '../../services/storage.service';
import { Word } from '../../models/word.model';
import { DictionaryService } from '../../services/dictionary.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class LearnComponent {
  private dictionaryService = inject(DictionaryService);
  private geminiService = inject(GeminiService);
  storageService = inject(StorageService);

  levels: Array<'Intermediate' | 'Advanced'> = ['Intermediate', 'Advanced'];
  selectedLevel = signal<'Intermediate' | 'Advanced'>(this.levels[0]);
  
  currentWord = signal<Word | null>(null);
  movieSentence = signal<string | null>(null);
  
  isLoading = signal(false);
  isLoadingMovieSentence = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.generateWord();
  }

  selectLevel(level: string) {
    if (level === 'Intermediate' || level === 'Advanced') {
      this.selectedLevel.set(level);
      this.generateWord();
    }
  }

  async generateWord() {
    this.isLoading.set(true);
    this.error.set(null);
    this.currentWord.set(null);
    this.movieSentence.set(null);
    
    try {
      const wordDetails = await this.dictionaryService.generateWord(this.selectedLevel());
      
      const arabicEquivalent = await this.geminiService.getEquivalentWord(wordDetails.word, 'Arabic');

      const finalWord: Word = { ...wordDetails, arabicEquivalent };
      this.currentWord.set(finalWord);
    } catch (e: any) {
      this.error.set(e.message || 'An unknown error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async fetchMovieSentence() {
    const word = this.currentWord();
    if (!word) return;

    this.isLoadingMovieSentence.set(true);
    this.movieSentence.set(null);
    try {
      const sentence = await this.geminiService.getMovieSentence(word.word);
      this.movieSentence.set(sentence);
    } catch (e) {
      // Don't show a blocking error, just fail silently or log
      console.error(e);
    } finally {
      this.isLoadingMovieSentence.set(false);
    }
  }
  
  speakWord(wordToSpeak: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  }

  saveWord() {
    const word = this.currentWord();
    if (word) {
      this.storageService.addWord(word);
    }
  }

  isWordSaved(word: Word | null): boolean {
    return word ? this.storageService.isWordSaved(word) : false;
  }
}