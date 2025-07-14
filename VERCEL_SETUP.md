# Vercel Frontend Deployment

## 1. Preparação para Deploy no Vercel

### Variáveis de Ambiente (.env.production)
```bash
VITE_API_URL=https://myblog-production-f427.up.railway.app/api/v1
```

### Build Settings no Vercel:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 2. Configurar CORS no Backend

Atualize a variável CORS_ALLOWED_ORIGINS no Railway:
```
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

## 3. Passos para Deploy:

1. ✅ Backend funcionando: https://myblog-production-f427.up.railway.app/health
2. ⏳ Conectar projeto ao Vercel
3. ⏳ Configurar variáveis de ambiente
4. ⏳ Fazer deploy
5. ⏳ Atualizar CORS no Railway com URL do Vercel

## 4. Como fazer deploy no Vercel:

1. Acesse vercel.com
2. Faça login/cadastro
3. Clique "New Project"
4. Conecte seu repositório GitHub
5. Configure:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Adicione variável de ambiente: `VITE_API_URL=https://myblog-production-f427.up.railway.app/api/v1`
7. Clique "Deploy"

## 5. Após o deploy:
- Copie a URL do Vercel
- Atualize CORS_ALLOWED_ORIGINS no Railway
- Teste a aplicação completa
