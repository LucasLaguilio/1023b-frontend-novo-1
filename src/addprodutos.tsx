import './addprodutos.css'
import api from './api/api'

import { useState, useEffect } from 'react'
type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string
}
function AdicionarProdutos() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  useEffect(() => {
    api.get("/produtos")
      .then((response) => {
        console.log(response.data);
        setProdutos(response.data)})
      .catch((error) => console.error('Erro ao buscar produtos:', error))
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
    .catch((error) => alert('Erro ao adicionar produto: ' + error?.mensagem))
    form.reset()

  }


  return (
    <>
      <h2>Cadastro de Produtos</h2>
      <form onSubmit={handleForm}>
        <input type="text" name="nome" placeholder="Nome" />
        <input type="number" name="preco" placeholder="Preço" />
        <input type="text" name="urlfoto" placeholder="URL da Foto" />
        <input type="text" name="descricao" placeholder="Descrição" />
        <button type="submit">Cadastrar</button>
      </form>


    </>
  )
}

export default AdicionarProdutos



