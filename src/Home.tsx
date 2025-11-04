import './Home.css'
import api from './api/api' // Assumindo que 'api' é uma instância do Axios ou fetch wrapper
import CampoDeBusca from './CampoDeBusca'; // Importa o componente CampoDeBusca

import { useState, useEffect, useCallback } from 'react'

type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string,
  categoria: string // Incluindo categoria para referência, se for necessário
}

function Home() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar ou listar todos os produtos
  const fetchProdutos = useCallback(async (termo: string) => {
    setLoading(true);
    setError(null);
    
    // Define o endpoint: se houver termo, usa a busca; senão, lista todos
    const endpoint = termo.trim()
      ? `/produtos/buscar?q=${encodeURIComponent(termo)}`
      : "/produtos";

    try {
      const response = await api.get(endpoint);
      setProdutos(response.data);
      console.log(`Produtos carregados para o termo: "${termo}"`);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Falha ao carregar os produtos. Verifique o servidor.");
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }, []); // Dependências vazias, pois a função é baseada apenas no 'termo'

  // Efeito para reagir à mudança do termo de busca (incluindo o primeiro carregamento)
  useEffect(() => {
    // Chama a função de busca
    fetchProdutos(termoBusca);
  }, [termoBusca, fetchProdutos]); // Depende de termoBusca e fetchProdutos

  // Função para atualizar o estado do termo de busca, que dispara o useEffect
  const handleBuscaChange = (valor: string) => {
    setTermoBusca(valor);
  };

  function adicionarCarrinho(produtoId: string) {
    api.post("/adicionarItem", { produtoId, quantidade: 1 })
    .then(() => alert("Produto adicionado ao carrinho!"))
    .catch((error) => alert('Error adding to cart:' + error?.mensagem))
  }

  return (
    <>
      <a href='/Carrinho'>Ir para o Carrinho</a>
      <div>Lista de Produtos</div>
      
      {/* 1. Integração do Campo de Busca */}
      <CampoDeBusca 
        valor={termoBusca}
        onChange={handleBuscaChange}
        placeholder="Buscar bolos por nome ou categoria..."
      />

      {/* 2. Feedback de Carregamento e Erro */}
      {loading && <p>Carregando ou buscando bolos de pote...</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

      {/* 3. Exibição da Lista de Produtos (apenas se não estiver carregando e sem erro) */}
      {!loading && !error && (
        <div>
          {produtos.length === 0 ? (
            <p>Nenhum bolo de pote encontrado.</p>
          ) : (
            produtos.map((produto) => (
              <div key={produto._id}>
                <h2>{produto.nome}</h2>
                <p>Preço: R$ {produto.preco}</p>
                <img src={produto.urlfoto} alt={produto.nome} width="200" />
                <p>Descrição: {produto.descricao}</p>
                <button onClick={()=>adicionarCarrinho(produto._id)}>Adicionar ao carrinho</button>
              </div>
            ))
          )}
        </div>
      )}
    </>
  )
}

export default Home;