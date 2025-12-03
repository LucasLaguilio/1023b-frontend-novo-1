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

    // Fetch products once on mount and use client-side filtering for search term
    useEffect(() => {
        const fetchProdutos = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await api.get('/produtos')
                // garante que SEMPRE retorna array
                const lista = Array.isArray(response.data) ? response.data : response.data.produtos
                setProdutos(lista || [])
            } catch (err: any) {
                console.error('Erro ao buscar produtos:', err)
                setError('Falha ao carregar produtos.')
                setProdutos([])
            } finally {
                setLoading(false)
            }
        }

        fetchProdutos()
    }, [])

    // aplica filtro local baseado no termo de busca
    const produtosFiltrados = produtos.filter((p) => {
        // defensive: some produtos from API might miss fields or be null
        const termo = termoBusca.trim().toLowerCase()
        if (!termo) return true

        const nome = (p.nome ?? "").toString().toLowerCase()
        const descricao = (p.descricao ?? "").toString().toLowerCase()
        const categoria = (p.categoria ?? "").toString().toLowerCase()
        const urlfoto = (p.urlfoto ?? "").toString().toLowerCase()

        return (
            nome.includes(termo) ||
            descricao.includes(termo) ||
            categoria.includes(termo) ||
            urlfoto.includes(termo)
        )
    })

    const adicionarCarrinho = async (id: string) => {
        try {
            await api.post('/adicionarItem', { produtoId: id, quantidade: 1 })
            alert('Produto adicionado!')
        } catch (err) {
            alert('Erro ao adicionar ao carrinho.')
        }
    }

    const formatarPreco = (preco: number) =>
        `R$ ${preco.toFixed(2).replace('.', ',')}`

    return (
        <>
            <header>
                <a href="/Carrinho">🛒 Ir para o Carrinho</a>
                <button className="LogoutBtn">Sair</button>
            </header>

            <h2>🎂 Lista de Bolos e Doces Artesanais</h2>

            <CampoDeBusca
                valor={termoBusca}
                onChange={setTermoBusca}
                placeholder="Buscar bolos por nome ou categoria..."
            />

            {loading && <p>Carregando...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <div className="produto-lista">
                    {produtosFiltrados.length === 0 ? (
                        <p>Nenhum produto encontrado.</p>
                    ) : (
                        produtosFiltrados.map((p) => (
                            <div key={p._id} className="produto-card">
                                <h2>{p.nome}</h2>
                                <img src={p.urlfoto} width={220} />
                                <span>{formatarPreco(p.preco)}</span>
                                <p>{p.descricao}</p>
                                <button onClick={() => adicionarCarrinho(p._id)}>
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
