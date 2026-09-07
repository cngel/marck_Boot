# Mini App Telegram — MarkSuite (mini)

Instruções rápidas para testar o Web App localmente e integrar com o Bot Telegram.

1) Servir os arquivos estáticos (projeto já tem `public/`):

```bash
# a partir da raiz do projeto
npm install
node server.js
```

2) Abrir o Web App a partir do Bot Telegram:
- Configure o `web_app` do seu Bot para apontar para `https://<host>/public/telegram-webapp/index.html`.
- Quando o usuário abrir o Web App dentro do Telegram, o botão "Enviar resumo ao Bot" chamará `Telegram.WebApp.sendData(...)`.

3) Teste rápido sem Telegram: abra `public/telegram-webapp/index.html` no navegador — o botão exibirá o payload localmente.

Se quiser, posso atualizar o backend para receber `sendData` via `web_app_data` ou adicionar uma rota que processe envios do Web App.
