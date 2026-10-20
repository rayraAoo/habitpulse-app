import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// Tipagem de Usuário
interface User {
  name: string;
  email: string;
}

// Tipagem dos Hábitos
interface Habit {
  id: string;
  title: string;
  category: 'Saúde' | 'Produtividade' | 'Mente' | 'Estudos';
  streak: number;
  completed: boolean;
}

const CATEGORIES: ('Todos' | 'Saúde' | 'Produtividade' | 'Mente' | 'Estudos')[] = [
  'Todos',
  'Saúde',
  'Produtividade',
  'Mente',
  'Estudos',
];

const CATEGORY_COLORS: Record<string, string> = {
  Saúde: '#10B981',        // Verde esmeralda
  Produtividade: '#3B82F6', // Azul
  Mente: '#8B5CF6',         // Roxo
  Estudos: '#F59E0B',       // Âmbar
};

// Dados Iniciais de Demonstração
const INITIAL_HABITS: Habit[] = [
  { id: '1', title: 'Beber 2L de água', category: 'Saúde', streak: 12, completed: true },
  { id: '2', title: 'Leitura técnica (20 min)', category: 'Estudos', streak: 5, completed: false },
  { id: '3', title: 'Exercício físico', category: 'Saúde', streak: 8, completed: false },
  { id: '4', title: 'Planejamento do dia', category: 'Produtividade', streak: 15, completed: true },
  { id: '5', title: 'Meditação guiada', category: 'Mente', streak: 3, completed: false },
];

