# Fluxograma da Aplicação TimerGateBall Web

Este documento apresenta o fluxograma completo do funcionamento da aplicação TimerGateBall Web, uma plataforma moderna para gerenciamento de partidas de Gateball.

## Visão Geral da Aplicação

A aplicação TimerGateBall Web é uma solução completa para organização e acompanhamento de partidas de Gateball, desenvolvida com React/Vite e Supabase como backend.

## Fluxograma Principal

```mermaid
flowchart TD
    A[Usuário Acessa a Aplicação] --> B{Usuário Autenticado?}
    
    B -->|Não| C[HomeScreen - Modo Local]
    B -->|Sim| D[LobbyScreen - Modo Online]
    
    C --> C1[Jogo Local Disponível]
    C1 --> C2[Timer de 30 minutos]
    C2 --> C3[Sistema de Pontuação]
    C3 --> C4[Controles de Jogo]
    C4 --> C5[Botão 'Entrar' para Autenticação]
    C5 --> E[AuthScreen]
    
    D --> D1[Exibe Jogos Ativos]
    D --> D2[Exibe Jogos Finalizados]
    D --> D3[Botão Criar Jogo]
    D --> D4[Botão Gerenciar Equipes]
    D --> D5[Configurações de Conta]
    D --> D6[Botão Sair]
    
    E --> E1{Modo de Autenticação}
    E1 -->|Login| E2[Formulário de Login]
    E1 -->|Cadastro| E3[Formulário de Cadastro]
    E1 -->|Recuperação| E4[Recuperação de Senha]
    
    E2 --> E5[Validação com Supabase]
    E3 --> E5
    E4 --> E6[Envio de Email de Recuperação]
    E6 --> E2
    
    E5 -->|Sucesso| D
    E5 -->|Erro| E7[Exibir Mensagem de Erro]
    E7 --> E1
    
    D3 --> F[CreateGameDialog]
    F --> F1[Selecionar Equipe Vermelha]
    F --> F2[Selecionar Equipe Branca]
    F --> F3[Criar Jogo no Supabase]
    F3 --> F4[Navegar para GameScreen]
    
    D4 --> G[ManageTeamsDialog]
    G --> G1[Criar Nova Equipe]
    G --> G2[Editar Equipe Existente]
    G --> G3[Gerenciar Membros]
    G --> G4[Definir Capitães]
    G --> G5[Excluir Equipe]
    
    D5 --> H[AccountScreen]
    H --> H1[Alterar Senha]
    H --> H2[Gerenciar Perfil]
    
    D6 --> I[Logout]
    I --> I1[Limpar Sessão]
    I1 --> A
    
    F4 --> J[GameScreen]
    D1 --> J
    D2 --> J
    
    J --> J1[Verificar Permissões]
    J1 -->|É Capitão| J2[Controles de Capitão]
    J1 -->|Não é Capitão| J3[Visualização Apenas]
    
    J2 --> J4[Controlar Timer]
    J2 --> J5[Controlar Pontuação]
    J2 --> J6[Pausar/Reiniciar Jogo]
    
    J4 --> J7[Timer de 30 minutos]
    J7 --> J8[Contagem Regressiva]
    J8 --> J9[Alertas Sonoros]
    J9 --> J10[Wake Lock Ativo]
    
    J5 --> J11[Pontuação Individual]
    J11 --> J12[Ciclo 0→1→2→3→5→0]
    J12 --> J13[Soma por Equipe]
    J13 --> J14[Atualização em Tempo Real]
    J14 --> J15[Sincronização via WebSocket]
    
    J6 --> J16[Duplo Toque para Pausar]
    J16 --> J17[Confirmação de Reinício]
    
    J --> J18[Finalização do Jogo]
    J18 --> J19[Status: Completed]
    J19 --> D
    
    J3 --> J20[Visualizar Pontuação]
    J20 --> J21[Acompanhar Timer]
    J21 --> J22[Receber Atualizações]
    
    G1 --> G6[Formulário Nova Equipe]
    G6 --> G7[Salvar no Supabase]
    G7 --> G8[Atualizar Lista]
    
    G2 --> G9[Formulário Editar Equipe]
    G9 --> G7
    
    G3 --> G10[Adicionar Membros]
    G3 --> G11[Remover Membros]
    G10 --> G7
    G11 --> G7
    
    G4 --> G12[Definir Capitão]
    G12 --> G7
    
    G5 --> G13[Confirmação de Exclusão]
    G13 --> G14[Excluir do Supabase]
    G14 --> G8
```

