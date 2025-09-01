// src/components/AdminCreateForm.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formFieldsConfig } from "@/app/admin/[entity]/create/formConfig";

import { getGames } from "@/app/services/gameService";
import { getChampionships } from "@/app/services/championshipService";
import { getTeams } from "@/app/services/teamService";

// Importe os métodos corretos de cada service
import {
  createUser,
  getUserById,
  updateUser,
} from "@/app/services/userService";
import {
  createGame,
  getGameById,
  updateGame,
} from "@/app/services/gameService";
import {
  createChampionship,
  getChampionshipById,
  updateChampionship,
} from "@/app/services/championshipService";
import {
  createTeam,
  getTeamById,
  updateTeam,
} from "@/app/services/teamService";
// Atenção: importe com os nomes corretos definidos em matchService.js
import {
  getMatchById,
  createMatch,
  updateMatch,
} from "@/app/services/matchService";

export default function AdminCreateForm({ entity, id }) {
  const router = useRouter();
  const isEdit = Boolean(id);
  const baseFields = formFieldsConfig[entity] || [];
  const [fields, setFields] = useState(baseFields);
  // Mapeamento de serviços por entidade
  const serviceMap = {
    user: {
      getById: getUserById,
      create: createUser,
      update: updateUser,
    },
    game: {
      getById: getGameById,
      create: createGame,
      update: updateGame,
    },
    championship: {
      getById: getChampionshipById,
      create: createChampionship,
      update: updateChampionship,
    },
    team: {
      getById: getTeamById,
      create: createTeam,
      update: updateTeam,
    },
    match: {
      getById: getMatchById,
      create: createMatch,
      update: updateMatch,
    },
    // Adicione outras entidades se houver
  };

  // Verifica se existe service para a entidade
  const service = serviceMap[entity];
  if (!service) {
    // Se der o caso de chamar com entidade inválida, exiba mensagem
    return <p className="text-danger">Entidade "{entity}" não suportada.</p>;
  }

  // Estado para valores do formulário e dados auxiliares
  const [values, setValues] = useState({});
  // Armazenar URLs existentes de campos file, para preview: ex.: logo, image, image_championship etc.
  const [existingFiles, setExistingFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOptions() {
      const updatedFields = await Promise.all(
        baseFields.map(async (field) => {
          if (field.type === "select" && field.optionsKey) {
            try {
              if (field.optionsKey === "games") {
                const data = await getGames(0, 50);
                const options = data.content.map((g) => ({
                  value: g.id,
                  label: g.name,
                }));
                return { ...field, options };
              }
              if (field.optionsKey === "championships") {
                const data = await getChampionships(0, 50);
                const options = data.content.map((c) => ({
                  value: c.id,
                  label: c.name,
                }));
                return { ...field, options };
              }
              if (field.optionsKey === "teams") {
                const data = await getTeams(0, 50);
                const options = data.content.map((t) => ({
                  value: t.id,
                  label: t.name,
                }));
                return { ...field, options };
              }
            } catch (err) {
              console.error("Erro ao carregar opções para", field.name, err);
              return { ...field, options: [] };
            }
          }
          return field;
        })
      );
      setFields(updatedFields);
    }
    loadOptions();
  }, [entity]);

  // Carrega item para edição, se isEdit
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      setError(null);
      service
        .getById(id)
        .then((data) => {
          // data: JSON retornado pelo backend
          // Popula `values` com campos do form e `existingFiles` com URLs para preview
          const initValues = {};
          const initExisting = {};
          fields.forEach((field) => {
            const fname = field.name;
            if (field.type === "file") {
              // Em edição, se o backend retorna URL (string) no campo fname, salve em existingFiles
              if (data[fname]) {
                initExisting[fname] = data[fname];
              }
              // O input file fica vazio inicialmente
              initValues[fname] = "";
            } else {
              // Para campos normais: se data tiver a propriedade, use; senão '', evitando undefined
              if (data[fname] !== undefined && data[fname] !== null) {
                // Se for data do tipo date e backend retornar data-hora, talvez precise substring
                if (field.type === "date" && typeof data[fname] === "string") {
                  // Tenta pegar 'YYYY-MM-DD' de 'YYYY-MM-DDTHH:MM:SS...'
                  initValues[fname] = data[fname].slice(0, 10);
                } else {
                  initValues[fname] = data[fname];
                }
              } else {
                initValues[fname] = "";
              }
            }
          });
          setValues(initValues);
          setExistingFiles(initExisting);
        })
        .catch((err) => {
          console.error(`Erro ao buscar ${entity} para edição:`, err);
          setError(`Falha ao carregar dados de ${entity}`);
        })
        .finally(() => setLoading(false));
    } else {
      // Criação: inicializa todos valores como ''
      const init = {};
      fields.forEach((field) => {
        init[field.name] = "";
      });
      setValues(init);
      setExistingFiles({});
    }
  }, [entity, id]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setValues((prev) => ({ ...prev, [name]: file }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validações básicas: campos obrigatórios
    for (const field of fields) {
      const fname = field.name;
      const val = values[fname];
      if (field.type === "file") {
        // Em criação, val precisa existir; em edição, pode manter existente
        if (!isEdit && !val) {
          setError(`Selecione o arquivo para ${field.label}`);
          return;
        }
        // Em edição, se val for vazio e já existir existingFiles[fname], tudo bem
        if (isEdit && !val && existingFiles[fname]) {
          // OK
        }
      } else {
        // campo texto, select, date etc.
        if (!val) {
          setError(`Preencha o campo ${field.label}`);
          return;
        }
      }
    }

    try {
      setLoading(true);

      // Monta payload: decide entre FormData ou JSON
      // Se existir ao menos um campo file e o valor atual for File (upload novo), usamos FormData
      let useFormData = false;
      for (const field of fields) {
        if (field.type === "file" && values[field.name] instanceof File) {
          useFormData = true;
          break;
        }
      }

      let payload;
      if (useFormData) {
        payload = new FormData();
        // Para cada field, anexa a FormData
        fields.forEach((field) => {
          const fname = field.name;
          const val = values[fname];
          if (field.type === "file") {
            if (val instanceof File) {
              payload.append(fname, val);
            }
            // Se em edição não selecionou novo arquivo (val vazio) e existingFiles[fname] existe, não faz append;
            // assume-se que backend mantém o arquivo anterior se não enviado.
          } else {
            // Alguns campos podem precisar de conversão; ex.: select que dá string, mas API espera number
            if (field.type === "select") {
              // Se as opções forem value string representando número, converta:
              const intVal = parseInt(val, 10);
              if (!isNaN(intVal) && String(intVal) === String(val)) {
                payload.append(fname, intVal);
              } else {
                payload.append(fname, val);
              }
            } else {
              payload.append(fname, val);
            }
          }
        });
      } else {
        // JSON puro
        payload = {};
        fields.forEach((field) => {
          const fname = field.name;
          const val = values[fname];
          if (field.type === "file") {
            // Se só aceita URL: se val vazio e existingFiles[fname] existe, talvez envie existingFiles[fname]
            if (isEdit && existingFiles[fname]) {
              payload[fname] = existingFiles[fname];
            }
            // Se criar e campo file for tratado como URL, então values[fname] pode conter URL como string
            else if (val) {
              payload[fname] = val;
            }
          } else if (field.type === "select") {
            // tenta converter para number se fizer sentido
            const intVal = parseInt(val, 10);
            payload[fname] =
              !isNaN(intVal) && String(intVal) === String(val) ? intVal : val;
          } else {
            payload[fname] = val;
          }
        });
      }

      // Chama service.create ou update
      if (isEdit) {
        await service.update(id, values);
        alert(`${entity} atualizado com sucesso`);
      } else {
        await service.create(values);
        alert(`${entity} criado com sucesso`);
      }
      // Redireciona para listagem genérica
      router.push(`/admin/${entity}`);
    } catch (err) {
      console.error(`Erro ao submeter formulário ${entity}:`, err);
      // Se o service lançar Error com mensagem, use-a; ou else mensagem genérica
      setError(err.message || "Falha ao salvar");
    } finally {
      setLoading(false);
    }
  };

  // Loading inicial em edição
  if (isEdit && loading && Object.keys(values).length === 0) {
    return <p className="text-white">Carregando dados para edição...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-danger">{error}</p>}

      {fields.map((field) => {
        const { name, label, type, placeholder, options } = field;
        // Se file: mostra preview se existir existingFiles[name], e input file
        if (type === "file") {
          return (
            <div key={name} className="mb-3">
              <label className="form-label">{label}</label>
              {existingFiles[name] && (
                <div className="mb-2">
                  <p className="text-white small">Arquivo atual:</p>
                  {/* Supondo que seja imagem; se for outro tipo de arquivo, ajuste preview */}
                  <img
                    src={existingFiles[name]}
                    alt={`${label} atual`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                name={name}
                className="form-control"
                onChange={handleChange}
                // Se quiser aceitar só imagem: accept="image/*"
              />
            </div>
          );
        }
        // Se textarea
        if (type === "textarea") {
          return (
            <div key={name} className="mb-3">
              <label className="form-label">{label}</label>
              <textarea
                name={name}
                className="form-control"
                placeholder={placeholder || ""}
                value={values[name] || ""}
                onChange={handleChange}
              />
            </div>
          );
        }
        // Se select
        if (type === "select") {
          return (
            <div key={name} className="mb-3">
              <label className="form-label">{label}</label>
              <select
                name={name}
                className="form-select"
                value={values[name] || ""}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                {options &&
                  options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            </div>
          );
        }
        // input normal: text, email, password, date, time, number etc.
        return (
          <div key={name} className="mb-3">
            <label className="form-label">{label}</label>
            <input
              type={type}
              name={name}
              className="form-control"
              placeholder={placeholder || ""}
              value={values[name] ?? ""}
              onChange={handleChange}
            />
          </div>
        );
      })}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {isEdit ? "Atualizar" : "Criar"}
      </button>
    </form>
  );
}
