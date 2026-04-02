import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import Cadastro from './components/cadastro';
import Lista from './components/lista';
import { Banco, createTable, selectUsuarios } from './api/bd/Bd';
import { Usuario } from './model/types';

export default function App() {
  const [view, setView] = useState<'lista' | 'cadastro'>('lista');
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        const db = await Banco();
        await createTable(db);
        const users = await selectUsuarios(db);
        console.log('Quantidade de usuários no banco:', users.length);
        setDbReady(true);
      } catch (error) {
        console.error('Erro na inicialização do BD', error);
      }
    };
    initDb();
  }, []);

  const irParaCadastro = (usuario: Usuario | null = null) => {
    setUsuarioParaEditar(usuario);
    setView('cadastro');
  };

  const irParaLista = () => {
    setView('lista');
    setUsuarioParaEditar(null);
  };

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        {view === 'lista' ? (
          <Lista onEdit={irParaCadastro} onAdd={() => irParaCadastro()} />
        ) : (
          <Cadastro usuario={usuarioParaEditar} onCancel={irParaLista} onSuccess={irParaLista} />
        )}
        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
