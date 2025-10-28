import React, { useState } from "react";
import CampoDeBusca from "../CampoDeBusca"; // caminho relativo

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
}

const Produtos: React.FC = () => {
  const [busca, setBusca] = useState("");

  const produtos: Produto[] = [
    { id: 1, nome: "Bolo de Chocolate", categoria: "Doces", preco: 20 },
    { id: 2, nome: "Pão de Queijo", categoria: "Salgados", preco: 5 },
    { id: 3, nome: "Café Expresso", categoria: "Bebidas", preco: 8 },
    { id: 4, nome: "Torta de Morango", categoria: "Doces", preco: 25 },
  ];

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Lista de Produtos</h1>

      {/* Campo de busca reutilizável */}
      <CampoDeBusca
        valor={busca}
        onChange={setBusca}
        placeholder="Buscar por nome ou categoria..."
      />

      <ul>
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((p) => (
            <li key={p.id}>
              <strong>{p.nome}</strong> — {p.categoria} — R${p.preco}
            </li>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </ul>
    </div>
  );
};

export default Produtos;
