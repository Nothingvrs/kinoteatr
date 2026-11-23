import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// base: './' — сборка работает из любой папки, включая GitHub Pages-подпуть
export default defineConfig({
	base: './',
	plugins: [react()]
});
