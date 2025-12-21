import { createHomeStyles } from '@/assets/styles/home.styles';
import Header from '@/components/Header';
import TodoInput from '@/components/TodoInput';
import useTheme from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={homeStyles.container}
    >
      <StatusBar />
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />
        <TodoInput />
      </SafeAreaView>
    </LinearGradient>
  );
}
