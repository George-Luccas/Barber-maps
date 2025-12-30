import type { Config } from 'tailwindcss';

const config: Config = {
  // A seção 'content' é onde o Tailwind escaneia suas classes
  content: [
    "./index.html", // Escaneia o HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Escaneia todos os arquivos JS/TS/JSX/TSX dentro da pasta 'src'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config;