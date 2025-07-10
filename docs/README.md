# Swagger/OpenAPI Documentation

Este diretório contém a documentação da API do blog em formato OpenAPI 3.0.

## Arquivos

- `swagger.yaml` - Documentação completa da API em formato YAML
- `api-examples.md` - Exemplos práticos de uso da API

## Como usar

### 1. Importar no Insomnia

1. Abra o Insomnia
2. Clique em "Create" > "Import From" > "File"
3. Selecione o arquivo `swagger.yaml`
4. A API será importada com todas as rotas e exemplos

### 2. Importar no Postman

1. Abra o Postman
2. Clique em "Import"
3. Selecione o arquivo `swagger.yaml`
4. A collection será criada automaticamente

### 3. Visualizar online

Você pode visualizar a documentação em qualquer editor OpenAPI online:

- [Swagger Editor](https://editor.swagger.io/)
- [Redoc](https://redoc.ly/redoc/)
- [Insomnia Design](https://insomnia.rest/products/design)

Basta copiar o conteúdo do `swagger.yaml` e colar no editor.

## Configuração Base

Para usar a API, configure:

```
Base URL: http://localhost:8080/api/v1
```

## Autenticação

A maioria dos endpoints requer autenticação via JWT:

1. Faça login em `/auth/login`
2. Copie o token retornado
3. Use como Bearer Token: `Bearer <seu-token>`

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
