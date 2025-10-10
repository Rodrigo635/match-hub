"use client";
import { useState, useCallback } from 'react';
/**
 * Função global para validar campos usando regex
 * @param {RegExp} regex - Expressão regular para validação
 * @param {string} valor - Valor do campo a ser validado
 * @returns {boolean} - true se válido, false se inválido
 */
export const validaCampo = (regex, valor) => {
  if (!valor || valor.trim() === '') {
    return false;
  }
  return regex.test(valor);
};

// Exemplos de regex comuns que você pode usar
export const regexPatterns = {
  nome: /^[A-Za-zÀ-ÿ\s]{2,50}$/, // Nome com acentos, 2-50 caracteres
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email básico
  telefone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, // (11) 99999-9999
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, // 000.000.000-00
  cep: /^\d{5}-\d{3}$/, // 00000-000
  senha: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // Senha forte
  apenasNumeros: /^\d+$/, // Apenas números
  apenasLetras: /^[A-Za-zÀ-ÿ\s]+$/, // Apenas letras com acentos
};

// Função para validar múltiplos campos de uma vez
export const validaMultiplosCampos = (campos) => {
  const erros = {};
  
  for (const [nome, { regex, valor }] of Object.entries(campos)) {
    if (!validaCampo(regex, valor)) {
      erros[nome] = true;
    }
  }
  
  return {
    valido: Object.keys(erros).length === 0,
    erros
  };
};

// Hook personalizado para validação em tempo real
export const useValidacao = () => {
  const [erros, setErros] = useState({});

  const validar = useCallback((nome, regex, valor) => {
    const isValido = validaCampo(regex, valor);
    
    setErros(prev => ({
      ...prev,
      [nome]: !isValido
    }));
    
    return isValido;
  }, []);

  const limparErro = useCallback((nome) => {
    setErros(prev => {
      const novosErros = { ...prev };
      delete novosErros[nome];
      return novosErros;
    });
  }, []);

  const limparTodosErros = useCallback(() => {
    setErros({});
  }, []);

  return {
    erros,
    validar,
    limparErro,
    limparTodosErros,
    temErros: Object.keys(erros).length > 0
  };
};