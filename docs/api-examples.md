# API Examples

Este arquivo contém exemplos de como usar a API do blog.

## Configuração Base

```bash
# URL base da API
BASE_URL="http://localhost:8080/api/v1"
```

## 1. Registro de Usuário

```bash
curl -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "123456",
    "name": "Administrador"
  }'
```

## 2. Login

```bash
curl -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "123456"
  }'
```

Resposta:

```json
{
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "name": "Administrador",
    "role": "author"
  },
  "token": "jwt-token-here"
}
```

## 3. Criar Categoria

```bash
TOKEN="seu-jwt-token-aqui"

curl -X POST "${BASE_URL}/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Golang",
    "description": "Posts sobre a linguagem Go",
    "color": "#00ADD8"
  }'
```

## 4. Criar Tags

```bash
curl -X POST "${BASE_URL}/tags" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Tutorial"
  }'

curl -X POST "${BASE_URL}/tags" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Arquitetura"
  }'
```

## 5. Criar Post

```bash
curl -X POST "${BASE_URL}/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "title": "Introdução ao Go: Minha Experiência",
    "content": "# Introdução ao Go\n\nGo é uma linguagem incrível...",
    "excerpt": "Compartilho minha experiência aprendendo Go e por que é uma ótima escolha para backend.",
    "featured_img": "https://example.com/go-intro.jpg"
  }'
```

## 6. Publicar Post

```bash
POST_ID="uuid-do-post"

curl -X POST "${BASE_URL}/posts/${POST_ID}/publish" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 7. Listar Posts Públicos

```bash
curl -X GET "${BASE_URL}/public/posts?limit=10&offset=0"
```

## 8. Buscar Post por Slug

```bash
curl -X GET "${BASE_URL}/public/posts/introducao-ao-go-minha-experiencia"
```

## 9. Comentar em Post

```bash
curl -X POST "${BASE_URL}/public/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "uuid-do-post",
    "name": "João Silva",
    "email": "joao@example.com",
    "website": "https://joaosilva.dev",
    "content": "Excelente post! Muito esclarecedor sobre Go."
  }'
```

## 10. Inscrever na Newsletter

```bash
curl -X POST "${BASE_URL}/public/newsletter/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com"
  }'
```

## 11. Listar Comentários (Admin)

```bash
curl -X GET "${BASE_URL}/comments?limit=10&offset=0" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 12. Aprovar Comentário

```bash
COMMENT_ID="uuid-do-comentario"

curl -X POST "${BASE_URL}/comments/${COMMENT_ID}/approve" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 13. Health Check

```bash
curl -X GET "http://localhost:8080/health"
```

## Estrutura de Resposta de Erro

```json
{
  "error": "Mensagem de erro aqui"
}
```

## Estrutura de Resposta de Lista

```json
{
  "posts": [...],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

## Headers Importantes

- `Content-Type: application/json` - Para requests com JSON
- `Authorization: Bearer <token>` - Para endpoints autenticados

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
