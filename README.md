# TimerGateBall Web

Aplicação web moderna para gerenciamento e marcação de partidas de Gateball com cronômetro inteligente e sistema de pontuação em tempo real. Desenvolvida com React/Vite e Supabase.

## Sobre o Projeto

O TimerGateBall Web é uma solução completa para organização e acompanhamento de partidas de Gateball, oferecendo:

- Interface intuitiva e responsiva
- Sistema de autenticação seguro
- Cronômetro profissional com controles avançados
- Pontuação em tempo real
- Gerenciamento de equipes e jogadores
- Atualizações automáticas via WebSocket

## Stack Tecnológica

- **Frontend**: React 18, Vite 4, Tailwind CSS
- **UI Components**: Radix UI primitives
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build**: Vite com otimizações de produção

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

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (Auth, Game)
├── hooks/          # Hooks customizados
├── lib/            # Utilitários e configurações
├── pages/          # Páginas estáticas
├── screens/        # Telas principais da aplicação
└── main.jsx        # Ponto de entrada da aplicação
```

## Contribuindo

Antes de enviar suas contribuições, execute os comandos de verificação:

```bash
npm install
npm run build
```

O comando `npm run build` deve completar sem erros.

## Licença

Este projeto foi desenvolvido por YD Software by Satochi.