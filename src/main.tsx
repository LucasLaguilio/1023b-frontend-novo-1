import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter , Routes , Route} from 'react-router-dom'
import Login from './login.tsx'
import Carrinho from './carrinho.tsx'
import Home from './Home.tsx'
import AdicionarProdutos from './addprodutos.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path='/adicionarprodutos' element={<AdicionarProdutos/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
