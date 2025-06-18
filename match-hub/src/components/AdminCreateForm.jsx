'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formFieldsConfig } from '@/app/admin/[entity]/create/formConfig'; 
// Ajuste o caminho de import se necessário. Exemplo: '../../../app/admin/[entity]/create/formConfig'

export default function AdminCreateForm({ entity }) {
  const fields = formFieldsConfig[entity];
  // Estado inicial
  const initialState = {};
  if (fields) {
    fields.forEach(f => {
      initialState[f.name] = f.type === 'file' ? null : '';
    });
  }
  const [formValues, setFormValues] = useState(initialState);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  if (!fields) {
    return <div className="text-white">Entidade “{entity}” não suportada.</div>;
  }

  function handleChange(e) {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      setFormValues(prev => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validação básica
    for (const f of fields) {
      const val = formValues[f.name];
      if ((val === '' || val == null) && f.type !== 'file') {
        setErrorMsg(`O campo "${f.label}" é obrigatório.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const hasFile = fields.some(f => f.type === 'file');
      let response;
      if (hasFile) {
        const data = new FormData();
        fields.forEach(f => {
          const val = formValues[f.name];
          if (f.type === 'file') {
            if (val) data.append(f.name, val);
          } else {
            data.append(f.name, val);
          }
        });
        response = await fetch(`/api/admin/${entity}`, {
          method: 'POST',
          body: data,
        });
      } else {
        response = await fetch(`/api/admin/${entity}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues),
        });
      }
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erro ao criar');
      }
      setSuccessMsg(`${entity} criado com sucesso!`);
      // Opcional: redirecionar para listagem após sucesso:
      // router.push(`/admin/${entity}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Erro desconhecido');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success" role="alert">
          {successMsg}
        </div>
      )}

      {fields.map(f => {
        const value = formValues[f.name];
        return (
          <div className="mb-3" key={f.name}>
            <label htmlFor={f.name} className="form-label form-label-dark">
              {f.label}
            </label>
            {f.type === 'textarea' ? (
              <textarea
                id={f.name}
                name={f.name}
                className="form-control form-textarea-dark"
                placeholder={f.placeholder || ''}
                value={value}
                onChange={handleChange}
                rows={4}
              />
            ) : f.type === 'select' ? (
              <select
                id={f.name}
                name={f.name}
                className="form-select form-select-dark"
                value={value}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                {f.options && f.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : f.type === 'file' ? (
              <input
                type="file"
                id={f.name}
                name={f.name}
                className="form-control form-control-dark"
                onChange={handleChange}
                accept="image/*"
              />
            ) : (
              <input
                type={f.type}
                id={f.name}
                name={f.name}
                className="form-control form-control-dark"
                placeholder={f.placeholder || ''}
                value={value}
                onChange={handleChange}
              />
            )}
          </div>
        );
      })}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Salvar'}
      </button>
      {/* Opcional: botão cancelar */}
      {/* <button type="button" className="btn btn-secondary ms-2" onClick={() => router.back()}>Cancelar</button> */}
    </form>
  );
}
