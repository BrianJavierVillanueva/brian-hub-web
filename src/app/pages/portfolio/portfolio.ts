import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects';
import { HostListener } from '@angular/core';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './portfolio.html',   // 👈 OJO: ahora busca portfolio.html
  styleUrl: './portfolio.css',       // 👈 y portfolio.css
})
export class Portfolio implements OnInit {
  projects: Project[] = [];
  displayedProjects: Project[] = [];
  loading = true;
  error: string | null = null;
  visibleCount = 6;
  batchSize = 3;

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.updateDisplayed();
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'No se pudieron cargar los proyectos';
        this.loading = false;
      },
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.loading || this.error) return;
    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 200;
    if (scrollPos >= threshold && this.visibleCount < this.projects.length) {
      this.visibleCount = Math.min(this.visibleCount + this.batchSize, this.projects.length);
      this.updateDisplayed();
    }
  }

  private updateDisplayed(): void {
    this.displayedProjects = this.projects.slice(0, this.visibleCount);
  }
}
