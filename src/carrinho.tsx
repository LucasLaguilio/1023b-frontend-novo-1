// Carrinho.tsx

import './Home.css'
import api from './api/api'
import { useState, useEffect } from 'react'
import axios from 'axios' // Importa axios para tipagem de erro

type ItemCarrinho = {
  _id?: string,
  produtoId: string,
  nome: string,
  precoUnitario: number,
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

function Carrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [produtos, setProdutos] = useState<ProdutoType[]>([])

  useEffect(() => {
    // Busca produtos para ter acesso às fotos e descrições
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

  function removerCarrinho() {
    // O backend usa req.usuarioId do token.
    api.delete("/carrinho")
      .then(() => {
        setItens([])
        alert("Carrinho esvaziado!")
      })
      .catch((error) => {
        // CORREÇÃO: Acessa a mensagem de erro do backend corretamente
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
        // CORREÇÃO: Acessa a mensagem de erro do backend corretamente
        const mensagem = axios.isAxiosError(error) ? error.response?.data?.message || 'Erro desconhecido.' : 'Erro de rede.';
        alert(`Erro ao remover unidade do item: ${mensagem}`);
      })
  }


  function getDadosProduto(produtoId: string) {
    const produto = produtos.find(p => p._id === produtoId)
    return produto || { urlfoto: '', descricao: 'Produto não encontrado' }
  }

  const totalCarrinho = itens.reduce((acc, item) => 
    acc + (item.precoUnitario * item.quantidade), 0
  ).toFixed(2)

  return (
    <>
      <div>🛒 Carrinho de Compras</div>
      <a href='/'>← Voltar para Produtos</a>
      
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
            const dadosProduto = getDadosProduto(item.produtoId)
            return (
              <div key={item.produtoId}>
                <img 
                  src={item.urlfoto || dadosProduto.urlfoto} 
                  alt={item.nome} 
                  width="100" 
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

          <div>
            <h3>Total da Compra: R$ {totalCarrinho}</h3>
          </div>
        </>
      )}
    </>
  )
}

export default Carrinho