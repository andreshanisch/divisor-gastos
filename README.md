# Divisor de gastos

Página para dividir los gastos de un evento grupal: cargás los participantes y quién pagó qué, y te dice quién le debe a quién. Los datos quedan en el `localStorage` del navegador, no se envía nada a ningún servidor.

Online: https://andreshanisch.github.io/divisor-gastos/

## Desarrollo

```
npm install
npm run dev     # servidor de desarrollo
npm test        # tests
npm run build   # build de producción en dist/
```

## Deploy

Cada push a `main` corre los tests, hace el build y publica en GitHub Pages (workflow en `.github/workflows/deploy.yml`).

Paso manual, una sola vez: en GitHub, Settings → Pages → Source: **GitHub Actions**.
