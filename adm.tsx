import { useEffect, useState } from "react";
import axios from "axios";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState("");

  const buscarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/usuarios", {
        headers: {
          "x-user-role": "ADMIN", // aqui simulamos o login ADMIN
        },
      });
      setUsuarios(res.data);
    } catch (err: any) {
      setErro(err.response?.data?.error || "Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  return (
    <div className="admin-container">
      <h2>Área Administrativa 👑</h2>
      {erro && <p className="erro">{erro}</p>}

      {usuarios.length > 0 ? (
        <table className="tabela-usuarios">
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
      ) : (
        !erro && <p>Carregando usuários...</p>
      )}
    </div>
  );
}
