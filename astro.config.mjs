import { defineConfig } from 'astro/config';

// Статический сайт: на сборке получаются обычные HTML-файлы (dist/index.html и dist/uz/index.html).
export default defineConfig({
  site: 'https://commercial-offer.uz',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'always' },
});
