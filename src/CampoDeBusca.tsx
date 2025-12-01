import React from "react";

interface CampoDeBuscaProps {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
}

const CampoDeBusca: React.FC<CampoDeBuscaProps> = ({
  valor,
  onChange,
  placeholder = "Buscar...",
}) => {
  return (
    <div className="campo-de-busca-container"> 
        <input
            type="text"
            value={valor}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="campo-de-busca-input" 
            aria-label={placeholder} 
        />
    </div>
  );
};

export default CampoDeBusca;