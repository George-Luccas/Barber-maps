import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.barbermaps.app',
  appName: 'Barber Maps',
  webDir: 'out',
  server: {
    url: 'https://seu-dominio.vercel.app', // TROQUE PELO SEU DOMÍNIO DE PRODUÇÃO
    cleartext: true
  }
};

export default config;
