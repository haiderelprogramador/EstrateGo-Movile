import { Injectable, signal } from '@angular/core';

/**
 * Señal global de "el usuario pidió actualizar" (deslizar hacia abajo en
 * móvil). Las pantallas que muestren datos del servidor pueden reaccionar con
 * un `effect` sobre `tick` y volver a pedirlos. Hoy (mock) solo sirve para
 * dar la retroalimentación visual; cuando exista backend, aquí se engancha
 * la recarga real. 🎨 docs/09 §6.
 */
@Injectable({ providedIn: 'root' })
export class RefrescoService {
  /** Se incrementa cada vez que se solicita una actualización. */
  readonly tick = signal(0);
  readonly refrescando = signal(false);

  solicitar(): void {
    this.tick.update((n) => n + 1);
    this.refrescando.set(true);
    // Retroalimentación mínima mientras no haya una petición real que esperar.
    setTimeout(() => this.refrescando.set(false), 700);
  }
}
