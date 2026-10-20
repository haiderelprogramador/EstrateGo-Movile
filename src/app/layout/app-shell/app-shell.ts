import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { RefrescoService } from '../../core/services/refresco.service';
import { Rol } from '../../core/models/rol.enum';
import { Badge } from '../../shared/components/badge/badge';
import { Icono, NombreIcono } from '../../shared/components/icono/icono';
import { DeslizarActualizar } from '../../shared/directives/deslizar-actualizar';

interface ItemNav {
  ruta: string;
  texto: string;
  /** Etiqueta corta para la barra inferior de móvil (si no se da, usa `texto`). */
  corto?: string;
  icono: NombreIcono;
}
interface GrupoNav {
  titulo: string;
  items: ItemNav[];
}

/**
 * Layout con sidebar oscuro para las pantallas con sesión (docs/05, 🎨).
 * La navegación cambia según el rol; Clasificación y Design system las ven
 * ambos roles.
 *
 * Móvil (🎨 docs/09): el sidebar se oculta y la navegación pasa a una barra
 * inferior con las 3 pantallas principales del rol. "Cerrar sesión" se mueve
 * al topbar. El contenido soporta "deslizar para actualizar".
 */
@Component({
  selector: 'app-app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Badge, Icono, DeslizarActualizar],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly refresco = inject(RefrescoService);

  readonly refrescando = this.refresco.refrescando;

  readonly usuario = this.auth.usuarioActual;
  readonly esDocente = computed(() => this.usuario()?.rol === Rol.DOCENTE);

  /** 🎨 mock: el prototipo muestra "Trimestre 3 · 2026" fijo en la barra. */
  readonly trimestre = signal('Trimestre 3 · 2026');
  readonly temaOscuro = signal(false);

  readonly grupos = computed<GrupoNav[]>(() => {
    if (this.esDocente()) {
      return [
        {
          titulo: 'Administración',
          items: [
            { ruta: '/docente/panel', texto: 'Panel del docente', corto: 'Panel', icono: 'grid' },
            { ruta: '/docente/estudiantes', texto: 'Estudiantes', icono: 'users' },
            { ruta: '/docente/empresas', texto: 'Empresas', icono: 'building' },
            { ruta: '/clasificacion', texto: 'Clasificación', corto: 'Ranking', icono: 'trophy' },
          ],
        },
        { titulo: 'Sistema', items: [{ ruta: '/design-system', texto: 'Design system', icono: 'sliders' }] },
      ];
    }
    return [
      {
        titulo: 'Mi simulación',
        items: [
          { ruta: '/estudiante/caso-actual', texto: 'Caso actual', corto: 'Caso', icono: 'file' },
          { ruta: '/estudiante/reportes-financieros', texto: 'Reportes financieros', corto: 'Reportes', icono: 'chart' },
          { ruta: '/clasificacion', texto: 'Clasificación', corto: 'Ranking', icono: 'trophy' },
        ],
      },
      { titulo: 'Sistema', items: [{ ruta: '/design-system', texto: 'Design system', icono: 'sliders' }] },
    ];
  });

  /** Barra inferior: solo el primer grupo (las pantallas del día a día), sin "Sistema". */
  readonly itemsMovil = computed<ItemNav[]>(() => this.grupos()[0]?.items ?? []);

  alternarTema(): void {
    this.temaOscuro.set(!this.temaOscuro());
  }

  /**
   * Deslizar para actualizar (móvil). Con datos mock no hay nada que volver a
   * pedir: se avisa por `RefrescoService` y se muestra el indicador. Cuando
   * haya backend, las pantallas reaccionan a `RefrescoService.tick`.
   */
  recargar(): void {
    this.refresco.solicitar();
  }

  salir(): void {
    this.auth.logout();
    void this.router.navigate(['/auth/login']);
  }
}
