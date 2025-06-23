// src/app/admin/[entity]/page.jsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUsers,
  deleteUser,
  getUserByToken,
} from "@/app/services/userService";
import { getGames, deleteGame } from "@/app/services/gameService";
import {
  getChampionships,
  deleteChampionship,
} from "@/app/services/championshipService";
import { getTeams, deleteTeam } from "@/app/services/teamService";
import { getMatches, deleteMatch } from "@/app/services/matchService";

export default function AdminEntityPage({ params }) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [teams, setTeams] = useState([]);
  const [match, setMatch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { entity } = React.use(params);
  const allowed = ["user", "game", "championship", "team", "match"];
  if (!allowed.includes(entity)) {
    return (
      <div className="container py-4">
        <h1 className="text-azul">Seção inválida</h1>
        <p className="text-white">"{entity}" não existe.</p>
      </div>
    );
  }

  const getUser = async () => {
    const token = Cookies.get("token");
    if (!token) router.push("/cadastro")
    const user = await getUserByToken(token);
    
    if (user.role !== "ADMIN") {
      router.push("/");
    }
  };

  useEffect(() => {
    getUser();
    setError(null);
    setLoading(true);


    if (entity === "user") {
      getUsers()
        .then((data) => setUsers(data.content ?? data))
        .catch((err) => {
          console.error("Erro ao carregar usuários:", err);
          setError("Erro ao carregar usuários");
        })
        .finally(() => setLoading(false));
    } else if (entity === "game") {
      getGames()
        .then((data) => setGames(data.content ?? data))
        .catch((err) => {
          console.error("Erro ao carregar jogos:", err);
          setError("Erro ao carregar jogos");
        })
        .finally(() => setLoading(false));
    } else if (entity === "championship") {
      getChampionships()
        .then((data) => setChampionships(data.content ?? data))
        .catch((err) => {
          console.error("Erro ao carregar campeonatos:", err);
          setError("Erro ao carregar campeonatos");
        })
        .finally(() => setLoading(false));
    } else if (entity === "team") {
      getTeams()
        .then((data) => setTeams(data.content ?? data))
        .catch((err) => {
          console.error("Erro ao carregar times:", err);
          setError("Erro ao carregar times");
        })
        .finally(() => setLoading(false));
    } else if (entity === "match") {
      getMatches()
        .then((data) => setMatch(data.content ?? data))
        .catch((err) => {
          console.error("Erro ao carregar partidas:", err);
          setError("Erro ao carregar partidas");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [entity]);

  let items = [];
  let columns = [];

  switch (entity) {
    case "user":
      items = users;
      columns = [
        "ID",
        "Nome",
        "E-mail",
        "Role",
        "Data de Nascimento",
        "Data de Criação",
      ];
      break;
    case "game":
      items = games;
      columns = [
        "ID",
        "Nome",
        "Torneio",
        "Imagem",
        "Descrição",
        "Tags",
        "Lançamento",
        "Gênero",
        "Desenvolvedora",
        "Distribuidora",
        "PEGI",
        "Data de Criação",
      ];
      break;
    case "championship":
      items = championships;
      columns = ["ID", "Nome", "Imagem", "Data de Criação"];
      break;
    case "team":
      items = teams;
      columns = ["ID", "Nome", "Logo", "Data de Criação"];
      break;
    case "match":
      items = match;
      columns = [
        "ID",
        "Data",
        "Horário",
        "Link",
        "ID do Campeonato",
        "Data de Criação",
      ];
      break;
  }

  const title =
    entity.charAt(0).toUpperCase() + entity.slice(1).replace("_", " ");

  const handleDelete = async (id) => {
    if (!confirm("Confirma exclusão?")) return;
    try {
      if (entity === "user") {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else if (entity === "game") {
        await deleteGame(id);
        setGames((prev) => prev.filter((g) => g.id !== id));
      } else if (entity === "championship") {
        await deleteChampionship(id);
        setChampionships((prev) => prev.filter((c) => c.id !== id));
      } else if (entity === "team") {
        await deleteTeam(id);
        setTeams((prev) => prev.filter((t) => t.id !== id));
      } else if (entity === "match") {
        await deleteMatch(id);
        setMatch((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Falha ao deletar. Veja o console.");
    }
  };

  // Auxiliar para imagens (caso haja coluna imagem); similar ao exemplo anterior:
  const normalizeImageSrc = (src) => {
    if (!src) return null;
    if (typeof src !== "string") return null;
    if (
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("/")
    ) {
      return src;
    }
    return `/${src}`;
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="text-azul mb-3">{title}</h1>
        <div className="d-flex justify-content-end mb-3">
          <Link href={`/admin/${entity}/create`} className="btn btn-primary">
            Novo {title} <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      {loading && <p className="text-white">Carregando...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-white">Nenhum {title.toLowerCase()} encontrado.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                // Normaliza imagens se existir
                const imgChamp = normalizeImageSrc(
                  item.imageChampionship ?? item.image
                );
                const imgTeam = normalizeImageSrc(item.logo);
                return (
                  <tr key={item.id}>
                    {entity === "user" && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.name ?? item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.role ?? "—"}</td>
                        <td>{item.born ?? item.birthDate ?? ""}</td>
                        <td>{item.createdAt ?? item.date_creation ?? ""}</td>
                      </>
                    )}
                    {entity === "game" && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          {typeof item.tournament === "object"
                            ? item.tournament.name
                            : item.tournament}
                        </td>
                        <td>
                          {item.image ? (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                position: "relative",
                              }}
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded"
                              />
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                        <td
                          style={{ maxWidth: "150px" }}
                          className="texto-justificado"
                        >
                          {item.description}
                        </td>
                        <td>
                          {Array.isArray(item.tags)
                            ? item.tags.join(", ")
                            : item.tags}
                        </td>
                        <td>{item.release}</td>
                        <td>{item.genre}</td>
                        <td>{item.developer}</td>
                        <td>{item.publisher}</td>
                        <td>{item.ageRating}</td>
                        <td>{item.date_creation ?? item.createdAt}</td>
                      </>
                    )}
                    {entity === "championship" && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          {imgChamp ? (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                position: "relative",
                              }}
                            >
                              <Image
                                src={imgChamp}
                                alt={item.name}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded"
                              />
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                        <td>{item.date_creation ?? item.createdAt}</td>
                      </>
                    )}
                    {entity === "team" && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          {imgTeam ? (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                position: "relative",
                              }}
                            >
                              <Image
                                src={imgTeam}
                                alt={item.name}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded"
                              />
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                        <td>{item.date_creation ?? item.createdAt}</td>
                      </>
                    )}
                    {entity === "match" && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.date ?? item.date}</td>
                        <td>{item.hour ?? item.time}</td>
                        <td>
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Ver
                            </a>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                        <td>{item.championshipId ?? item.championship?.id}</td>
                        <td>{item.teamDTOS}</td>
                        <td>{item.date_creation ?? item.createdAt}</td>
                      </>
                    )}
                    <td>
                      <Link
                        href={`/admin/${entity}/${item.id}/edit`}
                        className="btn btn-sm btn-outline-secondary me-1"
                      >
                        Editar <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Deletar <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
