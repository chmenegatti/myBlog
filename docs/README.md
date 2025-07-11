# Documentação da API - Blog Pessoal

## 📋 Visão Geral

API RESTful completa para gerenciamento de blog pessoal com foco em TI, arquitetura de software e Golang.

### 🚀 Características

- CRUD completo de posts
- Sistema de categorias e tags
- Sistema de comentários com moderação
- Newsletter com inscrição/cancelamento
- Autenticação e autorização JWT
- Gestão de usuários
- **🖼️ Upload e gerenciamento de imagens**

### 🔧 Tecnologias

- **Backend**: Go (Golang) com Gin
- **Banco**: PostgreSQL com GORM
- **Auth**: JWT (JSON Web Tokens)
- **Upload**: Processamento e redimensionamento de imagens
- **Docs**: OpenAPI/Swagger + Insomnia Collection

## 🛠️ Configuração

### Base URL
```
http://localhost:8080/api/v1
```

### Autenticação

A API usa JWT para autenticação. Inclua o token no header das requisições protegidas:

```
Authorization: Bearer <seu-jwt-token>
```

## 🖼️ Sistema de Upload de Imagens

### Categorias Disponíveis:

- **`avatar`**: Imagens de perfil (redimensionadas para 200x200px)
- **`featured`**: Imagens destacadas para posts (redimensionadas para 1200x630px)  
- **`content`**: Imagens para conteúdo de posts (redimensionadas para 800x600px)
- **`general`**: Imagens gerais (mantém tamanho original)

### Especificações:
- **Tipos**: JPEG, PNG, GIF
- **Tamanho máximo**: 5MB
- **Redimensionamento**: Automático por categoria

## 📁 Endpoints de Imagem

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/images/upload` | Upload geral com categoria |
| `GET` | `/images/my` | Listar imagens do usuário |
| `GET` | `/images/all` | Listar todas (admin) |
| `GET` | `/images/{id}` | Buscar por ID |
| `DELETE` | `/images/{id}` | Remover imagem |
| `POST` | `/images/avatar` | Upload de avatar |
| `POST` | `/images/featured` | Upload de featured |

## 🧪 Como Usar no Insomnia

### 1. Importar Collection
```bash
# Importe o arquivo
insomnia-collection.json
```

### 2. Configurar Environment
- `base_url`: `http://localhost:8080/api/v1`
- `auth_token`: (será preenchido após login)
- `image_id`: (para testes de busca/remoção)

### 3. Workflow de Teste

1. **Login**: Use `🔐 Authentication > Login`
2. **Upload**: Use `🖼️ Images > Upload Imagem`
3. **Listar**: Use `🖼️ Images > Listar Minhas Imagens`
4. **Buscar**: Use `🖼️ Images > Buscar Imagem por ID`
5. **Remover**: Use `🖼️ Images > Remover Imagem`

### 4. Exemplo de Upload

**Endpoint**: `POST /images/upload`
**Body**: `multipart/form-data`
- `file`: Selecione arquivo de imagem
- `category`: `general`, `avatar`, `featured`, ou `content`

**Resposta**:
```json
{
  "message": "Imagem enviada com sucesso",
  "image": {
    "id": "uuid",
    "file_name": "image_1720654800.jpg",
    "original_name": "minha-foto.jpg",
    "url": "http://localhost:8080/uploads/general/image_1720654800.jpg",
    "category": "general",
    "width": 1920,
    "height": 1080
  }
}
```

## 📚 Arquivos de Documentação

- **`swagger.yaml`** - Documentação OpenAPI completa
- **`insomnia-collection.json`** - Collection atualizada com endpoints de imagem
- **`api-examples.md`** - Exemplos práticos de uso

## 🔄 Status Codes

| Code | Descrição |
|------|-----------|
| `200` | Sucesso |
| `201` | Criado |
| `400` | Erro de validação |
| `401` | Não autorizado |
| `413` | Arquivo muito grande |
| `415` | Tipo não suportado |

## 🚀 Próximos Passos

- [ ] Upload para S3/Cloud Storage
- [ ] Compressão avançada de imagens
- [ ] Watermark automático
- [ ] Cache de imagens
- [ ] Testes automatizados

## Estrutura da API

### Endpoints Públicos
- Health check
- Autenticação (login/register)
- Posts publicados
- Categorias e tags
- Comentários
- Newsletter

### Endpoints Protegidos
- Gestão de posts
- Gestão de usuários
- Gestão de categorias/tags
- Moderação de comentários
- Gestão de newsletter

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
