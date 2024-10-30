import axios from 'axios';

const BASE_URL = 'https://67219d8698bbb4d93ca8f88d.mockapi.io/api/v1';

export const getCadastro = async () => {
  const response = await axios.get(`${BASE_URL}/cadastro`);
  return response.data;
};

export const getFinancas = async () => {
  const response = await axios.get(`${BASE_URL}/financas`);
  return response.data;
};
