# Fluxograma Simplificado - Jornadas do Usuário

Este documento apresenta uma visão simplificada das principais jornadas do usuário na aplicação TimerGateBall Web.

## Jornada Principal do Usuário

```mermaid
flowchart TD
    A[Usuário acessa a aplicação] --> B{Já tem conta?}
    
    B -->|Não| C[Criar conta]
    B -->|Sim| D[Fazer login]
    
    C --> E[Preencher formulário]
    E --> F[Confirmar email]
    F --> G[Login automático]
    
    D --> H[Inserir credenciais]
    H --> I{Credenciais válidas?}
    I -->|Não| J[Exibir erro]
    I -->|Sim| K[Acessar Lobby]
    
    J --> D
    G --> K
    
    K --> L{O que fazer?}
    L -->|Criar jogo| M[Criar novo jogo]
    L -->|Entrar em jogo| N[Selecionar jogo existente]
    L -->|Gerenciar equipes| O[Gerenciar equipes]
    L -->|Configurações| P[Conta e configurações]
    
    M --> Q[Selecionar equipes]
    Q --> R[Criar jogo]
    R --> S[Entrar no jogo]
    
    N --> S
    
    S --> T{É capitão?}
    T -->|Sim| U[Controlar jogo]
    T -->|Não| V[Assistir jogo]
    
    U --> W[Iniciar timer]
    W --> X[Gerenciar pontuação]
    X --> Y[Pausar/Continuar]
    Y --> Z[Finalizar jogo]
    
    V --> AA[Ver pontuação]
    AA --> BB[Acompanhar timer]
    BB --> CC[Receber atualizações]
    
    Z --> DD[Retornar ao lobby]
    CC --> DD
    
    O --> EE[Criar/Editar equipes]
    EE --> FF[Gerenciar membros]
    FF --> GG[Definir capitães]
    GG --> DD
    
    P --> HH[Alterar senha]
    HH --> II[Gerenciar perfil]
    II --> DD
    
    DD --> L
```

## Estados do Jogo

```mermaid
stateDiagram-v2
    [*] --> Lobby
    Lobby --> Configurando: Criar jogo
    Configurando --> Aguardando: Selecionar equipes
    Aguardando --> Iniciando: Capitão inicia
    Iniciando --> Andamento: Timer ativo
    Andamento --> Pausado: Capitão pausa
    Pausado --> Andamento: Capitão retoma
    Andamento --> Finalizado: Tempo esgotado ou finalização manual
    Finalizado --> Lobby: Voltar ao lobby
    
    Pausado --> Finalizado: Capitão finaliza
    Aguardando --> Lobby: Cancelar jogo
```

## Fluxo de Pontuação

```mermaid
flowchart TD
    A[Jogador na tela] --> B[Capitão toca no jogador]
    B --> C{Pontuação atual}
    
    C -->|0| D[Muda para 1]
    C -->|1| E[Muda para 2]
    C -->|2| F[Muda para 3]
    C -->|3| G[Muda para 5]
    C -->|5| H[Volta para 0]
    
    D --> I[Atualiza total da equipe]
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J[Sincroniza com servidor]
    J --> K[Notifica outros jogadores]
    K --> L[Atualiza interface]
```

## Permissões e Roles

```mermaid
flowchart TD
    A[Usuário entra no jogo] --> B{É membro da equipe?}
    
    B -->|Não| C[Apenas visualização]
    B -->|Sim| D{É capitão?}
    
    D -->|Não| E[Visualização + notificações]
    D -->|Sim| F[Controle completo]
    
    C --> G[Ver timer]
    C --> H[Ver pontuação]
    
    E --> G
    E --> H
    E --> I[Receber atualizações]
    
    F --> G
    F --> H
    F --> I
    F --> J[Controlar timer]
    F --> K[Alterar pontuação]
    F --> L[Pausar/Finalizar]
    
    J --> M[Play/Pause/Reset]
    K --> N[Tocar nos jogadores]
    L --> O[Confirmar ações]
```

## Tecnologias e Integração

```mermaid
flowchart LR
    A[React App] --> B[Supabase Auth]
    A --> C[Supabase Database]
    A --> D[Supabase Realtime]
    
    B --> E[JWT Tokens]
    C --> F[PostgreSQL]
    D --> G[WebSocket]
    
    E --> H[RLS Policies]
    F --> I[Tables: games, teams, players]
    G --> J[Live Updates]
    
    H --> C
    I --> K[Real-time Sync]
    J --> L[UI Updates]
    
    K --> A
    L --> A
```

## Resumo das Funcionalidades

### 🔐 **Autenticação**
- Login/Cadastro com email e senha
- Recuperação de senha
- Sessão persistente

### 🎮 **Gestão de Jogos**
- Criar novos jogos
- Listar jogos ativos e finalizados
- Entrar em jogos existentes
- Excluir jogos não utilizados

### ⏱️ **Timer de Jogo**
- Cronômetro de 30 minutos
- Controles de play/pause/reset
- Alertas visuais e sonoros
- Duplo toque para pausar

### 🏆 **Sistema de Pontuação**
- Pontuação individual (0→1→2→3→5→0)
- Soma automática por equipe
- Atualização em tempo real
- Cores diferenciadas por equipe

### 👥 **Gerenciamento de Equipes**
- Criar e editar equipes
- Adicionar/remover membros
- Definir capitães
- Controle de permissões

### 🔄 **Sincronização**
- Atualizações em tempo real
- WebSocket para comunicação
- Notificações automáticas
- Estado consistente entre usuários

### 📱 **Interface**
- Design responsivo
- Animações suaves
- Feedback visual
- Wake lock durante jogos