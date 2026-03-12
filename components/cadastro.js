import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text, Card, Title, Paragraph, useTheme } from 'react-native-paper';

export default function Cadastro() {
  const [cepInput, setCepInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
    complemento: ''
  });

  const theme = useTheme();

  const updateAddress = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleCadastro = () => {
    alert('Cadastro realizado com sucesso!');
  };

  const buscaCep = async () => {
    if (!cepInput || cepInput.length !== 8) {
      alert('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }
    
    setLoading(true);
    try {
      let url = `https://viacep.com.br/ws/${cepInput}/json/`;
      const resp = await fetch(url);
      
      if (!resp.ok) {
        throw new Error('Erro na resposta do servidor');
      }

      const data = await resp.json();
      
      if (data.erro) {
        alert('CEP não encontrado');
        setAddress({
          logradouro: '',
          bairro: '',
          localidade: '',
          uf: '',
          numero: '',
          complemento: ''
        });
      } else {
        setAddress({
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          uf: data.uf || '',
          numero: '',
          complemento: data.complemento || ''
        });
      }
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao buscar o CEP. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Cadastro de Endereço</Title>
          <TextInput
            label="Digite o CEP"
            value={cepInput}
            onChangeText={setCepInput}
            mode="outlined"
            keyboardType="numeric"
            maxLength={8}
            style={styles.input}
            left={<TextInput.Icon icon="map-marker" />}
          />
          <Button
            mode="contained"
            onPress={buscaCep}
            loading={loading}
            disabled={loading || !cepInput}
            style={styles.button}
          >
            {loading ? 'Buscando...' : 'Busca CEP'}
          </Button>

          <View style={styles.form}>
            <TextInput
              label="Logradouro"
              value={address.logradouro}
              onChangeText={val => updateAddress('logradouro', val)}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Bairro"
              value={address.bairro}
              onChangeText={val => updateAddress('bairro', val)}
              mode="outlined"
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                label="Cidade"
                value={address.localidade}
                onChangeText={val => updateAddress('localidade', val)}
                mode="outlined"
                style={[styles.input, { flex: 2, marginRight: 10 }]}
              />
              <TextInput
                label="Estado"
                value={address.uf}
                onChangeText={val => updateAddress('uf', val)}
                mode="outlined"
                editable={false}
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                label="Número"
                value={address.numero}
                onChangeText={val => updateAddress('numero', val)}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 10 }]}
              />
              <TextInput
                label="Complemento"
                value={address.complemento}
                onChangeText={val => updateAddress('complemento', val)}
                mode="outlined"
                style={[styles.input, { flex: 2 }]}
              />
            </View>
            
            <Button 
              mode="contained" 
              onPress={handleCadastro}
              style={[styles.button, { marginTop: 20, backgroundColor: theme.colors.secondary }]}
            >
              Finalizar Cadastro
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 10,
  },
  form: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
  }
});