## Fluxograma de Autenticação

```mermaid
flowchart TD
    A[AuthScreen] --> B{Modo Selecionado}
    
    B -->|Login| C[Campo Email]
    B -->|Cadastro| D[Campo Email]
    B -->|Recuperação| E[Campo Email]
    
    C --> C1[Campo Senha]
    C1 --> C2[Botão Entrar]
    C2 --> C3[Supabase Auth]
    
    D --> D1[Campo Senha]
    D1 --> D2[Botão Registrar]
    D2 --> D3[Supabase SignUp]
    
    E --> E1[Botão Enviar Link]
    E1 --> E2[Supabase Reset Password]
    
    C3 -->|Sucesso| F[Redirecionar para Lobby]
    C3 -->|Erro| G[Exibir Toast de Erro]
    
    D3 -->|Sucesso| H[Confirmação por Email]
    D3 -->|Erro| G
    
    E2 -->|Sucesso| I[Toast de Confirmação]
    E2 -->|Erro| G
    
    G --> B
    H --> F
    I --> B
    
    F --> J[LobbyScreen]
```

## Fluxograma do Jogo

```mermaid
flowchart TD
    A[GameScreen] --> B[Carregar Estado do Jogo]
    B --> C[Verificar Permissões do Usuário]
    
    C -->|É Capitão| D[Interface de Capitão]
    C -->|Não é Capitão| E[Interface de Visualização]
    
    D --> D1[Controles do Timer]
    D --> D2[Controles de Pontuação]
    D --> D3[Controles de Jogo]
    
    D1 --> D4[Toque Simples: Play/Pause]
    D1 --> D5[Duplo Toque: Pausar]
    D1 --> D6[Botão Reset: Reiniciar]
    
    D4 --> D7[Atualizar Estado no Supabase]
    D5 --> D8[Confirmar Pausa]
    D6 --> D9[Confirmar Reinício]
    
    D8 --> D7
    D9 --> D7
    
    D2 --> D10[Toque nos Jogadores]
    D10 --> D11[Ciclo de Pontuação]
    D11 --> D12[0 → 1 → 2 → 3 → 5 → 0]
    D12 --> D13[Calcular Soma da Equipe]
    D13 --> D14[Atualizar Supabase]
    
    D3 --> D15[Pausar Jogo]
    D3 --> D16[Finalizar Jogo]
    
    D15 --> D17[Status: Paused]
    D16 --> D18[Status: Completed]
    
    D7 --> D19[Sincronização WebSocket]
    D14 --> D19
    D17 --> D19
    D18 --> D19
    
    D19 --> D20[Atualizar Interface]
    D20 --> D21[Notificar Outros Jogadores]
    
    E --> E1[Visualizar Timer]
    E --> E2[Visualizar Pontuação]
    E --> E3[Receber Atualizações]
    
    E1 --> E4[Timer em Tempo Real]
    E2 --> E5[Pontuação em Tempo Real]
    E3 --> E6[WebSocket Updates]
    
    E4 --> E7[Alertas Visuais]
    E5 --> E8[Cores das Equipes]
    E6 --> E9[Refresh da Interface]
    
    D21 --> F[Continuar Jogo]
    E9 --> F
    
    F --> G{Jogo Finalizado?}
    G -->|Não| H[Continuar Monitoramento]
    G -->|Sim| I[Exibir Resultado Final]
    
    H --> C
    I --> J[Voltar para Lobby]
```

## Fluxograma de Gerenciamento de Equipes

