# TimerGateBall Web

Aplicação web para gerenciamento e marcação de partidas de Gateball utilizando Supabase como backend.

## Configuração do Supabase

Caso apareça o erro `infinite recursion detected in policy` ao consultar `team_members` ou `teams`, execute o SQL localizado em `docs/supabase-policies.sql`:

```bash
supabase db query < docs/supabase-policies.sql
```

Esse script recria a função `public.is_member` e as políticas de RLS que evitam recursão.

## Ambiente

As chaves do Supabase estão definidas em `src/lib/customSupabaseClient.js`. Para deploys em produção substitua esses valores por variáveis de ambiente e não versione segredos.

## Desenvolvimento

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação ficará disponível em `http://localhost:5173`.

## Build de Produção

Para gerar os arquivos otimizados e testá-los localmente:

```bash
npm run build
npm run preview
```

## Docker

O repositório fornece um `Dockerfile` que compila a aplicação e a serve com [serve](https://www.npmjs.com/package/serve).

```bash
docker build -t timergateball-web .
docker run -p 4173:4173 timergateball-web
```

## Funcionalidades

- Autenticação completa com cadastro, login e recuperação de senha
- Lobby exibindo jogos ativos e finalizados
- Criação de partidas com duas equipes e dez jogadores
- Cronômetro regressivo de 30 minutos com pausa e reinício por duplo toque
- Pontuação individual (0 → 1 → 2 → 3 → 5 → 0) e somatório por equipe
- Atualização em tempo real do estado do jogo via Supabase
- Gerenciamento de equipes: adição ou remoção de membros e definição de capitães
- Possibilidade de excluir jogos não utilizados
- Tela de gerenciamento de conta para alteração de senha
- Páginas de Política de Privacidade e Termos de Uso acessíveis no rodapé
