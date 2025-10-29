import './App.css'
import api from './api/api'
import { useState, useEffect } from 'react'

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
  const [usuarioId, setUsuarioId] = useState<string>('')

  useEffect(() => {
    // Busca produtos para ter acesso às fotos e descrições
    api.get("/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error('Error fetching products:', error))

    // Busca carrinho
    api.get("/carrinho")
      .then((response) => {
        const itensCarrinho = response.data.itens || response.data
        setItens(Array.isArray(itensCarrinho) ? itensCarrinho : [])
        // Pega o usuarioId do response
        if (response.data.usuarioId) {
          setUsuarioId(response.data.usuarioId)
        }
      })
      .catch((error) => console.error('Error fetching cart:', error))
  }, [])

  function removerCarrinho() {
    if (!usuarioId) {
      alert('Usuário não identificado')
      return
    }

    // Como o backend usa req.usuarioId do token, não precisa enviar no body
    api.delete("/carrinho")
      .then(() => {
        setItens([])
        alert("Carrinho esvaziado!")
      })
      .catch((error) => alert('Error removing cart:' + error?.mensagem))
  }

  // Função para buscar dados completos do produto
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
              </div>
            )
          })}

          <div>
            <h3>Total da Compra: R$ {totalCarrinho}</h3>
            <button>Finalizar Compra</button>
          </div>
        </>
      )}
    </>
  )
}

export default Carrinho