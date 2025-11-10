import { useEffect, useState } from "react";
import axios from "axios";
import "./adminPage.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string; 
}

interface ItemCarrinho {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
}

// Interface para o Carrinho retornado pela API (incluindo o nome e email do usuário)
interface Carrinho {
    _id: string; // ID do carrinho (string do ObjectId)
    usuarioId: string;
    usuarioNome: string; 
    usuarioEmail: string; 
    itens: ItemCarrinho[];
    total: number;
    dataAtualizacao: string;
}


function AdminPage() {
  const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você não tem permissão para acessar esta área.");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Buscar carrinhos e usuários em paralelo
    Promise.all([
      axios.get<Carrinho[]>("http://localhost:8000/carrinhos/admin/todos", { headers }),
      axios.get<Usuario[]>("http://localhost:8000/usuarios", { headers }),
    ])
      .then(([carrinhosRes, usuariosRes]) => {
        setCarrinhos(carrinhosRes.data || []);
        setUsuarios(usuariosRes.data || []);
      })
      .catch((err) => {
        console.error(err);
        // Trata erro de permissão (401: Não autenticado, 403: Não autorizado/Admin)
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setErro("Acesso negado. Apenas administradores podem ver esta área.");
        } else {
          setErro("Erro ao carregar dados administrativos.");
        }
      });
  }, []);

  if (erro) {
    return <p className="erro">❌ {erro}</p>;
  }

  return (
    <div className="admin-container">
      <h1>Painel Administrativo</h1>
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

              <th>ID do Carrinho</th>
              <th>Proprietário (Nome)</th>
              <th>Proprietário (Email)</th>
              <th>Total de Itens</th>
              <th>Valor Total</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u: Usuario) => {
              const carrinho = carrinhos.find(
                (c) => c.usuarioId === String(u.id) || c.usuarioId === (u.id as unknown as string)
              );
              const totalItens = carrinho
                ? carrinho.itens.reduce((acc: number, item: ItemCarrinho) => acc + item.quantidade, 0)
                : 0;

              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.tipo}</td>

                  <td>{carrinho ? carrinho._id : "-"}</td>
                  <td>{carrinho ? carrinho.usuarioNome : "-"}</td>
                  <td>{carrinho ? carrinho.usuarioEmail : "-"}</td>
                  <td>{totalItens}</td>
                  <td>{carrinho ? `R$ ${carrinho.total.toFixed(2)}` : "-"}</td>
                  <td>{carrinho ? new Date(carrinho.dataAtualizacao).toLocaleDateString() : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <h2>Resumo de carrinhos</h2>
      <p>Total de carrinhos: {carrinhos.length}</p>
    </div>
  );
}

export default AdminPage;
