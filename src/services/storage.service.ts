
import { Injectable, signal, effect } from '@angular/core';
import { Word } from '../models/word.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly STORAGE_KEY = 'lingoboost-saved-words';
  
  savedWords = signal<Word[]>([]);

  constructor() {
    this.loadFromStorage();
    effect(() => {
      this.saveToStorage(this.savedWords());
    });
  }

  addWord(word: Word) {
    if (!this.isWordSaved(word)) {
      this.savedWords.update(words => [...words, word]);
    }
  }

  removeWord(wordToRemove: Word) {
    this.savedWords.update(words => words.filter(word => word.word.toLowerCase() !== wordToRemove.word.toLowerCase()));
  }

  isWordSaved(word: Word): boolean {
    return this.savedWords().some(savedWord => savedWord.word.toLowerCase() === word.word.toLowerCase());
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedWordsJson = localStorage.getItem(this.STORAGE_KEY);
      if (savedWordsJson) {
        this.savedWords.set(JSON.parse(savedWordsJson));
      }
    }
  }

  private saveToStorage(words: Word[]) {
     if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(words));
     }
  }
}
