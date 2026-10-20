import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NombreIcono =
  | 'grid'
  | 'users'
  | 'trophy'
  | 'chart'
  | 'file'
  | 'sliders'
  | 'logout'
  | 'monitor'
  | 'building'
  | 'settings';

/**
 * Ícono SVG inline del design system (trazos de 2px, 24x24). Centraliza los
 * íconos que antes vivían duplicados en el sidebar para poder reusarlos en la
 * barra inferior de móvil sin copiar el SVG dos veces.
 */
@Component({
  selector: 'app-icono',
  templateUrl: './icono.html',
  styles: `
    :host { display: inline-grid; place-items: center; line-height: 0; }
    svg { width: 1em; height: 1em; display: block; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icono {
  readonly nombre = input.required<NombreIcono>();
}
