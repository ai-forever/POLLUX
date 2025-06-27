# Pollux UI

**Локальная сборка проекта для разработки**
1. Install Node.js 18 or higher `brew install node`
2. Install all dependencies `npm i`
3. Run the dev server
`npm run dev`
4. Local dev server runs on http://localhost:5173/

### Commands
**Сборка проекта для деплоя на сервер**
1) `npm i` -- устанавливаем зависисмости
2) `npm run build` -- сборка проекта

### Как вставлять свои данные

- Данные piechart вставляются по пути /src/data, в формате json.
- Тексты для блоков вставляются по пути /src/constants, там и написано, что и куда идет
- Данные для новостей хранятся по пути /src/blocks/NewsBlock/data/dataNews.ts
- Данные для BenchMark Experts хранятся по пути /src/blocks/ExpertsBlock/components/ExpertCards/data.ts