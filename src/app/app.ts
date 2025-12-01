import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'brian-hub-web';
  menuOpen = false;

  constructor(private scroll: ScrollService, private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  async goTo(fragment: string): Promise<void> {
    if (this.router.url !== '/') {
      await this.router.navigateByUrl('/');
      // Espera a que se pinte y luego hace scroll
      setTimeout(() => this.scroll.scrollTo(fragment), 50);
    } else {
      this.scroll.scrollTo(fragment);
    }
    this.closeMenu();
  }
}
