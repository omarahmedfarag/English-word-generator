
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { Word } from '../../models/word.model';

@Component({
  selector: 'app-saved-words',
  templateUrl: './saved-words.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class SavedWordsComponent {
  storageService = inject(StorageService);
  
  // A signal to track which word is expanded
  expandedWord = signal<string | null>(null);
  
  toggleExpand(word: Word) {
    if (this.expandedWord() === word.word) {
      this.expandedWord.set(null);
    } else {
      this.expandedWord.set(word.word);
    }
  }

  removeWord(word: Word) {
    this.storageService.removeWord(word);
  }
}
