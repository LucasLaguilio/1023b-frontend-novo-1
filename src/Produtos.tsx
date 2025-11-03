import React, { useState } from "react";
import CampoDeBusca from "./CampoDeBusca.tsx"; // caminho relative dentro de src

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
}

const Produtos: React.FC = () => {
  const [busca, setBusca] = useState("");

  const produtos: Produto[] = [
    { id: 1, nome: "Bolo de Brigadeiro", categoria: "Bolo", preco: 10},
    { id: 2, nome: "Bolo de Ninho com Nutella", categoria: "Bolo", preco: 15 },
    { id: 3, nome: "Bolo de 4 Leites", categoria: "Bolo", preco: 10 },
  ];

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Lista de Produtos</h1>

      {}
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
