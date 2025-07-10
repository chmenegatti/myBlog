# Blog Pessoal - Backend

Um blog pessoal desenvolvido em Go com foco em TI, arquitetura de software e Golang.

## 🚀 Características

- **API RESTful** completa para gerenciamento de blog
- **Autenticação JWT** para segurança
- **PostgreSQL** como banco de dados
- **GORM** como ORM
- **Gin** como framework web
- **Docker** e **Docker Compose** para containerização
- **Arquitetura limpa** com separação de responsabilidades

## 📁 Estrutura do Projeto

```text
backend/
├── cmd/
│   └── main.go              # Ponto de entrada da aplicação
├── internal/
│   ├── app/                 # Configuração da aplicação
│   ├── config/              # Configurações
│   ├── database/            # Conexão com banco de dados
│   ├── handlers/            # Handlers HTTP
│   ├── middleware/          # Middlewares
│   ├── models/              # Modelos de dados
│   ├── repositories/        # Camada de acesso a dados
│   └── services/            # Lógica de negócio
├── .env.example             # Exemplo de variáveis de ambiente
├── Dockerfile              # Configuração Docker
├── go.mod                  # Dependências Go
└── go.sum                  # Checksums das dependências
```

## 🛠️ Tecnologias Utilizadas

- **Go 1.21+**
- **Gin** - Framework web
- **GORM** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Docker** - Containerização
- **UUID** - Identificadores únicos

## 🔧 Funcionalidades

### Principais Recursos

- ✅ **Gestão de Posts** (CRUD completo)
- ✅ **Sistema de Categorias** e **Tags**
- ✅ **Sistema de Comentários** com moderação
- ✅ **Newsletter** com inscrição/cancelamento
- ✅ **Autenticação** e **Autorização**
- ✅ **Gestão de Usuários**
- ✅ **API pública** para leitura de posts
- ✅ **Contagem de visualizações**
- ✅ **Status de publicação** (rascunho/publicado/arquivado)

### Modelos de Dados

- **User** - Usuários do sistema (admin/autor)
- **Post** - Posts do blog
- **Category** - Categorias dos posts
- **Tag** - Tags dos posts
- **Comment** - Comentários nos posts
- **Newsletter** - Inscrições da newsletter

## 🚀 Como Executar

### Pré-requisitos

- Go 1.21+
- PostgreSQL
- Docker (opcional)

### 1. Usando Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone <repository-url>
cd blog

# Execute com Docker Compose
docker-compose up -d

# A API estará disponível em http://localhost:8080
```

### 2. Execução Local

```bash
# Entre no diretório do backend
cd backend

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env com suas configurações

# Instale as dependências
go mod download

# Execute a aplicação
go run cmd/main.go
```

## 🔗 Endpoints da API

### Autenticação

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/refresh` - Refresh token

### Posts Públicos

- `GET /api/v1/public/posts` - Lista posts publicados
- `GET /api/v1/public/posts/:slug` - Busca post por slug
- `GET /api/v1/public/categories` - Lista categorias
- `GET /api/v1/public/tags` - Lista tags
- `POST /api/v1/public/comments` - Cria comentário
- `POST /api/v1/public/newsletter/subscribe` - Inscreve na newsletter

### Posts (Autenticado)

- `GET /api/v1/posts` - Lista todos os posts
- `POST /api/v1/posts` - Cria novo post
- `GET /api/v1/posts/:id` - Busca post por ID
- `PUT /api/v1/posts/:id` - Atualiza post
- `DELETE /api/v1/posts/:id` - Deleta post
- `POST /api/v1/posts/:id/publish` - Publica post
- `POST /api/v1/posts/:id/unpublish` - Despublica post

### Usuários (Autenticado)

- `GET /api/v1/users/me` - Perfil do usuário atual
- `PUT /api/v1/users/me` - Atualiza perfil atual
- `GET /api/v1/users` - Lista usuários
- `POST /api/v1/users` - Cria usuário
- `PUT /api/v1/users/:id` - Atualiza usuário
- `DELETE /api/v1/users/:id` - Deleta usuário

### Outros Endpoints

- Categorias, Tags, Comentários e Newsletter também têm endpoints completos

## 🔒 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```text
Authorization: Bearer <seu-jwt-token>
```

## 📊 Banco de Dados

O projeto usa PostgreSQL com as seguintes tabelas principais:

- `users` - Usuários do sistema
- `posts` - Posts do blog
- `categories` - Categorias
- `tags` - Tags
- `comments` - Comentários
- `newsletters` - Inscrições da newsletter
- Tabelas de relacionamento many-to-many

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Server
SERVER_PORT=8080
SERVER_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=myblog
DB_SSL_MODE=disable

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24
```

## 🧪 Próximos Passos

- [ ] Testes unitários e de integração
- [ ] Upload de imagens
- [ ] Sistema de cache (Redis)
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Métricas e monitoramento
- [ ] CI/CD pipeline
- [ ] SEO optimization
- [ ] Full-text search
- [ ] Email notifications

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

### Cesar Menegatti

- GitHub: [@chmenegatti](https://github.com/chmenegatti)

---

**Foco em:** TI • Arquitetura de Software • Golang