export default function App() {
  // Estado de Autenticação
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Campos de Formulário de Autenticação
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Estados dos Hábitos
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Saúde' | 'Produtividade' | 'Mente' | 'Estudos'>('Saúde');

  // Função de Login
  const handleLogin = () => {
    setAuthError('');
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Preencha seu e-mail e sua senha.');
      return;
    }
    if (!authEmail.includes('@') || authEmail.length < 5) {
      setAuthError('Informe um e-mail válido.');
      return;
    }
    if (authPassword.length < 4) {
      setAuthError('A senha deve ter no mínimo 4 caracteres.');
      return;
    }

    // Sucesso no login
    const userName = authEmail.split('@')[0];
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    setCurrentUser({
      name: formattedName,
      email: authEmail.trim(),
    });
    setAuthPassword('');
  };

  // Função de Cadastro
  const handleRegister = () => {
    setAuthError('');
    if (!authName.trim()) {
      setAuthError('Informe seu nome completo.');
      return;
    }
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Informe um e-mail válido.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    // Criar conta e logar automaticamente
    setCurrentUser({
      name: authName.trim(),
      email: authEmail.trim(),
    });
    setAuthName('');
    setAuthPassword('');
  };

  // Função de Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
  };

  // Login Rápido de Demonstração
  const handleDemoLogin = () => {
    setAuthError('');
    setCurrentUser({
      name: 'Rayra',
      email: 'rayra@habitpulse.com',
    });
  };

  // Alternar conclusão do hábito
  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const nextCompleted = !habit.completed;
          return {
            ...habit,
            completed: nextCompleted,
            streak: nextCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          };
        }
        return habit;
      })
    );
  };

  // Adicionar novo hábito
  const handleAddHabit = () => {
    if (!newTitle.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      streak: 0,
      completed: false,
    };
    setHabits([newHabit, ...habits]);
    setNewTitle('');
    setModalVisible(false);
  };

  // Deletar hábito
  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Métricas
  const totalCompleted = habits.filter((h) => h.completed).length;
  const progressPercentage = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;

  // Filtragem
  const filteredHabits = habits.filter((h) =>
    selectedCategory === 'Todos' ? true : h.category === selectedCategory
  );

  // =========================================================================
  // TELA DE AUTENTICAÇÃO (LOGIN / CADASTRO)
  // =========================================================================
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.authContainer}
        >
          <ScrollView contentContainerStyle={styles.authScrollContent} showsVerticalScrollIndicator={false}>
            {/* Logotipo / Marca */}
            <View style={styles.brandContainer}>
              <View style={styles.brandIconWrapper}>
                <Text style={styles.brandIcon}>⚡</Text>
              </View>
              <Text style={styles.authBrandTitle}>HabitPulse</Text>
              <Text style={styles.authBrandSubtitle}>Construa hábitos fortes, um dia de cada vez.</Text>
            </View>

            {/* Alternador Login / Cadastro */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, authMode === 'login' && styles.tabButtonActive]}
                onPress={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
              >
                <Text style={[styles.tabButtonText, authMode === 'login' && styles.tabButtonTextActive]}>
                  Entrar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, authMode === 'register' && styles.tabButtonActive]}
                onPress={() => {
                  setAuthMode('register');
                  setAuthError('');
                }}
              >
                <Text style={[styles.tabButtonText, authMode === 'register' && styles.tabButtonTextActive]}>
                  Criar Conta
                </Text>
              </TouchableOpacity>
            </View>

            {/* Card de Formulário */}
            <View style={styles.authCard}>
              <Text style={styles.cardHeaderTitle}>
                {authMode === 'login' ? 'Bem-vindo de volta!' : 'Comece sua jornada'}
              </Text>
              <Text style={styles.cardHeaderSubtitle}>
                {authMode === 'login'
                  ? 'Acesse seu painel diário de consistência.'
                  : 'Crie seu perfil gratuito para rastrear sua rotina.'}
              </Text>

              {/* Mensagem de Erro */}
              {authError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorBoxText}>⚠️ {authError}</Text>
                </View>
              ) : null}

              {/* Campo Nome (Apenas Cadastro) */}
              {authMode === 'register' && (
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Nome completo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Rayra Oliveira"
                    placeholderTextColor="#64748B"
                    value={authName}
                    onChangeText={setAuthName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              {/* Campo E-mail */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu.email@exemplo.com"
                  placeholderTextColor="#64748B"
                  value={authEmail}
                  onChangeText={setAuthEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Campo Senha */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#64748B"
                  value={authPassword}
                  onChangeText={setAuthPassword}
                  secureTextEntry
                />
              </View>

              {/* Botão Principal */}
              <TouchableOpacity
                style={styles.primaryAuthButton}
                onPress={authMode === 'login' ? handleLogin : handleRegister}
              >
                <Text style={styles.primaryAuthButtonText}>
                  {authMode === 'login' ? 'Entrar no HabitPulse' : 'Criar minha conta'}
                </Text>
              </TouchableOpacity>

              {/* Botão de Demonstração Rápida */}
              <TouchableOpacity style={styles.demoButton} onPress={handleDemoLogin}>
                <Text style={styles.demoButtonText}>⚡ Entrar como Visitante / Demonstração</Text>
              </TouchableOpacity>
            </View>

            {/* Rodapé Seguro */}
            <Text style={styles.authFooterNote}>
              🔒 Seus hábitos e rotinas protegidos com privacidade.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // TELA PRINCIPAL (DASHBOARD COM USUÁRIO AUTENTICADO)
  // =========================================================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Barra de Perfil e Ações do Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View>
            <Text style={styles.greeting}>Olá, {currentUser.name} 👋</Text>
            <Text style={styles.appName}>HabitPulse</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Novo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card de Progresso */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progresso Diário</Text>
          <Text style={styles.progressPercentText}>{progressPercentage}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressSubtext}>
          {totalCompleted} de {habits.length} tarefas concluídas hoje
        </Text>
      </View>

      {/* Filtros de Categoria */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Hábitos */}
      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum hábito encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão "+ Novo" acima para cadastrar seu primeiro hábito nesta categoria!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.habitCard, item.completed && styles.habitCardCompleted]}>
            <TouchableOpacity
              style={styles.habitMainClickable}
              onPress={() => toggleHabit(item.id)}
              activeOpacity={0.7}
            >
              {/* Checkbox circular */}
              <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>

              {/* Informações */}
              <View style={styles.habitInfo}>
                <Text style={[styles.habitTitle, item.completed && styles.habitTitleDone]}>
                  {item.title}
                </Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: CATEGORY_COLORS[item.category] + '22' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryBadgeText,
                        { color: CATEGORY_COLORS[item.category] },
                      ]}
                    >
                      {item.category}
                    </Text>
                  </View>
                  <Text style={styles.streakText}>🔥 {item.streak} dias</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Ação de Excluir */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHabit(item.id)}>
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal para Adicionar Hábito */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Novo Hábito</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Ler 10 páginas de livro"
              placeholderTextColor="#64748B"
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />

            <Text style={styles.inputLabel}>Categoria:</Text>
            <View style={styles.modalCategoriesRow}>
              {(['Saúde', 'Produtividade', 'Mente', 'Estudos'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.modalCategorySelect,
                    newCategory === cat && {
                      backgroundColor: CATEGORY_COLORS[cat],
                      borderColor: CATEGORY_COLORS[cat],
                    },
                  ]}
                  onPress={() => setNewCategory(cat)}
                >
                  <Text
                    style={[
                      styles.modalCategorySelectText,
                      newCategory === cat && { color: '#FFF', fontWeight: '700' },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleAddHabit}>
                <Text style={styles.modalSaveButtonText}>Salvar Hábito</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  // Estilos de Autenticação
  authContainer: {
    flex: 1,
  },
  authScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  brandIcon: {
    fontSize: 32,
  },
  authBrandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  authBrandSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#3B82F6',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  authCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  cardHeaderSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#451A1A',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorBoxText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  primaryAuthButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryAuthButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoButtonText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  authFooterNote: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 20,
    textAlign: 'center',
  },

  // Cabeçalho da Aplicação
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  appName: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 13,
  },

  // Card de Progresso
  progressCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  progressPercentText: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressSubtext: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 8,
  },

  // Filtros de Categoria
  categoryContainer: {
    paddingVertical: 14,
    paddingLeft: 20,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },

  // Lista de Hábitos
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  habitCardCompleted: {
    opacity: 0.65,
    backgroundColor: '#162032',
  },
  habitMainClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  habitTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  streakText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#64748B',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Modal Novo Hábito
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  modalCategoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  modalCategorySelect: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalCategorySelectText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalCancelButtonText: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
