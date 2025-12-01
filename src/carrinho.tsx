import './Home.css'
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

// 🔥 NOVO: Tipos dos filtros
type Filtros = {
  nome: string;
  precoMin: string;
  precoMax: string;
}

function Carrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [produtos, setProdutos] = useState<ProdutoType[]>([])

  // 🔥 NOVO: estados dos filtros
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

    buscarCarrinho()
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

  function removerunidadeItem(produtoId: string) {
    api.post("/removerunidadeItem", { produtoId })
      .then((response) => {
        const raw = response.data || {}
        const itensAtualizados = Array.isArray(raw) ? raw : (raw.itens || [])
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

      {/* 🔥 NOVO: BLOCO DE FILTROS */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h3>Filtrar Itens</h3>

        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filtros.nome}
          onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })}
        />

        <input
          type="number"
          placeholder="Preço mínimo"
          value={filtros.precoMin}
          onChange={(e) => setFiltros({ ...filtros, precoMin: e.target.value })}
        />

        <input
          type="number"
          placeholder="Preço máximo"
          value={filtros.precoMax}
          onChange={(e) => setFiltros({ ...filtros, precoMax: e.target.value })}
        />

        <button onClick={buscarCarrinho}>Aplicar Filtros</button>
      </div>

      <div>
        <h2>Itens no Carrinho ({itens.length})</h2>
        {itens.length > 0 && (
          <button onClick={removerCarrinho}>
            🗑️ Esvaziar Carrinho
          </button>
        )}
      </div>

      {itens.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {itens.map((item) => {
            const dadosProduto = getDadosProduto(item.produtoId || item._id || '')
            const preco = obterPrecoItem(item)
            const key = item.produtoId || item._id || item.nome || Math.random().toString()
            return (
              <div key={key}>
                <img 
                  src={item.urlfoto || dadosProduto.urlfoto} 
                  alt={item.nome} 
                  width="100" 
                />
                <h3>{item.nome}</h3>
                <p>{item.descricao || dadosProduto.descricao}</p>
                <p>Preço Unitário: R$ {preco.toFixed(2)}</p>
                <p>Quantidade: {item.quantidade}</p>
                <p>Subtotal: R$ {(preco * item.quantidade).toFixed(2)}</p>

                <button onClick={() => removerunidadeItem(item.produtoId || item._id || '')}>
                  Remover Uma Unidade
                </button>
              </div>
            )
          })}

          <div>
            <h3>Total da Compra: R$ {totalCarrinho}</h3>
          </div>
        </>
      )}
    </>
  )
}

export default Carrinho