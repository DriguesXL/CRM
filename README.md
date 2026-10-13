# LeadFlow CRM

CRM web construído com React, Vite e Supabase. O frontend é uma SPA estática e pode ser publicado no Render; autenticação e dados ficam no Supabase.

## Desenvolvimento local

Requer Node.js 22 ou superior.

```bash
npm ci
Copy-Item .env.example .env
npm run dev
```

Preencha no `.env` os valores do projeto Supabase:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-ou-anon-key>
VITE_DEMO_MODE=false
```

Nunca use nem exponha a `service_role` no frontend. As variáveis `VITE_*` são públicas e entram no JavaScript gerado.

## Configuração do Supabase

1. Crie um projeto no Supabase.
2. No **SQL Editor**, execute os arquivos de `src/database` em ordem numérica, de `001_organizations.sql` até `015_signup_workspace_trigger.sql`.
3. Em **Authentication > URL Configuration**, defina a URL de produção do Render como **Site URL** e adicione também `http://localhost:5173` e a URL do Render em **Redirect URLs**. Isso é necessário para recuperação de senha e confirmação de e-mail.
4. Copie a URL do projeto e a chave pública (publishable/anon) para as variáveis de ambiente.

Os scripts incluem as tabelas, políticas RLS, funções e triggers usados pelo CRM. O arquivo `014_seed_demo.sql` é opcional e serve somente para dados de demonstração.

## Publicação no Render

O arquivo [`render.yaml`](render.yaml) descreve o serviço estático:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Rewrite `/* → /index.html` para as rotas do React Router

No Render, escolha **New > Blueprint**, conecte este repositório e informe `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` quando solicitado. Deixe `VITE_DEMO_MODE=false`. Cada alteração enviada à branch configurada dispara um novo deploy.

Depois do primeiro deploy, atualize no Supabase a **Site URL** e as **Redirect URLs** com a URL final `https://<seu-servico>.onrender.com` (ou domínio próprio).

## Verificação

```bash
npm run lint
npm run build
```

O lint pode reportar avisos existentes; o build deve terminar sem erros.
