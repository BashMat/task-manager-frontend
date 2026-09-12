import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2, input, output } from '@angular/core';

@Directive({
  selector: '[colResize]'
})
export class ColumnResizeDirective implements AfterViewInit, OnDestroy {
  colResize = input.required<string>();

  resizeBy = output<{ key: string; dx: number }>();
  resizeEnd = output<void>();

  private handle?: HTMLElement;
  private dragging = false;
  private lastX = 0;
  private cleanupFns: (() => void)[] = [];

  constructor(private readonly el: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

    const handle = this.renderer.createElement('span') as HTMLElement;
    this.renderer.addClass(handle, 'col-resize-handle');
    const handleStyles: Record<string, string> = {
      position: 'absolute',
      top: '0',
      bottom: '0',
      right: '0',
      width: '10px',
      cursor: 'col-resize',
      'user-select': 'none',
      'touch-action': 'none',
      'z-index': '2'
    };
    for (const [prop, value] of Object.entries(handleStyles)) {
      this.renderer.setStyle(handle, prop, value);
    }

    const line = this.renderer.createElement('span') as HTMLElement;
    const lineStyles: Record<string, string> = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '0',
      width: '2px',
      height: '70%',
      background: 'rgba(0, 0, 0, 0.18)',
      'pointer-events': 'none'
    };
    for (const [prop, value] of Object.entries(lineStyles)) {
      this.renderer.setStyle(line, prop, value);
    }
    this.renderer.appendChild(handle, line);

    this.renderer.appendChild(this.el.nativeElement, handle);
    this.handle = handle;

    this.cleanupFns.push(
      this.renderer.listen(handle, 'pointerdown', (ev: PointerEvent) => this.onPointerDown(ev)),
      this.renderer.listen(handle, 'pointermove', (ev: PointerEvent) => this.onPointerMove(ev)),
      this.renderer.listen(handle, 'pointerup', (ev: PointerEvent) => this.onPointerUp(ev)),
      this.renderer.listen(handle, 'click', (ev: MouseEvent) => ev.stopPropagation())
    );
  }

  private onPointerDown(ev: PointerEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.dragging = true;
    this.lastX = ev.clientX;
    this.handle?.setPointerCapture(ev.pointerId);
    this.renderer.setStyle(document.body, 'cursor', 'col-resize');
    this.renderer.setStyle(document.body, 'user-select', 'none');
  }

  private onPointerMove(ev: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    const dx = ev.clientX - this.lastX;
    if (dx !== 0) {
      this.lastX = ev.clientX;
      this.resizeBy.emit({ key: this.colResize(), dx });
    }
  }

  private onPointerUp(ev: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    this.handle?.releasePointerCapture(ev.pointerId);
    this.renderer.removeStyle(document.body, 'cursor');
    this.renderer.removeStyle(document.body, 'user-select');
    this.resizeEnd.emit();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}
