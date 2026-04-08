import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Title, useTheme, Divider, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Banco, inserirUsuario, atualizarUsuario } from '../api/bd/Bd';
import { Usuario, UsuarioInput } from '../model/types';

interface CadastroProps {
  usuario: Usuario | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function Cadastro({ usuario, onCancel, onSuccess }: CadastroProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
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

  useEffect(() => {
    if (usuario) {
      setNome(usuario.NOME_US || '');
      setEmail(usuario.EMAIL_US || '');
      setCepInput(usuario.CEP_US || '');
      setAddress({
        logradouro: usuario.LOGRADOURO_US || '',
        bairro: usuario.BAIRRO_US || '',
        localidade: usuario.LOCALIDADE_US || '',
        uf: usuario.UF_US || '',
        numero: usuario.NUMERO_US || '',
        complemento: usuario.COMPLEMENTO_US || ''
      });
    }
  }, [usuario]);

  const updateAddress = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvar = async () => {
    if (!nome || !email || !cepInput) {
      Alert.alert('Aviso', 'Por favor, preencha os campos obrigatórios (Nome, Email e CEP).');
      return;
    }

    const dados: UsuarioInput = {
      NOME_US: nome,
      EMAIL_US: email,
      CEP_US: cepInput,
      LOGRADOURO_US: address.logradouro,
      BAIRRO_US: address.bairro,
      LOCALIDADE_US: address.localidade,
      UF_US: address.uf,
      NUMERO_US: address.numero,
      COMPLEMENTO_US: address.complemento
    };

    setLoading(true);
    try {
      const db = await Banco();
      if (usuario) {
        await atualizarUsuario(db, usuario.ID_US, dados);
        Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      } else {
        await inserirUsuario(db, dados);
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const buscaCep = async () => {
    if (!cepInput || cepInput.length !== 8) {
      Alert.alert('Aviso', 'Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }
    
    setLoading(true);
    try {
      const url = `https://viacep.com.br/ws/${cepInput}/json/`;
      const resp = await fetch(url);
      const data = await resp.json();
      
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
        setAddress(prev => ({
          ...prev,
          logradouro: '',
          bairro: '',
          localidade: '',
          uf: ''
        }));
      } else {
        setAddress(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          uf: data.uf || ''
        }));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar o CEP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{usuario ? 'Editar Registro' : 'Novo Cadastro'}</Title>
          
          <TextInput
            label="Nome Completo"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />
          
          <Divider style={styles.divider} />
          
          <View style={styles.row}>
            <TextInput
              label="CEP"
              value={cepInput}
              onChangeText={setCepInput}
              mode="outlined"
              keyboardType="numeric"
              maxLength={8}
              style={[styles.input, { flex: 1, marginRight: 10 }]}
            />
            <Button
              mode="contained"
              onPress={buscaCep}
              loading={loading}
              disabled={loading || !cepInput}
              style={styles.btnBusca}
            >
              Buscar
            </Button>
          </View>

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
              <View style={[styles.pickerWrapper, { flex: 1 }]}>
                <Text style={[styles.pickerLabel, { 
                  color: theme.colors?.onSurfaceVariant || theme.colors?.text || '#666', 
                  backgroundColor: theme.colors?.surface || '#fff' 
                }]}>UF</Text>
                <View style={[styles.pickerContainer, { borderColor: theme.colors?.outline || theme.colors?.disabled || '#ccc' }]}>
                  <Picker
                    selectedValue={address.uf}
                    onValueChange={(val) => updateAddress('uf', val)}
                    mode="dropdown"
                    style={styles.picker}
                  >
                    <Picker.Item label="Sel..." value="" />
                    {UFS.map(uf => (
                      <Picker.Item key={uf} label={uf} value={uf} />
                    ))}
                  </Picker>
                </View>
              </View>
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
            
            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={onCancel}
                style={[styles.button, { flex: 1, marginRight: 10 }]}
              >
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSalvar}
                loading={loading}
                style={[styles.button, { flex: 1, backgroundColor: theme.colors.primary }]}
              >
                Salvar
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    flexGrow: 1,
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
    marginBottom: 12,
  },
  divider: {
    marginVertical: 10,
  },
  btnBusca: {
    height: 50,
    justifyContent: 'center',
    marginTop: 6,
  },
  form: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    paddingVertical: 4,
  },
  pickerWrapper: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 12,
    position: 'absolute',
    top: -10,
    left: 10,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  }
});
