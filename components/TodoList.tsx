import { createHomeStyles } from '@/assets/styles/home.styles';
import { Doc, Id } from '@/convex/_generated/dataModel';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyState from './EmptyState';

type Todo = Doc<'todos'>;

type TodoListProps = {
  todos: Todo[];
  onToggleTodo: (id: Id<'todos'>) => Promise<void>;
  onDeleteTodo: (id: Id<'todos'>) => void;
  onUpdateTodo: (id: Id<'todos'>, text: string) => Promise<void>;
};

const TodoList = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
}: TodoListProps) => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  const [editingId, setEditingId] = useState<Id<'todos'> | null>(null);
  const [editText, setEditText] = useState('');

  const handleToggleTodo = async (id: Id<'todos'>) => {
    try {
      await onToggleTodo(id);
    } catch {}
  };

  const handleEditTodo = (todo: Todo) => {
    setEditText(todo.text);
    setEditingId(todo._id);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await onUpdateTodo(editingId, editText);
      setEditingId(null);
      setEditText('');
    } catch {}
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const renderTodoItem = ({ item }: { item: Todo }) => {
    const isEditing = editingId === item._id;
    return (
      <View style={homeStyles.todoItemWrapper}>
        <LinearGradient
          colors={colors.gradients.surface}
          style={homeStyles.todoItem}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            style={homeStyles.checkbox}
            activeOpacity={0.7}
            onPress={() => void handleToggleTodo(item._id)}
          >
            <LinearGradient
              colors={
                item.isCompleted
                  ? colors.gradients.success
                  : colors.gradients.muted
              }
              style={[
                homeStyles.checkboxInner,
                {
                  borderColor: item.isCompleted ? 'transparent' : colors.border,
                },
              ]}
            >
              {item.isCompleted && (
                <Ionicons name='checkmark' size={18} color='#fff' />
              )}
            </LinearGradient>
          </TouchableOpacity>

          {isEditing ? (
            <View style={homeStyles.editContainer}>
              <TextInput
                style={homeStyles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                placeholder='Edit your todo...'
                placeholderTextColor={colors.textMuted}
              />
              <View style={homeStyles.editButtons}>
                <TouchableOpacity
                  onPress={() => void handleSaveEdit()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.success}
                    style={homeStyles.editButton}
                  >
                    <Ionicons name='checkmark' size={16} color='#fff' />
                    <Text style={homeStyles.editButtonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCancelEdit}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.muted}
                    style={homeStyles.editButton}
                  >
                    <Ionicons name='close' size={16} color='#fff' />
                    <Text style={homeStyles.editButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={homeStyles.todoTextContainer}>
              <Text
                style={[
                  homeStyles.todoText,
                  item.isCompleted && {
                    textDecorationLine: 'line-through',
                    color: colors.textMuted,
                    opacity: 0.6,
                  },
                ]}
              >
                {item.text}
              </Text>

              <View style={homeStyles.todoActions}>
                <TouchableOpacity
                  onPress={() => handleEditTodo(item)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.warning}
                    style={homeStyles.actionButton}
                  >
                    <Ionicons name='pencil' size={14} color='#fff' />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDeleteTodo(item._id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={colors.gradients.danger}
                    style={homeStyles.actionButton}
                  >
                    <Ionicons name='trash' size={14} color='#fff' />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <FlatList
      data={todos}
      renderItem={renderTodoItem}
      keyExtractor={(item) => String(item._id)}
      style={homeStyles.todoList}
      contentContainerStyle={homeStyles.todoListContent}
      ListEmptyComponent={<EmptyState />}
    />
  );
};
export default TodoList;
