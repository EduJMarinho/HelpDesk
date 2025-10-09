# HelpDesk 💻🛠️

Sistema completo de gerenciamento de chamados técnicos, com painel para **Admin**, **Técnico** e **Cliente**. 
Desenvolvido como desafio prático da formação Full-Stack da Rocketseat.


### 👨‍💻 Autor
Dev Eduardo Marinho

---

## 📦 Estrutura do Projeto

# Interface web com React + Vite ├── api/        

# Backend com Node.js + Express

---

## 👥 Personas

- **Administrador**: gerencia técnicos, clientes, serviços e chamados.
- **Técnico**: executa serviços atribuídos e atualiza chamados.
- **Cliente**: cria chamados e acompanha histórico.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- React + Vite
- TypeScript
- TailwindCSS
- JWT para autenticação
- Validação com Zod

### Backend
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT para autenticação
- Validação com Zod
- Testes com Jest

### Outros
- Docker
- Deploy: Vercel (frontend) e Render (backend)

---

## 🧪 Como rodar localmente

### Pré-requisitos
- Node.js 
- PostgreSQL





### Frontend 
```
cd frontend
npm install
npm run dev
```

### Backend (API)

```
cd api
npm install
npx prisma migrate dev
npm run dev

```


### Frontend
cd frontend
npm install
npm run dev



### 🔐 Autenticação
- Login com JWT
- Proteção de rotas por tipo de usuário
- Senha provisória para técnicos
- Upload de imagem de perfil

### 📋 Funcionalidades
Admin
- Criar, editar e listar técnicos
- Criar, editar, desativar serviços
- Listar e editar e excluir chamados
-
Técnico
- Editar perfil e imagem
- Listar chamados atribuídos
- Adicionar serviços ao chamado
- Alterar status: Em atendimento, Encerrado
-
Cliente
- Criar, editar e excluir conta
- Criar chamados com técnico e serviço
- Visualizar histórico de chamados


### 🌐 Deploy
- Frontend - Vercel
- Backend - Render

### 📚 Licença
- Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

###
--🧠 Analisar 📚 Aprender ❌ Errar  
    🔁 Refatorar  🛠️ Construir  
            → → → → → → →  
→ Esse é o caminho do Dev. — Edu Marinho




