# Railway Deployment Setup

## 1. Variáveis de Ambiente no Railway

Configure estas variáveis no seu projeto Railway:

### Método 1: Usando a referência do Railway (RECOMENDADO)
```
DATABASE_URL=${{ Postgres.DATABASE_URL }}
```

### Método 2: URL completa (se o método 1 não funcionar)
```
DATABASE_URL=postgresql://postgres:vvBfsyOMcJpxGHrTTZkEOyQzqTAkrnPA@postgres.railway.internal:5432/railway
```

### Outras variáveis obrigatórias:
```
SERVER_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
LOG_LEVEL=info
LOG_FORMAT=json
PORT=8080
```

## 2. Como configurar no Railway:

1. Vá para o seu projeto no Railway
2. Clique na aba "Variables"
3. Adicione cada variável acima
4. Para DATABASE_URL, use: `${{ Postgres.DATABASE_URL }}`
5. Clique em "Deploy" para aplicar as mudanças

## 3. Verificar deployment:

Após o deploy, verifique:
- Logs do serviço
- Health check endpoint: `https://your-app.railway.app/health`
- Se a conexão com PostgreSQL foi estabelecida

## 4. Próximos passos:

1. ✅ Configure as variáveis de ambiente
2. ✅ Faça o deploy
3. ✅ Teste a aplicação
4. ⏳ Configure o frontend no Vercel com a URL do Railway
