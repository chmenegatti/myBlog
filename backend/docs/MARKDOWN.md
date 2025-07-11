# Sistema de Markdown para Blog

O backend do blog agora possui suporte completo para **markdown**, permitindo que os posts sejam escritos em markdown e automaticamente convertidos para HTML seguro.

## 🎯 Funcionalidades Implementadas

### ✅ Processamento de Markdown

- **Conversão automática**: Markdown → HTML sanitizado
- **Suporte completo**: Headers, listas, código, blockquotes, tabelas
- **Sintaxe highlighting**: Suporte a código com linguagens
- **Links seguros**: Target="_blank" automático
- **IDs automáticos**: Headings com IDs para anchor links

### ✅ Campos do Post Atualizados

```go
type Post struct {
    // ...campos existentes...
    Content     string `json:"content"`      // Markdown original
    ContentHTML string `json:"content_html"` // HTML processado
    WordCount   int    `json:"word_count"`   // Contagem de palavras
    ReadingTime int    `json:"reading_time"` // Tempo estimado em minutos
    // ...
}
```

### ✅ API de Preview

Endpoint para preview em tempo real: `POST /api/v1/posts/preview`

**Request:**

```json
{
  "content": "# Título\n\nConteúdo em **markdown**..."
}
```

**Response:**

```json
{
  "html": "<h1>Título</h1><p>Conteúdo em <strong>markdown</strong>...</p>",
  "plain_text": "Título Conteúdo em markdown...",
  "excerpt": "Título Conteúdo em markdown...",
  "word_count": 45,
  "reading_time": 1,
  "images": ["https://example.com/image.png"],
  "headings": [
    {"level": 1, "text": "Título", "id": "titulo"}
  ]
}
```

## 🔧 Bibliotecas Utilizadas

- **`github.com/gomarkdown/markdown`**: Parser e renderer de markdown
- **`github.com/microcosm-cc/bluemonday`**: Sanitização de HTML
- **Extensões habilitadas**: AutoHeadingIDs, CommonExtensions

## 🚀 Como Usar

### 1. Criando um Post com Markdown

```http
POST /api/v1/posts
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Meu Post em Markdown",
  "content": "# Introdução\n\nEste é um post em **markdown**!\n\n## Características\n\n- Suporte completo\n- HTML seguro\n- Preview em tempo real",
  "excerpt": "",
  "featured_img": "",
  "category_ids": [],
  "tag_ids": []
}
```

**O sistema automaticamente:**

- ✅ Converte markdown para HTML
- ✅ Gera excerpt se não fornecido
- ✅ Calcula word_count e reading_time
- ✅ Valida o conteúdo markdown

### 2. Preview em Tempo Real

```http
POST /api/v1/posts/preview
Content-Type: application/json
Authorization: Bearer <token>

{
  "content": "# Título\n\nConteúdo do post..."
}
```

### 3. Recuperando Posts

```http
GET /api/v1/public/posts
```

**Response inclui:**

```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Título",
      "content": "# Markdown original...",
      "content_html": "<h1>HTML processado...</h1>",
      "excerpt": "Resumo automático...",
      "word_count": 250,
      "reading_time": 2,
      "author": {...},
      "categories": [...],
      "tags": [...]
    }
  ]
}
```

## 📝 Formato Markdown Suportado

### Headers

```markdown
# H1
## H2  
### H3
#### H4
##### H5
###### H6
```

### Formatação de Texto

```markdown
**Bold** ou __Bold__
*Italic* ou _Italic_
`Code inline`
~~Strikethrough~~
```

### Listas

```markdown
- Item 1
- Item 2
  - Sub-item

1. Numerada
2. Item 2
```

### Links e Imagens

```markdown
[Link](https://example.com)
![Alt text](https://example.com/image.png)
```

### Código

````markdown
```javascript
const code = "syntax highlighting";
console.log(code);
```
````

### Blockquotes

```markdown
> Esta é uma citação
> com múltiplas linhas
```

### Tabelas

```markdown
| Coluna 1 | Coluna 2 |
|----------|----------|
| Valor 1  | Valor 2  |
```

## 🔒 Segurança

### HTML Sanitizado

- ✅ Remove scripts maliciosos
- ✅ Mantém formatação segura
- ✅ Permite elementos de blog (headings, listas, código)
- ✅ Links externos com target="_blank"

### Validação

- ✅ Valida sintaxe markdown
- ✅ Detecta conteúdo malformado
- ✅ Retorna erros informativos

## 📊 Estatísticas Automáticas

### Word Count

Conta palavras do texto plano (sem markdown)

### Reading Time

Baseado em 200 palavras por minuto (padrão da indústria)

### Excerpt Automático

- Extrai primeiros 200 caracteres do texto plano
- Remove formatação markdown
- Adiciona "..." se truncado

## 🗄️ Migração do Banco

Execute a migração para adicionar novos campos:

```sql
ALTER TABLE posts 
ADD COLUMN content_html TEXT,
ADD COLUMN reading_time INTEGER DEFAULT 0,
ADD COLUMN word_count INTEGER DEFAULT 0;

CREATE INDEX idx_posts_reading_time ON posts(reading_time);
CREATE INDEX idx_posts_word_count ON posts(word_count);
```

## 🎨 Frontend Integration

### Editor Recomendado

Para o frontend, recomendo usar editores como:

- **SimpleMDE** ou **EasyMDE**: Editor markdown simples
- **Monaco Editor**: Editor avançado (VS Code)
- **CodeMirror**: Editor customizável

### Preview em Tempo Real

```javascript
// Exemplo de integração
const previewMarkdown = async (content) => {
  const response = await fetch('/api/v1/posts/preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });
  
  const data = await response.json();
  
  // Atualizar preview
  document.getElementById('preview').innerHTML = data.html;
  document.getElementById('word-count').textContent = data.word_count;
  document.getElementById('reading-time').textContent = data.reading_time;
};
```

## ✅ Status Final

O backend está **100% pronto** para markdown com:

- ✅ **Modelo atualizado** com campos necessários
- ✅ **Serviço de markdown** completo
- ✅ **API de preview** em tempo real
- ✅ **Processamento automático** na criação/edição
- ✅ **HTML sanitizado** e seguro
- ✅ **Estatísticas automáticas** (word count, reading time)
- ✅ **Extração de metadados** (imagens, headings)
- ✅ **Validação robusta** de conteúdo
- ✅ **Migração de banco** preparada
- ✅ **Documentação completa**

O blog agora suporta **posts em markdown** com processamento profissional e seguro! 🎉
