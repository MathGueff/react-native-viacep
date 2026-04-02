import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button, FAB, ActivityIndicator, Divider } from 'react-native-paper';
import { Banco, selectUsuarios, deletaUsuario } from '../api/bd/Bd';

export default function Lista({ onEdit, onAdd }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarUsuarios = useCallback(async () => {
    try {
      const db = await Banco();
      const data = await selectUsuarios(db);
      setUsuarios(data || []);
    } catch (error) {
      console.error(error);
      // Evitar múltiplos alertas se o componente estiver carregando
      if (!loading) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleExcluir = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          onPress: async () => {
            const db = await Banco();
            await deletaUsuario(db, id);
            carregarUsuarios();
          },
          style: 'destructive' 
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.NOME_US || 'Sem nome'}</Title>
        <Paragraph>Email: {item.EMAIL_US}</Paragraph>
        <Paragraph>Endereço: {item.LOGRADOURO_US}, {item.NUMERO_US}</Paragraph>
        <Paragraph>{item.BAIRRO_US} - {item.LOCALIDADE_US}/{item.UF_US}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button icon="pencil" onPress={() => onEdit(item)}>Editar</Button>
        <Button icon="delete" textColor="red" onPress={() => handleExcluir(item.ID_US)}>Excluir</Button>
      </Card.Actions>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" color="#6200ee" />
        <Text style={{ marginTop: 10 }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.ID_US.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <Title style={styles.header}>Endereços Cadastrados</Title>
            <Divider style={styles.divider} />
            {usuarios.length === 0 && !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
                <Button mode="outlined" onPress={onAdd} style={{ marginTop: 10 }}>
                  Cadastrar Primeiro
                </Button>
              </View>
            )}
          </>
        }
      />
      <FAB
        style={styles.fab}
        icon="plus"
        label="Novo"
        onPress={onAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  divider: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
    borderRadius: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});
