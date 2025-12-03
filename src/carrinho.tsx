// Carrinho.tsx


import api from './api/api'
import { useState, useEffect } from 'react'
import axios from 'axios'

// TIPAGENS
type ItemCarrinho = {
  _id?: string,
  produtoId?: string,
  nome?: string,
  precoUnitario?: number,
  preco?: number,
  urlfoto?: string,
  descricao?: string,
  quantidade: number
}

type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string
}

//  NOVO: Tipos dos filtros
type Filtros = {
  nome: string;
  precoMin: string;
  precoMax: string;
}

function Carrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [produtos, setProdutos] = useState<ProdutoType[]>([])

  //  NOVO: estados dos filtros
  const [filtros, setFiltros] = useState<Filtros>({
    nome: "",
    precoMin: "",
    precoMax: ""
  })

  // ------------------------- BUSCAR PRODUTOS + CARRINHO -------------------------
  const buscarCarrinho = () => {
    const query = new URLSearchParams({
      nome: filtros.nome || "",
      precoMin: filtros.precoMin || "",
      precoMax: filtros.precoMax || "",
    }).toString();

    // Busca o carrinho (API pode retornar { itens: [...] } ou um array direto)
    api.get(`/carrinho?${query}`)
      .then((response) => {
        const raw = response.data || []
        const itensCarrinho = Array.isArray(raw) ? raw : (raw.itens || [])

        // Filtra localmente (robusto para diferentes formatos de back-end)
        const precoValor = (item: any) => {
          if (typeof item.precoUnitario === 'number') return item.precoUnitario
          if (typeof item.preco === 'number') return item.preco
          return 0
        }

        const nomeFiltro = filtros.nome.trim().toLowerCase()
        const min = filtros.precoMin ? parseFloat(filtros.precoMin) : null
        const max = filtros.precoMax ? parseFloat(filtros.precoMax) : null

        const filtrados = itensCarrinho.filter((item: any) => {
          const nomeOk = nomeFiltro ? (item.nome || '').toLowerCase().includes(nomeFiltro) : true
          const preco = precoValor(item)
          const precoOk = (min === null || preco >= min) && (max === null || preco <= max)
          return nomeOk && precoOk
        })

        setItens(Array.isArray(filtrados) ? filtrados : [])
      })
      .catch((error) => console.error("Erro ao carregar carrinho:", error))
  }

  useEffect(() => {
    api.get("/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error('Error fetching products:', error))

    // Busca carrinho
    api.get("/carrinho")
      .then((response) => {
        // Pega itens de response.data.itens ou do próprio response.data se não for o formato completo
        // Pega itens de response.data.itens ou do próprio response.data se não for o formato completo
        const itensCarrinho = response.data.itens || response.data
        setItens(Array.isArray(itensCarrinho) ? itensCarrinho : [])
      })
  }, [])

  // ------------------------- FUNÇÕES ANTIGAS (NÃO MEXI) -------------------------
  function removerCarrinho() {
    api.delete("/carrinho")
      .then(() => {
        setItens([])
        alert("Carrinho esvaziado!")
      })
      .catch((error) => {
        const mensagem = axios.isAxiosError(error) ? error.response?.data?.message || 'Erro desconhecido.' : 'Erro de rede.';
        alert(`Erro ao remover carrinho: ${mensagem}`);
      })
  }
  


  // Sheron: Função para remover uma unidade de um item do carrinho
  function removerunidadeItem(produtoId: string) {
    api.post("/removerunidadeItem", { produtoId })
      .then((response) => {
        // MELHORIA: Usa os dados do carrinho ATUALIZADO retornados pelo backend para sincronizar o estado
        const itensAtualizados = response.data.itens || [];
        setItens(itensAtualizados);
        alert("Uma unidade do item foi removida do carrinho!");
      })
      .catch((error) => {
        const mensagem = axios.isAxiosError(error) ? error.response?.data?.message || 'Erro desconhecido.' : 'Erro de rede.';
        alert(`Erro ao remover unidade do item: ${mensagem}`);
      })
  }

  function getDadosProduto(produtoId: string) {
    const produto = produtos.find(p => p._id === produtoId)
    return produto || { urlfoto: '', descricao: 'Produto não encontrado' }
  }

  const obterPrecoItem = (item: any) => (typeof item.precoUnitario === 'number' ? item.precoUnitario : (typeof item.preco === 'number' ? item.preco : 0))

  const totalCarrinho = itens.reduce((acc, item) => 
    acc + (obterPrecoItem(item) * (item.quantidade || 0)), 0
  ).toFixed(2)

  // ------------------------- TELA -------------------------
  return (
    <>
      <div>🛒 Carrinho de Compras</div>
      <a href='/'>← Voltar para Produtos</a>
      
      <div>
        <h2>Itens no Carrinho ({itens.length})</h2>
        {itens.length > 0 && (
          <button onClick={removerCarrinho} className="esvaziar-carrinho-btn"> {/* CLASSE PARA O BOTÃO ESVAZIAR */}
            🗑️ Esvaziar Carrinho
          </button>
        )}
      </div>

      {itens.length === 0 ? (
        <p className="carrinho-vazio-mensagem">Seu carrinho está vazio.</p> 
      ) : (
        <>
          {itens.map((item) => {
            const dadosProduto = getDadosProduto(item.produtoId || item._id || '')
            const preco = obterPrecoItem(item)
            const key = item.produtoId || item._id || item.nome || Math.random().toString()
            return (
              <div key={item.produtoId}>
                <img 
                  src={item.urlfoto || dadosProduto.urlfoto} 
                  alt={item.nome} 
                  className="item-carrinho-card-imagem" // CLASSE PARA A IMAGEM
                />
                <h3>{item.nome}</h3>
                <p>{item.descricao || dadosProduto.descricao}</p>
                <p>Preço Unitário: R$ {item.precoUnitario.toFixed(2)}</p>
                <p>Quantidade: {item.quantidade}</p>
                <p>Subtotal: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</p>
                {}
                <button onClick={() => removerunidadeItem(item.produtoId)}>
                  Remover Uma Unidade
                </button>
              </div>
            )
          })}

          <div className="carrinho-resumo-total"> {/* CLASSE PARA O RESUMO TOTAL */}
            <h3>Total da Compra: R$ {totalCarrinho}</h3>
          </div>
        </>
      )} 
    </div>
  )
}

export default Carrinho