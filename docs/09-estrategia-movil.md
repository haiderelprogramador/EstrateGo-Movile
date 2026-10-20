# 09 — Estrategia móvil (EstrateGo-Movile)

> Etiquetas, igual que en el resto de `docs/` del proyecto web: ✅ REQUISITO OFICIAL · 📚 REFERENCIA · 🔎 INFERENCIA · 🎨 PROPUESTA DEL EQUIPO · ⚠️ SUPOSICIÓN · ❓ POR CONFIRMAR.

## Contexto

🎨 **PROPUESTA DEL EQUIPO.** Ningún requisito confirmado por el cliente pide una versión móvil. Este repo (`EstrateGo-Movile`) es la app Android/iOS del simulador: el mismo código Angular del repo web (`Frontend-juego-gerencial`, rama `docenteEquipos` — commit `bfc90b1` "Proyecto completo con despliegue", la versión conectada al backend; re-migrado el 20-oct-2026, antes venía de `develop`, que era la versión con datos simulados) envuelto con **Capacitor** y con **@ionic/angular** instalado. Decisión tomada: **Opción A** — repo aparte con el código real migrado (el equipo asumió mantener dos proyectos). ❓ Validar con el profesor.

## Principio de diseño

Una pantalla de 5–6" no es un escritorio comprimido. En móvil **no se replican todas las tareas**: se priorizan las de sesión corta y frecuente, y las tareas pesadas se señalan como "disponible en la versión web". Todo se diseña a **360 px de ancho** (el Android más común): si funciona ahí, funciona en todos. Breakpoint único: `max-width: 720px` (utilidades `.solo-movil` / `.solo-escritorio` en `styles.scss`).

## Qué usa cada rol en el celular (🎨 §1)

| Rol | En móvil | Solo en web (aviso `app-solo-web`) |
|---|---|---|
| Estudiante | Caso actual, tomar y confirmar la decisión, Reportes financieros, Clasificación | — |
| Docente | Panel (estado del período), ver equipos/estudiantes (con buscador), ver casos y **activar** uno, Clasificación | Carga masiva por Excel, crear/editar casos, Parámetros |

## Lo aplicado en el código

| # | Punto | Dónde |
|---|---|---|
| 1 | Aviso "Disponible en la versión web" para tareas pesadas del docente | `shared/components/solo-web`; usado en Gestión de estudiantes (Excel), Casos (formulario) y Panel (Parámetros) |
| 2 | **Barra de navegación inferior** en vez del sidebar (3 pantallas del rol, al alcance del pulgar). "Cerrar sesión" pasa al topbar. Topbar fijo arriba. | `layout/app-shell` (`.bottom-nav`), íconos centralizados en `shared/components/icono` |
| 3 | **Tablas → tarjetas**: ranking como lista de posiciones (podio compacto), estudiantes como tarjetas con **buscador** (nombre/correo/ID), casos como tarjetas con acción rápida "Activar". Tablas que quedan (previsualización de Excel) con scroll horizontal y primera columna fija (`.tabla-scroll`). | `clasificacion`, `gestion-estudiantes`, `casos`, `styles.scss` |
| 4 | **Caso actual en 2 pasos** ("1 · El caso" → "2 · Tu decisión"), botón **Confirmar decisión** pegado sobre la barra inferior, resumen "Vas a confirmar: …", y la opción **"no hacer nada"** explícita con la nota "no decidir no es neutro" (✅ docs/08 §2). Stepper compacto sin fechas. | `estudiante/caso-actual` |
| 5 | **Reportes compactos**: KPIs 2×2, gráfico más bajo, secciones plegables (acordeón) en móvil. | `estudiante/reportes-financieros` |
| 6 | **Deslizar para actualizar**: directiva `appDeslizarActualizar` + `RefrescoService.tick` (hoy solo retroalimentación visual; con backend, las pantallas se suscriben a `tick`). Modo oscuro: ya existía el botón en el topbar. | `shared/directives/deslizar-actualizar.ts`, `core/services/refresco.service.ts` |
| — | Login/Registro: hero reducido a encabezado compacto, pestañas como control segmentado, botón de Google eliminado (era 🎨 prototipo, nunca requisito). | `layout/auth-layout`, `features/auth` |
| — | Presupuesto de CSS por componente subido a 8 kB (warning) / 16 kB (error) en `angular.json` por los estilos móviles añadidos. | `angular.json` |

## Conexión con el backend (ngrok)

- La URL del backend vive en `src/app/core/api/api.config.ts` (`baseUrl`, `demoMode: false`), igual que en la web. Si el compañero cambia la URL de ngrok, hay que cambiarla **en los dos repos** y luego `npm run build && npx cap sync android`.
- `capacitor.config.ts` activa **CapacitorHttp**: las peticiones salen por la capa nativa de Android, no por el WebView, así que el CORS del backend no aplica (la app corre en el origen `https://localhost`, que el backend no tiene por qué permitir).
- Se mantiene el interceptor `ngrok-skip-browser-warning` (sin él, ngrok gratis responde con su página de advertencia en lugar del JSON).
- Verificado (20-oct-2026, con respuestas simuladas del backend): el login de estudiante y de docente hace `POST {baseUrl}/auth/login` con ese header y navega a su pantalla con la barra inferior.

## Pendiente / no aplicado

- ❓ **Notificaciones push** ("el docente cerró el período, ya están tus resultados"): requiere backend (FCM + endpoint). No se puede hacer con mocks. Capacitor tiene el plugin `@capacitor/push-notifications` para cuando exista.
- 🔎 **Nombre de la categoría "producción"**: el cliente confirmó las categorías *operacionales / administrativas / comerciales* (✅ docs/08 §3), pero el design system (`--bs-produccion`, `color="produccion"`) y textos usan "producción". Alinear el nombre con el cliente antes de renombrar tokens.
- 🎨 El wizard de decisión está pensado para **una** lista de opciones por caso (modelo `Caso.opciones` actual). Cuando el catálogo tenga las 3 categorías, el paso "Tu decisión" se divide en 3 sub-pasos + resumen.
- ⚠️ Los cambios de UI de este repo **no** están en el repo web. Si se quiere la misma experiencia en navegador móvil, replicar `auth-layout`, `app-shell` y las utilidades `.solo-movil/.solo-escritorio` allá.
- iOS: no se ha agregado la plataforma (requiere macOS + Xcode). `npx cap add ios` cuando haya un Mac.

## Cómo probar

```bash
npm run build && npx cap sync android && npx cap open android   # Run en un emulador
```
Usuarios demo: `docente@demo.com` / `demo1234`. Los estudiantes se crean desde el docente (manual o Excel en la web).
