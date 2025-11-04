import './Home.css'
import api from './api/api'

import { useState, useEffect } from 'react'
type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string
}
function Home() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  useEffect(() => {
    api.get("/produtos")
      .then((response) => {
        console.log(response.data);
        setProdutos(response.data)})
      .catch((error) => console.error('Error fetching data:', error))
  }, [])
  function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string
    }
    api.post("/produtos", data)
    .then((response) => setProdutos([...produtos, response.data]))
    .catch((error) => alert('Error posting data:' + error?.mensagem))
    form.reset()

  }

  function adicionarCarrinho(produtoId: string) {
    api.post("/adicionarItem", { produtoId, quantidade: 1 })
    .then(() => alert("Produto adicionado ao carrinho!"))
    .catch((error) => alert('Error adding to cart:' + error?.mensagem))
  }
  return (
    <>
    
      <a href='/Carrinho'>Ir para o Carrinho</a>
      <div>Lista de Produtos</div>
      {
        produtos.map((produto) => (
          <div key={produto._id}>
            <h2>{produto.nome}</h2>
            <p>Preço:</p>
            <p>R$ {produto.preco}</p>
            <img src={produto.urlfoto} alt={produto.nome} width="200" />
            <p>Descrição:</p>
            <p>{produto.descricao}</p>
            <button onClick={()=>adicionarCarrinho(produto._id)}>Adicionar ao carrinho</button>
          </div>
        ))
      }
    </>
  )
}

export default Home

