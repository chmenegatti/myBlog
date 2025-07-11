# Frontend do Blog

Frontend moderno e responsivo para o blog, desenvolvido com React, Material UI e Vite.

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework principal
- **Material UI** - Biblioteca de componentes
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **React Helmet Async** - SEO
- **Date-fns** - Manipulação de datas
- **Emotion** - CSS-in-JS (Material UI)

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos (imagens, etc.)
├── components/      # Componentes reutilizáveis
│   ├── blog/        # Componentes específicos do blog
│   ├── layout/      # Componentes de layout (Header, Footer, etc.)
│   └── ui/          # Componentes de interface
├── contexts/        # Contextos React (tema, etc.)
├── hooks/           # Hooks customizados
├── pages/           # Componentes de página
├── services/        # Serviços da API
└── utils/           # Utilitários e helpers
```

## 🎨 Design System

O projeto utiliza Material UI com tema customizado que inclui:

- **Modo claro/escuro** - Toggle automático com persistência
- **Tipografia moderna** - Roboto como fonte principal
- **Cores consistentes** - Paleta inspirada no PostHog
- **Componentes responsivos** - Design mobile-first
- **Animações suaves** - Transições e hover effects

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev

# Build para produção
yarn build

# Preview da build
yarn preview

# Linting
yarn lint
yarn lint:fix

# Formatação
yarn format
yarn format:check
```

## 🌟 Características Implementadas

- ✅ **Interface moderna e responsiva**
- ✅ **Dark/Light mode** com persistência
- ✅ **SEO otimizado** com React Helmet
- ✅ **Busca de posts** (UI ready)
- ✅ **Newsletter signup** (integrado com backend)
- ✅ **Performance otimizada** com Vite
- ✅ **Sistema de roteamento** com React Router
- ✅ **Integração com API** via Axios
- ✅ **Formatação de código** com Prettier + ESLint
- ✅ **Estrutura escalável** e bem organizada

## 🔗 Integração com Backend

O frontend está configurado para se conectar com o backend Go:

- **API Base URL**: `http://localhost:8080/api`
- **Autenticação**: JWT tokens via localStorage
- **Interceptors**: Tratamento automático de erros e tokens
- **Serviços**: Abstrações para todas as operações da API

## 🎯 Próximos Passos

- [ ] Implementar páginas restantes (Blog, Post Details, Search, etc.)
- [ ] Adicionar sistema de comentários
- [ ] Implementar lazy loading para imagens
- [ ] Adicionar testes unitários
- [ ] Implementar PWA features
- [ ] Adicionar analytics

## 🚀 Como Executar

1. Instale as dependências:
```bash
yarn install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

3. Execute em modo desenvolvimento:
```bash
yarn dev
```

4. Acesse `http://localhost:5173`

## 🔗 URLs Importantes

- **Desenvolvimento**: http://localhost:5173
- **API Backend**: http://localhost:8080/api
- **Build**: pasta `dist/` após `yarn build`

## 📝 Notas

- O projeto está configurado para usar yarn como package manager
- ESLint e Prettier estão configurados para manter código limpo
- Material UI tema personalizado em `src/contexts/ThemeContext.jsx`
- Integração completa com o sistema de markdown do backend+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
