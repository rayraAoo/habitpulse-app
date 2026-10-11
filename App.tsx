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
} from 'react-native';

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

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Beber 2L de água', category: 'Saúde', streak: 12, completed: true },
    { id: '2', title: 'Leitura técnica (20 min)', category: 'Estudos', streak: 5, completed: false },
    { id: '3', title: 'Exercício físico', category: 'Saúde', streak: 8, completed: false },
    { id: '4', title: 'Planejamento do dia', category: 'Produtividade', streak: 15, completed: true },
    { id: '5', title: 'Meditação guiada', category: 'Mente', streak: 3, completed: false },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Saúde' | 'Produtividade' | 'Mente' | 'Estudos'>('Saúde');

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Sua rotina hoje 👋</Text>
          <Text style={styles.appName}>HabitPulse</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
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
              style={styles.input}
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
                <Text style={styles.modalSaveButtonText}>Salvar</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  appName: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
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
    fontSize: 16,
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
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
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
