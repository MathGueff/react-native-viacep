import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import Cadastro from './components/cadastro';
import Lista from './components/lista';
import { Banco, createTable, inserirUsuario, selectUsuarios } from './api/bd/Bd';

export default function App() {
  const userFormattedList = (users) => {
    return users.map((user) => {
      return {
        id: user.ID_US,
        nome: user.NOME_US,
        email: user.EMAIL_US,
        cep: user.CEP_US,
        logradouro: user.LOGRADOURO_US,
        bairro: user.BAIRRO_US,
        localidade: user.LOCALIDADE_US,
        uf: user.UF_US,
        numero: user.NUMERO_US,
        complemento: user.COMPLEMENTO_US
      }
    })
  }

  const [view, setView] = useState('lista');
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        const db = await Banco();
        await createTable(db);
        const users = await selectUsuarios(db);
        const formatedList = userFormattedList(users);
        console.log('Lista de usuários', formatedList);
        setDbReady(true);
      } catch (error) {
        console.error('Erro na inicialização do BD', error);
      }
    };
    initDb();
  }, []);

  const irParaCadastro = (usuario = null) => {
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

