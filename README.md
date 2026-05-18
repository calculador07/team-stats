# ⚽ Team Stats

Sistema moderno de gestão de time de futebol com visual inspirado em EA Sports FC e FIFA Ultimate Team.

## 🚀 Stack

- **React 18** + **Vite**
- **TailwindCSS** (dark mode, glassmorphism)
- **Supabase** (banco de dados + storage)
- **Recharts** (gráficos)
- **Framer Motion** / **React Hot Toast**
- Deploy: **Vercel**

---

## ⚙️ Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Supabase
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **Settings → API** e copie a URL e a Anon Key
4. Copie `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```
5. Preencha com seus dados:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_ADMIN_PASSWORD=suasenha
```

### 3. Criar tabelas no Supabase
1. Vá em **SQL Editor** no painel do Supabase
2. Cole o conteúdo de `supabase-schema.sql`
3. Execute o SQL

### 4. Rodar localmente
```bash
npm run dev
```

---

## 🌐 Deploy na Vercel

1. Faça push para o GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
4. Deploy! ✅

---

## 🎮 Funcionalidades

| Função | Descrição |
|--------|-----------|
| 📊 Dashboard | Visão geral com gráficos e stats |
| 👥 Jogadores | Cards estilo FIFA Ultimate Team |
| ⚽ Partidas | Histórico completo de jogos |
| 🏆 Ranking | Classificação por overall, gols, assists, MVPs |
| 🛡️ Admin | Painel para cadastrar jogadores e partidas |

## 📐 Cálculo do Overall

```
Pontos = (Gols × 5) + (Assists × 3) + (Vitórias × 2) + (MVPs × 7) - (Derrotas × 1) + (Jogos × 1)
Overall = 60 a 99 (calculado automaticamente)
```

## 🎨 Card Tiers

| Overall | Tier | Visual |
|---------|------|--------|
| 90–99 | ⭐ Icon | Dourado especial + brilho |
| 85–89 | 🥇 Gold | Borda dourada |
| 75–84 | 🥈 Silver | Borda prata |
| 60–74 | 🥉 Bronze | Borda bronze |

---

## 🔐 Admin

Senha padrão: `admin123`  
Mude via `VITE_ADMIN_PASSWORD` no `.env.local`

---

Feito com ❤️ e muito ☕
