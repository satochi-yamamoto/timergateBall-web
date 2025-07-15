
 # TimerGateBall Web
 
-This project uses Supabase as its backend. If you encounter `infinite recursion detected in policy` errors when fetching data from `team_members` or `teams`, apply the SQL in `docs/supabase-policies.sql` to reset the RLS policies.
+Aplicação web para gerenciamento e marcação de partidas de Gateball utilizando Supabase como backend.
+
+## Configuração do Supabase
+
+Caso apareça o erro `infinite recursion detected in policy` ao consultar `team_members` ou `teams`, execute o SQL localizado em `docs/supabase-policies.sql`:
 
 ```bash
 supabase db query < docs/supabase-policies.sql
 ```
 
-This defines a `public.is_member` function and policies that avoid self-referential checks.
+Esse script recria a função `public.is_member` e as políticas de RLS que evitam recursão.
+
+## Ambiente
+
+As chaves do Supabase estão definidas em `src/lib/customSupabaseClient.js`. Para deploys em produção substitua esses valores por variáveis de ambiente e não versione segredos.
 
-## Development
+## Desenvolvimento
 
-1. Install dependencies:
+1. Instale as dependências:
    ```bash
    npm install
    ```
-2. Start the development server:
+2. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
-   The app will be available on `http://localhost:5173`.
+   A aplicação ficará disponível em `http://localhost:5173`.
 
-## Production Build
+## Build de Produção
 
-Create an optimized build and preview it locally:
+Para gerar os arquivos otimizados e testá-los localmente:
 
 ```bash
 npm run build
 npm run preview
 ```
 
-## Docker Usage
+## Docker
 
-The repository contains a `Dockerfile` that builds the production assets and serves them using [serve](https://www.npmjs.com/package/serve).
-
-Build the image and run a container:
+O repositório fornece um `Dockerfile` que compila a aplicação e a serve com [serve](https://www.npmjs.com/package/serve).
 
 ```bash
 docker build -t timergateball-web .
 docker run -p 4173:4173 timergateball-web
 ```
 
-## Environment
-
-The Supabase keys are currently hard coded in `src/lib/customSupabaseClient.js`. For production deployments you should replace these values with environment variables and avoid committing secrets to version control.
-
 ## Funcionalidades
 
-- Autenticação completa com cadastro, login e recuperação de senha.
-- Tela de lobby exibindo jogos ativos e finalizados.
-- Criação de partidas com duas equipes e dez jogadores.
-- Cronômetro de 30 minutos com contagem regressiva, pausa e reinício por duplo toque.
-- Sistema de pontuação individual (0 → 1 → 2 → 3 → 5 → 0) e somatório por equipe.
-- Atualização em tempo real do estado do jogo via Supabase.
-- Gerenciamento de equipes: adicionar ou remover membros e definir capitães.
-- Possibilidade de excluir jogos que não serão utilizados.
-- Tela de gerenciamento de conta para alteração de senha.
-- Páginas de Política de Privacidade e Termos de Uso acessíveis no rodapé.
+- Autenticação completa com cadastro, login e recuperação de senha
+- Lobby exibindo jogos ativos e finalizados
+- Criação de partidas com duas equipes e dez jogadores
+- Cronômetro regressivo de 30 minutos com pausa e reinício por duplo toque
+- Pontuação individual (0 → 1 → 2 → 3 → 5 → 0) e somatório por equipe
+- Atualização em tempo real do estado do jogo via Supabase
+- Gerenciamento de equipes: adição ou remoção de membros e definição de capitães
+- Possibilidade de excluir jogos não utilizados
+- Tela de gerenciamento de conta para alteração de senha
+- Páginas de Política de Privacidade e Termos de Uso acessíveis no rodapé
 
EOF
)
