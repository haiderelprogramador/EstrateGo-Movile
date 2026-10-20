import { Directive, ElementRef, inject, output, signal } from '@angular/core';

/**
 * "Deslizar para actualizar" (pull-to-refresh) sin dependencias: si el usuario
 * arrastra hacia abajo estando en el tope del scroll, emite `actualizar`.
 * 🎨 Propuesta del equipo (docs/09 §6). Hoy los datos son mock, así que quien
 * escuche el evento decide qué recargar; cuando exista backend, aquí se
 * vuelve a pedir el caso / reportes / ranking.
 */
@Directive({
  selector: '[appDeslizarActualizar]',
  host: {
    '(touchstart)': 'alInicio($event)',
    '(touchmove)': 'alMover($event)',
    '(touchend)': 'alSoltar()',
    '[style.--tirar.px]': 'tirado()',
    '[class.is-tirando]': 'tirado() > 0',
    '[class.is-listo]': 'tirado() >= umbral',
  },
})
export class DeslizarActualizar {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly actualizar = output<void>();
  readonly tirado = signal(0);
  readonly umbral = 72;

  private inicioY: number | null = null;

  protected alInicio(ev: TouchEvent): void {
    this.inicioY = this.enElTope() ? ev.touches[0].clientY : null;
  }

  protected alMover(ev: TouchEvent): void {
    if (this.inicioY === null) {
      return;
    }
    const delta = ev.touches[0].clientY - this.inicioY;
    // Resistencia: el indicador avanza más lento que el dedo.
    this.tirado.set(delta > 0 ? Math.min(delta * 0.5, this.umbral * 1.4) : 0);
  }

  protected alSoltar(): void {
    if (this.tirado() >= this.umbral) {
      this.actualizar.emit();
    }
    this.tirado.set(0);
    this.inicioY = null;
  }

  private enElTope(): boolean {
    const scroller = document.scrollingElement ?? document.documentElement;
    return scroller.scrollTop <= 0 && this.el.nativeElement.scrollTop <= 0;
  }
}
