// src/botao-excluir.tsx
import React from "react";

interface BotaoExcluirProps {
  onConfirmar: () => void;
}

export default function BotaoExcluir({ onConfirmar }: BotaoExcluirProps) {
  const confirmarExclusao = () => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
    if (confirmar) onConfirmar();
  };

  return (
    <button
      onClick={confirmarExclusao}
      style={{
        backgroundColor: "#d32f2f",
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "6px 12px",
        cursor: "pointer",
      }}
    >
      Excluir
    </button>
  );
}