# ⚡ HabitPulse - Mobile Habit Tracker

> Aplicativo móvel para rastreamento de hábitos e consistência diária, construído com **React Native**, **TypeScript** e **Expo**.

---

## 📱 O que o app possui atualmente

1. **Sistema Completo de Autenticação:**
   - **Tela de Login:** Entrada com e-mail e senha, validação de campos e mensagens de erro.
   - **Tela de Cadastro:** Criação de conta com Nome, E-mail e Senha.
   - **Login de Demonstração / Visitante:** Acesso rápido com um clique (`Rayra` / `rayra@habitpulse.com`).
   - **Gestão de Sessão e Logout:** Saudação personalizada no topo (`Olá, [Nome] 👋`), avatar com inicial e botão para deslogar.

2. **Painel de Hábitos (Dashboard):**
   - **Controle Diário:** Marque hábitos como concluídos e atualize o streak de dias seguidos automaticamente.
   - **Métricas Visuais:** Barra de progresso com cálculo percentual dinâmico do dia.
   - **Filtro por Categorias:** Filtre hábitos por *Saúde*, *Produtividade*, *Mente* e *Estudos*.
   - **Criação de Novos Hábitos:** Modal para adicionar novos hábitos com categorias personalizadas.
   - **Exclusão de Hábitos:** Botão direto para remover hábitos indesejados.

3. **Simulador Visual Web:**
   - Arquivo `preview.html` para visualização e teste imediato em qualquer navegador no formato de smartphone.

---

## 🚀 Como Visualizar e Testar

### 1. Visualização Imediata no Navegador
Abra o arquivo [`preview.html`](file:///C:/Users/200024836/habitpulse/preview.html) com duplo clique ou pelo terminal:
```powershell
Start-Process "C:\Users\200024836\habitpulse\preview.html"
```

### 2. Executando no Celular via Expo (React Native)
Quando tiver Node.js instalado:
```bash
cd C:\Users\200024836\habitpulse
npm install
npx expo start
```
Escaneie o QR Code com o aplicativo **Expo Go** no Android ou iOS.
