# AIVA GROUP — коммерческое предложение (Astro)

Сайт commercial-offer.uz: RU на `/`, UZ на `/uz`. Собирается в обычные HTML-файлы.

## Где что менять
| Что | Файл |
|---|---|
| Тексты, цены и карточки услуг, шаги, FAQ, контакты, подвал (RU / UZ) | `src/data/ru.json`, `src/data/uz.json` |
| Тарифы (вкладки SEO/SMM/Реклама/Сайты) | `src/content/<язык>/pricing.html` |
| Калькуляторы | `src/content/<язык>/calc.html` |
| Телефон, Telegram, Instagram, ID Google Аналитики, список проектов в бегущей строке | `src/data/site.json` |
| Заголовок и описание страницы для Google, превью в соцсетях | `meta` в `src/data/<язык>.json` |
| Внешний вид (цвета, отступы, адаптив) | `src/styles/global.css`, `src/styles/laptop.css` |
| Структура страницы (порядок блоков) | `src/components/Page.astro` |
| 3D-ноутбук | `public/laptop.js` |
| События для аналитики (клики на Telegram, телефон и т. д.) | `src/scripts/tracking.js` |

Новую страницу добавляет файл в `src/pages/` (например, `src/pages/seo.astro`).

## Запуск
```
npm install
npm run dev      # локально, http://localhost:4321
npm run build    # сборка в папку dist
```

## Как вернуться на старый сайт
Старая версия (чистые HTML-файлы) лежит в ветке `main`, пока Astro живёт в ветке `astro`.
- Пока ветка `astro` не слита в `main`, боевой сайт не менялся.
- Если слили, а потом передумали: на GitHub откройте слитый Pull Request и нажмите **Revert**, либо в Vercel → Deployments выберите прежний деплой и нажмите **Promote to Production**.
