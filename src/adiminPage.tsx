import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPageController.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string; 
}

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você não tem permissão para acessar esta área.");
      return;
    }

    axios
      .get("http://localhost:8000/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsuarios(res.data))
      .catch((err) => {
        console.error(err);
        setErro("Acesso negado ou erro ao carregar usuários.");
      });
  }, []);

  if (erro) {
    return <p className="erro">{erro}</p>;
  }

  return (
    <div className="admin-container">
      <h1> Painel Administrativo</h1>
      <p>Listagem de todos os usuários cadastrados no sistema</p>

      {usuarios.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.cargo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}