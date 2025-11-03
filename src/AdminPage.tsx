import { useEffect, useState } from "react";
import axios from "axios";
import "./adminPage.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string; 
}

 function AdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você não tem permissão para acessar esta área.");
      return;
    }

  axios.get<Usuario[]>('http://localhost:8000/usuarios', {
    headers: {
      Authorization: `Bearer ${token}`, // token válido
    }
  })
    .then((res: { data: Usuario[] }) => setUsuarios(res.data))
    .catch((err: unknown) => {
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
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}    export default AdminPage;