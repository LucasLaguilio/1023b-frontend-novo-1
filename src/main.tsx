import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter , Routes , Route} from 'react-router-dom'
import Login from './login.tsx'
import Carrinho from './carrinho.tsx'
import AdminPage from './AdminPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
