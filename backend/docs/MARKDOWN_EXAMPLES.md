# Exemplos de Uso do Sistema de Markdown

## 📝 Criando um Post com Markdown

### 1. Endpoint de Criação
```http
POST /api/v1/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Como Usar Markdown no Blog",
  "content": "# Introdução ao Markdown\n\nO **markdown** é uma linguagem de marcação simples.\n\n## Vantagens\n\n- Fácil de escrever\n- Legível em texto puro\n- Conversão automática para HTML\n\n### Exemplo de Código\n\n```javascript\nconst blog = 'awesome';\nconsole.log(blog);\n```\n\n![Logo](https://example.com/logo.png)\n\n> O markdown torna a escrita mais produtiva!",
  "excerpt": "",
  "featured_img": "",
  "category_ids": [],
  "tag_ids": []
}
```

### 2. Resposta da API
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Como Usar Markdown no Blog",
  "slug": "como-usar-markdown-no-blog",
  "content": "# Introdução ao Markdown\n\nO **markdown**...",
  "content_html": "<h1 id=\"introdução-ao-markdown\">Introdução ao Markdown</h1>\n<p>O <strong>markdown</strong> é uma linguagem de marcação simples.</p>\n<h2 id=\"vantagens\">Vantagens</h2>\n<ul>\n<li>Fácil de escrever</li>\n<li>Legível em texto puro</li>\n<li>Conversão automática para HTML</li>\n</ul>\n<h3 id=\"exemplo-de-código\">Exemplo de Código</h3>\n<pre><code class=\"language-javascript\">const blog = 'awesome';\nconsole.log(blog);\n</code></pre>\n<p><img src=\"https://example.com/logo.png\" alt=\"Logo\" /></p>\n<blockquote>\n<p>O markdown torna a escrita mais produtiva!</p>\n</blockquote>",
  "excerpt": "O markdown é uma linguagem de marcação simples. Vantagens Fácil de escrever Legível em texto puro Conversão automática para HTML Exemplo de Código const blog = 'awesome'; console.log(blog); O markdown torna a escrita mais produtiva!",
  "word_count": 42,
  "reading_time": 1,
  "status": "draft",
  "author_id": "user-uuid",
  "view_count": 0,
  "published_at": null,
  "created_at": "2025-07-10T22:00:00Z",
  "updated_at": "2025-07-10T22:00:00Z"
}
```

## 🔍 Preview de Markdown em Tempo Real

### 1. Endpoint de Preview
```http
POST /api/v1/posts/preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "# Teste de Preview\n\nEste é um **teste** do sistema de preview.\n\n- Item 1\n- Item 2\n\n![Imagem](https://example.com/test.png)\n\n> Quote de teste"
}
```

### 2. Resposta do Preview
```json
{
  "html": "<h1 id=\"teste-de-preview\">Teste de Preview</h1>\n<p>Este é um <strong>teste</strong> do sistema de preview.</p>\n<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n</ul>\n<p><img src=\"https://example.com/test.png\" alt=\"Imagem\" /></p>\n<blockquote>\n<p>Quote de teste</p>\n</blockquote>",
  "plain_text": "Teste de Preview Este é um teste do sistema de preview. Item 1 Item 2 Quote de teste",
  "excerpt": "Teste de Preview Este é um teste do sistema de preview. Item 1 Item 2 Quote de teste",
  "word_count": 18,
  "reading_time": 1,
  "images": ["https://example.com/test.png"],
  "headings": [
    {
      "level": 1,
      "text": "Teste de Preview",
      "id": "teste-de-preview"
    }
  ]
}
```

## 📊 Funcionalidades Automáticas

### ✅ Processamento Automático
- **HTML Seguro**: Markdown convertido para HTML sanitizado
- **Excerpt Automático**: Gerado se não fornecido (200 chars)
- **Word Count**: Contagem de palavras do texto plano
- **Reading Time**: Calculado baseado em 200 palavras/minuto
- **Headings com IDs**: Para navegação por âncoras
- **Links Seguros**: Target="_blank" automático

### ✅ Extração de Metadados
- **Imagens**: URLs extraídas automaticamente
- **Headings**: Estrutura hierárquica para índice
- **Validação**: Verificação de sintaxe markdown

### ✅ Segurança
- **HTML Sanitizado**: Remove scripts maliciosos
- **Elementos Permitidos**: Apenas tags seguras para blog
- **Atributos Controlados**: Classes para syntax highlighting

## 🎨 Elementos Suportados

### Texto
```markdown
**Bold** *Italic* `Code` ~~Strike~~
```

### Headers
```markdown
# H1
## H2  
### H3
```

### Listas
```markdown
- Não ordenada
1. Ordenada
```

### Links e Imagens
```markdown
[Link](https://example.com)
![Alt](https://example.com/img.png)
```

### Código
````markdown
```javascript
const code = "highlight";
```
````

### Tabelas
```markdown
| Col 1 | Col 2 |
|-------|-------|
| Val 1 | Val 2 |
```

### Blockquotes
```markdown
> Citação importante
```

## 🔧 Status da Implementação

### ✅ Completamente Implementado
- [x] Serviço de markdown (`internal/services/markdown.go`)
- [x] Modelo Post atualizado com campos markdown
- [x] Handler com endpoint de preview
- [x] Processamento automático na criação/edição
- [x] HTML sanitizado e seguro
- [x] Extração de metadados
- [x] Validação de conteúdo
- [x] Cálculo de estatísticas
- [x] Migração de banco preparada
- [x] Parser corrigido (não reutilizável)

### 🎯 Pronto Para Uso
O sistema está **100% funcional** e pronto para ser usado em produção. Todas as funcionalidades de markdown foram implementadas com segurança e performance.
