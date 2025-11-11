// Carrinho.tsx

import './Carrinho.css' // Importa o novo CSS
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
        const itensCarrinho = response.data.itens || response.data
        setItens(Array.isArray(itensCarrinho) ? itensCarrinho : [])
      })
      .catch((error) => console.error('Error fetching cart:', error)) // Adicionado tratamento de erro para o carrinho
  }, [])

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

  const totalCarrinho = itens.reduce((acc, item) => 
    acc + (item.precoUnitario * item.quantidade), 0
  ).toFixed(2)

  return (
    <div className="Carrinho-container"> {/* CLASSE PRINCIPAL DO CONTAINER */}
      
      <div className="carrinho-header"> {/* CLASSE PARA O CABEÇALHO SUPERIOR */}
        <div className="carrinho-header-titulo">
          <span className="icone-carrinho">🛒</span> Carrinho de Compras
        </div>
        <a href='/' className="carrinho-header-link-voltar">← Voltar para Produtos</a> {/* CLASSE PARA O LINK */}
      </div>
      
      <div className="carrinho-secao-titulo"> {/* CLASSE PARA O TÍTULO DA SEÇÃO DE ITENS */}
        Itens no Carrinho ({itens.length})
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
            const dadosProduto = getDadosProduto(item.produtoId)
            return (
              <div key={item.produtoId} className="item-carrinho-card"> {/* CLASSE PARA O CARD DE ITEM */}
                
                <img 
                  src={item.urlfoto || dadosProduto.urlfoto} 
                  alt={item.nome} 
                  className="item-carrinho-card-imagem" // CLASSE PARA A IMAGEM
                />
                
                <div className="item-detalhes"> {/* CLASSE PARA OS DETALHES DO ITEM */}
                  <h3>{item.nome}</h3>
                  <p className="descricao-produto">{item.descricao || dadosProduto.descricao}</p> {/* CLASSE PARA A DESCRIÇÃO */}
                </div>

                <div className="item-preco-quantidade-info"> {/* CLASSE PARA INFORMAÇÕES DE PREÇO/QTD */}
                  <p className="item-preco-unitario">Preço Unitário: R$ {item.precoUnitario.toFixed(2)}</p>
                  <p className="item-quantidade">Quantidade: {item.quantidade}</p>
                </div>

                <div className="item-acoes"> {/* CLASSE PARA AÇÕES DO ITEM */}
                  <p className="item-subtotal">Subtotal: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</p>
                  <button 
                    onClick={() => removerunidadeItem(item.produtoId)}
                    className='remover-unidade-btn' // CLASSE PARA O BOTÃO DE REMOVER UNIDADE
                  >
                    Remover Uma Unidade
                  </button>
                </div>
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