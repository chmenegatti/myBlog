# Exemplos de Uso - Endpoints de Imagem

Este documento contém exemplos práticos de como usar os endpoints de upload de imagem da API.

## 🔐 1. Autenticação (Obrigatório)

Primeiro, você precisa fazer login para obter um token JWT:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "123456"
  }'
```

**Resposta**:

```json
{
  "message": "Login realizado com sucesso",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> 💡 **Dica**: Salve o token para usar nos próximos requests!

## 🖼️ 2. Upload de Imagem Geral

Upload de uma imagem com categoria específica:

```bash
# Upload de imagem geral
curl -X POST http://localhost:8080/api/v1/images/upload \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "file=@/caminho/para/sua/imagem.jpg" \
  -F "category=general"
```

**Resposta**:

```json
{
  "message": "Imagem enviada com sucesso",
  "image": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "file_name": "image_1720654800.jpg",
    "original_name": "imagem.jpg",
    "mime_type": "image/jpeg",
    "size": 1024000,
    "path": "./uploads/general/image_1720654800.jpg",
    "url": "http://localhost:8080/uploads/general/image_1720654800.jpg",
    "category": "general",
    "width": 1920,
    "height": 1080,
    "uploaded_by": "user-uuid",
    "is_active": true,
    "created_at": "2025-07-10T21:30:00Z",
    "updated_at": "2025-07-10T21:30:00Z"
  }
}
```

## 👤 3. Upload de Avatar

Upload específico para avatar (será redimensionado para 200x200px):

```bash
curl -X POST http://localhost:8080/api/v1/images/avatar \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "file=@/caminho/para/avatar.jpg"
```

## 🌟 4. Upload de Imagem Destacada

Upload para imagem destacada de posts (será redimensionado para 1200x630px):

```bash
curl -X POST http://localhost:8080/api/v1/images/featured \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "file=@/caminho/para/featured.jpg"
```

## 📋 5. Listar Minhas Imagens

Listar todas as imagens do usuário autenticado:

```bash
curl -X GET "http://localhost:8080/api/v1/images/my?limit=10&offset=0" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Parâmetros opcionais**:

- `limit`: Número máximo de imagens (1-100, padrão: 20)
- `offset`: Número de imagens a pular (padrão: 0)
- `category`: Filtrar por categoria (`avatar`, `featured`, `content`, `general`)

**Resposta**:

```json
{
  "images": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "file_name": "image_1720654800.jpg",
      "original_name": "imagem.jpg",
      "url": "http://localhost:8080/uploads/general/image_1720654800.jpg",
      "category": "general",
      "width": 1920,
      "height": 1080,
      "created_at": "2025-07-10T21:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

## 🔍 6. Buscar Imagem por ID

Obter detalhes de uma imagem específica:

```bash
curl -X GET http://localhost:8080/api/v1/images/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🗑️ 7. Remover Imagem

Remover uma imagem (apenas quem fez upload pode remover):

```bash
curl -X DELETE http://localhost:8080/api/v1/images/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta**:

```json
{
  "message": "Imagem removida com sucesso"
}
```

## 📊 8. Listar Todas as Imagens (Admin)

Listar todas as imagens do sistema (apenas administradores):

```bash
curl -X GET "http://localhost:8080/api/v1/images/all?limit=20&offset=0" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN_AQUI"
```

## 🔗 9. Acessar Imagem Diretamente

As imagens podem ser acessadas diretamente via URL:

```bash
http://localhost:8080/uploads/categoria/nome-do-arquivo.jpg
```

Exemplos:

- `http://localhost:8080/uploads/general/image_1720654800.jpg`
- `http://localhost:8080/uploads/avatar/avatar_1720654800.jpg`
- `http://localhost:8080/uploads/featured/featured_1720654800.jpg`

## 📝 Categorias e Redimensionamento

| Categoria | Redimensionamento | Uso |
|-----------|------------------|-----|
| `avatar` | 200x200px | Fotos de perfil |
| `featured` | 1200x630px | Imagens destacadas de posts |
| `content` | 800x600px | Imagens dentro de posts |
| `general` | Original | Imagens gerais/outros usos |

## ⚠️ Limitações e Validações

### Tipos de arquivo suportados

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)

### Tamanho máximo

- 5MB por arquivo

### Possíveis erros

#### 400 - Arquivo inválido

```json
{
  "error": "Tipo de arquivo não suportado. Use JPEG, PNG ou GIF"
}
```

#### 413 - Arquivo muito grande

```json
{
  "error": "Arquivo muito grande. Tamanho máximo: 5MB"
}
```

#### 401 - Não autorizado

```json
{
  "error": "Token de acesso inválido ou expirado"
}
```

#### 403 - Sem permissão

```json
{
  "error": "Você não tem permissão para remover esta imagem"
}
```

#### 404 - Não encontrado

```json
{
  "error": "Imagem não encontrada"
}
```

## 🧪 Testando no Insomnia

1. **Importe a collection**: `insomnia-collection.json`
2. **Configure o environment**:
   - `base_url`: `http://localhost:8080/api/v1`
   - `auth_token`: (será preenchido após login)
3. **Faça login** usando o endpoint de authentication
4. **Use os endpoints** na pasta "🖼️ Images"

### Workflow recomendado

1. `🔐 Authentication > Login`
2. `🖼️ Images > Upload Imagem`
3. `🖼️ Images > Listar Minhas Imagens`
4. `🖼️ Images > Buscar Imagem por ID`
5. `🖼️ Images > Remover Imagem`

## 🛠️ Troubleshooting

### Problema: "Token inválido"

**Solução**: Faça login novamente e atualize o token no environment

### Problema: "Arquivo muito grande"

**Solução**: Reduza o tamanho da imagem ou use um formato mais compacto

### Problema: "Tipo não suportado"

**Solução**: Converta a imagem para JPEG, PNG ou GIF

### Problema: "Imagem não encontrada"

**Solução**: Verifique se o ID está correto e se você tem permissão para acessar

### Problema: "Sem permissão para remover"

**Solução**: Você só pode remover imagens que você mesmo fez upload
