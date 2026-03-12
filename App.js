import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import Cadastro from './components/cadastro';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Cadastro />
        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

