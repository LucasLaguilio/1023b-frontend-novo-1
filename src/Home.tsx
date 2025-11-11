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
                setError('❌ Falha ao carregar os produtos. Verifique o servidor ou sua conexão.') 
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
         await api.post('/logout', {}); 
         localStorage.removeItem('token')
         window.location.replace('/login') 
         
     } catch (error: any) { 
         console.error('Error during logout:', error.response?.data?.mensagem || error.message)
         localStorage.removeItem('token')
         window.location.replace('/login')
     }
 }

    const adicionarCarrinho = async (produtoId: string) => {
        try {
            await api.post('/adicionarItem', { produtoId, quantidade: 1 })
            alert('✅ Produto adicionado ao carrinho com sucesso!')
        } catch (err: any) {
            console.error('Error adding to cart:', err)
            const msg = err?.response?.data?.mensagem ?? err?.message ?? 'Erro ao adicionar ao carrinho. Tente fazer login novamente.'
            alert(`⚠️ ${msg}`)
        }
    }

    const formatarPreco = (preco: number) => {
        return `R$ ${preco.toFixed(2).replace('.', ',')}`;
    };

    return (
        <>  
            <header> 
                <a href="/Carrinho" aria-label="Ver meu Carrinho de Compras">🛒 Ir para o Carrinho</a>
                <button onClick={handleLogout} className='LogoutBtn'>Sair (Logout)</button> 
            </header>

            <h2>🎂 Lista de Bolos e Doces Artesanais</h2>
            
            <CampoDeBusca
                valor={termoBusca}
                onChange={handleBuscaChange}
                placeholder="Buscar bolos por nome ou categoria..."
            />

            {loading && <p className="loading-text">🕒 Carregando ou buscando produtos deliciosos...</p>}
            {error && <p className="error-text">Erro: {error}</p>}

            {!loading && !error && (
                <div className="produto-lista">
                    {produtos.length === 0 ? (
                        <p className="produto-lista-message">😥 Nenhum produto encontrado para o termo "{termoBusca}".</p>
                    ) : (
                        produtos.map((produto) => (
                            <div key={produto._id} className="produto-card">
                                
                                
                                
                                <h2>{produto.nome}</h2>
                                
                                <img 
                                    src={produto.urlfoto} 
                                    alt={`Foto de ${produto.nome}`} 
                                    width="280" 
                                    loading="lazy" 
                                />
                                <span className="produto-preco">{formatarPreco(produto.preco)}</span>
                                <p className="produto-descricao"><span>Descrição:</span> {produto.descricao}</p>
                                
                                <button 
                                    onClick={() => adicionarCarrinho(produto._id)}
                                    aria-label={`Adicionar ${produto.nome} ao carrinho`}
                                >
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                            
                        ))
                    )}
                </div>
            )}
        </>
    )
}

export default Home