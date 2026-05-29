import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Test from './pages/Test'
import Resultado from './pages/Resultado'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Ejercicios from './pages/Ejercicios'
import EjerciciosIA from './pages/EjerciciosIA'
import Perfil from './pages/Perfil'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/test" element={<Test />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ejercicios" element={<Ejercicios />} />
          <Route path="/ejercicios-ia" element={<EjerciciosIA />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App