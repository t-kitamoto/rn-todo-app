import { createHomeStyles } from '@/assets/styles/home.styles';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import useTheme from '@/hooks/useTheme';
import { useMutation, useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  const todos = useQuery(api.todos.getTodos);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  const isLoading = todos === undefined;

  if (isLoading) return <LoadingSpinner />;

  const handleToggleTodo = async (id: Id<'todos'>) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      console.log('Error toggling todo', error);
      Alert.alert('Error', 'Failed to toggle todo');
    }
  };

  const handleDeleteTodo = async (id: Id<'todos'>) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTodo({ id }),
      },
    ]);
  };

  const handleUpdateTodo = async (id: Id<'todos'>, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      await updateTodo({ id, text: trimmed });
    } catch (error) {
      console.log('Error updating todo', error);
      Alert.alert('Error', 'Failed to update todo');
      throw error;
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={homeStyles.container}
    >
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.bg}
        translucent={false}
      />
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />
        <TodoInput />
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodo={handleUpdateTodo}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
