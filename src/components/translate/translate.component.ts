
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class TranslateComponent {
  private geminiService = inject(GeminiService);

  inputText = signal('');
  translatedText = signal('');
  sourceLang = signal('English');
  targetLang = signal('Spanish');
  
  isLoading = signal(false);
  error = signal<string | null>(null);

  languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Russian', 'Arabic'];

  async handleTranslation() {
    this.isLoading.set(true);
    this.error.set(null);
    this.translatedText.set('');

    try {
      const result = await this.geminiService.translateText(this.inputText(), this.sourceLang(), this.targetLang());
      this.translatedText.set(result);
    } catch (e: any) {
      this.error.set(e.message || 'An unknown error occurred during translation.');
    } finally {
      this.isLoading.set(false);
    }
  }

  swapLanguages() {
    const currentSource = this.sourceLang();
    this.sourceLang.set(this.targetLang());
    this.targetLang.set(currentSource);
  }
}
