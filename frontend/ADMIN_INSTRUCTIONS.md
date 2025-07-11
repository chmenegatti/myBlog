# 🚀 Sistema de Administração do Blog - Instruções de Teste

## 📋 Como Testar o Sistema Admin

### 1. **Acesse a Página de Login**
```
http://localhost:5173/login
```

### 2. **Credenciais de Teste (Mock)**
- **Email:** `admin@blog.com`
- **Senha:** `admin123`

### 3. **Funcionalidades Disponíveis**

#### 🏠 **Dashboard Admin** (`/admin`)
- Visualizar estatísticas dos posts
- Tabela com todos os posts
- Botões para editar/deletar posts
- Botão flutuante para criar novos posts

#### ✍️ **Criar Post** (`/admin/posts/new`)
- Editor de markdown com preview
- Campos para título, slug, categoria
- Upload de imagem destacada
- Configurações SEO
- Salvar como rascunho ou publicar

#### ✏️ **Editar Post** (`/admin/posts/:id/edit`)
- Mesmas funcionalidades do criar
- Carrega dados do post existente

### 4. **Navegação**
- Após login bem-sucedido → Redirecionamento automático para `/admin`
- Se tentar acessar `/admin` sem login → Redirecionamento para `/login`
- Botão "Logout" no dashboard para sair

### 5. **Recursos do Editor**
- **Markdown:** Suporte completo com preview
- **Auto-save:** Slug gerado automaticamente do título
- **Validação:** Campos obrigatórios destacados
- **Status:** Draft ou Published

## 🔧 Resolução de Problemas

### Se o login não funcionar:
1. Verifique se está usando as credenciais corretas
2. Abra o Developer Console (F12) para ver erros
3. Verifique se o servidor está rodando em `localhost:5173`

### Se o dashboard não carregar:
1. Certifique-se de que fez login com sucesso
2. Verifique a URL: deve ser `localhost:5173/admin`
3. Limpe o localStorage se necessário

## 📝 Dados Mock
O sistema está configurado para funcionar com dados simulados quando o backend não está disponível, permitindo testar toda a interface independentemente da API Go.
