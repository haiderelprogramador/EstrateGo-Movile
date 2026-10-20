import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.estratego.movile',
  appName: 'EstrateGo Movile',
  webDir: 'dist/EstrateGo-Movile/browser',
  plugins: {
    /**
     * Las peticiones HTTP de la app (HttpClient de Angular) salen por la capa
     * nativa de Android/iOS en vez del WebView. Así no aplica CORS: el backend
     * no necesita permitir el origen `https://localhost` de la app, y el túnel
     * de ngrok recibe la petición igual que desde Postman.
     */
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
