import './Home.css'
import api from './api/api'
import CampoDeBusca from './CampoDeBusca'

import { useState, useEffect } from 'react'

type ProdutoType = {
    _id: string
    nome: string
    preco: number
    urlfoto: string
    descricao: string
    categoria: string
}

function Home() {
    const [produtos, setProdutos] = useState<ProdutoType[]>([])
    const [termoBusca, setTermoBusca] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProdutos = async (termo: string) => {
            setLoading(true)
            setError(null)

            const endpoint = termo.trim()
                ? `/produtos/buscar?q=${encodeURIComponent(termo)}`
                : '/produtos'

            try {
                const response = await api.get(endpoint)
                setProdutos(response.data)
                console.log(`Produtos carregados para o termo: "${termo}"`)
            } catch (err: any) {
                console.error('Error fetching data:', err)
                setError('Falha ao carregar os produtos. Verifique o servidor.')
                setProdutos([])
            } finally {
                setLoading(false)
            }
        }

        fetchProdutos(termoBusca)
    }, [termoBusca])

    const handleBuscaChange = (valor: string) => {
        setTermoBusca(valor)
    }

    const handleLogout = async () => {
     try {
         // 1. **Call API to invalidate token on server**
         // The token is automatically sent via Auth middleware if 'api' is configured
         await api.post('/logout', {}); 
         
         // 2. Clear client-side token (ALWAYS necessary)
         localStorage.removeItem('token')
         
         // 3. Navigate with replace to prevent back button access
         window.location.replace('/login') 
         
     } catch (error: any) { // Catch 'any' error type
         console.error('Error during logout:', error.response?.data?.mensagem || error.message)
         
         // FALLBACK: Always log out locally for the user experience, even if server fails
         localStorage.removeItem('token')
         window.location.replace('/login')
     }
 }

    const adicionarCarrinho = async (produtoId: string) => {
        try {
            await api.post('/adicionarItem', { produtoId, quantidade: 1 })
            alert('Produto adicionado ao carrinho!')
        } catch (err: any) {
            console.error('Error adding to cart:', err)
            const msg = err?.response?.data?.mensagem ?? err?.message ?? 'Erro ao adicionar ao carrinho'
            alert(msg)
        }

       
    }

    return (
        <>  <header> <button onClick={() => handleLogout()}>Logout</button> </header>
            <a href="/Carrinho">Ir para o Carrinho</a>
            <div>Lista de Produtos</div>

            <CampoDeBusca
                valor={termoBusca}
                onChange={handleBuscaChange}
                placeholder="Buscar bolos por nome ou categoria..."
            />

            {loading && <p>Carregando ou buscando bolos de pote...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

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
                                <button onClick={() => adicionarCarrinho(produto._id)}>Adicionar ao carrinho</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    )
}

export default Home