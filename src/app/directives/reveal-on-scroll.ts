import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[revealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input('revealOnScroll') delay = '0s';
  @Input() revealDirection: 'up' | 'down' | 'left' | 'right' = 'up';

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const node = this.el.nativeElement as HTMLElement;
    this.renderer.addClass(node, 'reveal');
    this.renderer.setStyle(node, '--reveal-delay', this.delay);
    const { x, y } = this.getTranslate();
    this.renderer.setStyle(node, '--reveal-x', x);
    this.renderer.setStyle(node, '--reveal-y', y);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(node, 'in-view');
          } else {
            this.renderer.removeClass(node, 'in-view');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private getTranslate(): { x: string; y: string } {
    switch (this.revealDirection) {
      case 'down':
        return { x: '0px', y: '-28px' };
      case 'left':
        return { x: '32px', y: '0px' };
      case 'right':
        return { x: '-32px', y: '0px' };
      case 'up':
      default:
        return { x: '0px', y: '28px' };
    }
  }
}
