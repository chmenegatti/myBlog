# API Routes Documentation

Este documento descreve todas as rotas da API do backend e como usá-las no frontend.

## Base URL
```
http://localhost:8080/api/v1
```

## 🔓 Rotas Públicas (Não requer autenticação)

### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de novo usuário  
- `POST /auth/refresh` - Renovar token de acesso

### Posts
- `GET /public/posts` - Listar posts públicos (com paginação)
- `GET /public/posts/:slug` - Obter post por slug

### Categorias e Tags
- `GET /public/categories` - Listar todas as categorias
- `GET /public/tags` - Listar todas as tags

### Comentários
- `POST /public/comments` - Criar novo comentário

### Newsletter
- `POST /public/newsletter/subscribe` - Inscrever no newsletter
- `GET /public/newsletter/unsubscribe/:token` - Cancelar inscrição

## 🔒 Rotas Protegidas (Requer autenticação)

### Usuários
- `GET /users/me` - Obter perfil do usuário atual
- `PUT /users/me` - Atualizar perfil do usuário atual
- `GET /users` - Listar todos os usuários (Admin)
- `POST /users` - Criar novo usuário (Admin)
- `PUT /users/:id` - Atualizar usuário (Admin)
- `DELETE /users/:id` - Deletar usuário (Admin)

### Posts (Gerenciamento)
- `GET /posts` - Listar todos os posts (Admin)
- `POST /posts` - Criar novo post
- `GET /posts/:id` - Obter post por ID
- `PUT /posts/:id` - Atualizar post
- `DELETE /posts/:id` - Deletar post
- `POST /posts/:id/publish` - Publicar post
- `POST /posts/:id/unpublish` - Despublicar post
- `POST /posts/preview` - Preview de markdown

### Categorias (Gerenciamento)
- `POST /categories` - Criar categoria
- `PUT /categories/:id` - Atualizar categoria
- `DELETE /categories/:id` - Deletar categoria

### Tags (Gerenciamento)
- `POST /tags` - Criar tag
- `PUT /tags/:id` - Atualizar tag
- `DELETE /tags/:id` - Deletar tag

### Comentários (Gerenciamento)
- `GET /comments` - Listar comentários (Admin)
- `PUT /comments/:id` - Atualizar comentário
- `DELETE /comments/:id` - Deletar comentário
- `POST /comments/:id/approve` - Aprovar comentário
- `POST /comments/:id/reject` - Rejeitar comentário

### Newsletter (Gerenciamento)
- `GET /newsletter/subscribers` - Listar inscritos (Admin)
- `DELETE /newsletter/subscribers/:id` - Remover inscrito

### Imagens
- `POST /images/upload` - Upload de imagem
- `GET /images/my` - Imagens do usuário
- `GET /images/all` - Todas as imagens (Admin)
- `GET /images/:id` - Obter imagem por ID
- `DELETE /images/:id` - Deletar imagem
- `POST /images/avatar` - Upload de avatar
- `POST /images/featured` - Upload de imagem destaque

## 📁 Arquivos Estáticos
- `/uploads/*` - Servir arquivos de upload

## 🔧 Como usar no Frontend

### Configuração do Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Exemplos de Uso

#### Listar posts públicos
```javascript
const response = await api.get('/public/posts?page=1&limit=10');
```

#### Login
```javascript
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

#### Criar post (autenticado)
```javascript
const response = await api.post('/posts', {
  title: 'Meu Post',
  content: 'Conteúdo do post...',
  category_id: 1
});
```

#### Upload de imagem
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await api.post('/images/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## 🎯 Parâmetros de Consulta Comuns

### Paginação
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)

### Filtros
- `category` - Filtrar por categoria (slug)
- `tags` - Filtrar por tags
- `q` - Busca por texto

### Exemplo:
```
/public/posts?page=2&limit=5&category=technology&q=react
```
