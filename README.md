# TimerGateBall Web

This project uses Supabase as its backend. If you encounter `infinite recursion detected in policy` errors when fetching data from `team_members` or `teams`, apply the SQL in `docs/supabase-policies.sql` to reset the RLS policies.

```bash
supabase db query < docs/supabase-policies.sql
```

This defines a `public.is_member` function and policies that avoid self-referential checks.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available on `http://localhost:5173`.

## Production Build

Create an optimized build and preview it locally:

```bash
npm run build
npm run preview
```

## Docker Usage

The repository contains a `Dockerfile` that builds the production assets and serves them using [serve](https://www.npmjs.com/package/serve).

Build the image and run a container:

```bash
docker build -t timergateball-web .
docker run -p 4173:4173 timergateball-web
```

## Environment

The Supabase keys are currently hard coded in `src/lib/customSupabaseClient.js`. For production deployments you should replace these values with environment variables and avoid committing secrets to version control.

## Funcionalidades

- Autenticação completa com cadastro, login e recuperação de senha.
- Tela de lobby exibindo jogos ativos e finalizados.
- Criação de partidas com duas equipes e dez jogadores.
- Cronômetro de 30 minutos com contagem regressiva, pausa e reinício por duplo toque.
- Sistema de pontuação individual (0 → 1 → 2 → 3 → 5 → 0) e somatório por equipe.
- Atualização em tempo real do estado do jogo via Supabase.
- Gerenciamento de equipes: adicionar ou remover membros e definir capitães.
- Possibilidade de excluir jogos que não serão utilizados.
- Tela de gerenciamento de conta para alteração de senha.
- Páginas de Política de Privacidade e Termos de Uso acessíveis no rodapé.
