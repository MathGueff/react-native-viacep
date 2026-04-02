export interface Usuario {
  ID_US: number;
  NOME_US: string;
  EMAIL_US: string;
  CEP_US: string;
  LOGRADOURO_US: string;
  BAIRRO_US: string;
  LOCALIDADE_US: string;
  UF_US: string;
  NUMERO_US: string;
  COMPLEMENTO_US: string;
}

export type UsuarioInput = Omit<Usuario, 'ID_US'>;
