import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class AppComponent implements OnInit {
  installPromptEvent = signal<any | null>(null);
  isIos = signal(false);
  showInstallHelp = signal(false);

  navItems = [
    { path: '/learn', icon: 'academic-cap', label: 'Learn' },
    { path: '/translate', icon: 'globe-alt', label: 'Translate' },
    { path: '/saved', icon: 'bookmark', label: 'Saved' },
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      this.isIos.set(/iPad|iPhone|iPod/.test(navigator.userAgent));

      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        this.installPromptEvent.set(event);
      });
    }
  }

  installPwa(): void {
    const promptEvent = this.installPromptEvent();
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then(() => {
        this.installPromptEvent.set(null);
      });
    }
  }

  toggleInstallHelp(): void {
    this.showInstallHelp.update(v => !v);
  }
}