```mermaid
flowchart TD
    A[ManageTeamsDialog] --> B[Carregar Lista de Equipes]
    B --> C[Exibir Equipes Existentes]
    
    C --> D[Botão Nova Equipe]
    C --> E[Editar Equipe]
    C --> F[Excluir Equipe]
    
    D --> G[Formulário Nova Equipe]
    G --> G1[Campo Nome]
    G1 --> G2[Campo Cor]
    G2 --> G3[Botão Salvar]
    G3 --> G4[Validar Dados]
    
    G4 -->|Válido| G5[Salvar no Supabase]
    G4 -->|Inválido| G6[Exibir Erro]
    
    G5 --> G7[Atualizar Lista]
    G6 --> G1
    G7 --> C
    
    E --> H[Formulário Editar Equipe]
    H --> H1[Carregar Dados Existentes]
    H1 --> H2[Editar Nome]
    H2 --> H3[Editar Membros]
    H3 --> H4[Definir Capitão]
    H4 --> H5[Botão Salvar]
    
    H5 --> H6[Validar Alterações]
    H6 -->|Válido| H7[Atualizar no Supabase]
    H6 -->|Inválido| H8[Exibir Erro]
    
    H7 --> G7
    H8 --> H2
    
    H3 --> I[Adicionar Membro]
    H3 --> J[Remover Membro]
    
    I --> I1[Buscar Usuários]
    I1 --> I2[Selecionar Usuário]
    I2 --> I3[Adicionar à Equipe]
    
    J --> J1[Selecionar Membro]
    J1 --> J2[Confirmar Remoção]
    J2 --> J3[Remover da Equipe]
    
    I3 --> H7
    J3 --> H7
    
    F --> K[Confirmar Exclusão]
    K --> K1[Dialog de Confirmação]
    K1 -->|Confirmar| K2[Excluir do Supabase]
    K1 -->|Cancelar| C
    
    K2 --> K3[Verificar Jogos Ativos]
    K3 -->|Sem Jogos| K4[Exclusão Bem-sucedida]
    K3 -->|Com Jogos| K5[Erro: Equipe em Uso]
    
    K4 --> G7
    K5 --> K6[Exibir Mensagem de Erro]
    K6 --> C
```

## Componentes Principais

### 1. **AuthProvider (Context)**
- Gerencia estado de autenticação
- Integração com Supabase Auth
- Funções: login, cadastro, logout, recuperação de senha

### 2. **GameProvider (Context)**
- Gerencia estado do jogo atual
- Controla ID do jogo e permissões de capitão

### 3. **Timer Component**
- Cronômetro regressivo de 30 minutos
- Alertas visuais e sonoros
- Controles de play/pause/reset

### 4. **PlayerScore Component**
- Pontuação individual dos jogadores
- Ciclo: 0 → 1 → 2 → 3 → 5 → 0
- Cores diferenciadas por equipe

### 5. **TeamScore Component**
- Soma automática da pontuação da equipe
- Atualização em tempo real

### 6. **GameScreen Component**
- Interface principal do jogo
- Controles de capitão vs visualização
- Sincronização via WebSocket

### 7. **LobbyScreen Component**
- Hub principal para usuários autenticados
- Lista de jogos ativos e finalizados
- Acesso a todas as funcionalidades

## Tecnologias Utilizadas

- **Frontend**: React 18, Vite 4, Tailwind CSS
- **UI Components**: Radix UI primitives
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Recursos Especiais

### 1. **Sistema de Tempo Real**
- WebSocket para sincronização instantânea
- Atualizações automáticas de pontuação
- Notificações de mudanças de estado

### 2. **Controle de Acesso**
- Capitães têm controles completos
- Outros jogadores têm acesso apenas para visualização
- Autenticação obrigatória para jogos online

### 3. **Wake Lock**
- Mantém a tela ligada durante o jogo
- Evita interrupções durante partidas

### 4. **Áudio**
- Alertas sonoros para eventos importantes
- Inicialização sob demanda para compatibilidade

### 5. **Responsividade**
- Interface adaptável para diferentes dispositivos
- Otimizada para uso em tablets e smartphones

## Fluxo de Dados

```mermaid
flowchart LR
    A[Interface do Usuário] --> B[Componentes React]
    B --> C[Contexts/Hooks]
    C --> D[Supabase Client]
    D --> E[PostgreSQL Database]
    
    E --> F[Real-time Subscriptions]
    F --> G[WebSocket]
    G --> H[Atualização da Interface]
    
    I[Autenticação] --> J[Supabase Auth]
    J --> K[JWT Token]
    K --> L[Row Level Security]
    L --> E
```

Este fluxograma documenta completamente o funcionamento atual da aplicação TimerGateBall Web, desde a autenticação até o gerenciamento de jogos e equipes.