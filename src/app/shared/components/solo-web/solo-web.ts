import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icono } from '../icono/icono';

/**
 * Aviso para tareas que en móvil no tienen sentido (carga de Excel,
 * configuración de casos/parámetros): se indica que están disponibles en la
 * versión web. 🎨 Propuesta del equipo (docs/09): el docente hace lo pesado en
 * escritorio y usa el celular para consultar y acciones rápidas.
 *
 * Uso: <app-solo-web class="solo-movil" accion="La carga masiva por Excel" />
 */
@Component({
  selector: 'app-solo-web',
  imports: [Icono],
  templateUrl: './solo-web.html',
  styleUrl: './solo-web.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoloWeb {
  /** Qué es lo que no está disponible aquí, en frase nominal: "La carga por Excel". */
  readonly accion = input.required<string>();
}
