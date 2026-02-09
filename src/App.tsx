import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Layout } from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Roulette from './pages/Roulette'
import Products from './pages/Products'
import MyInfo from './pages/MyInfo'

/**
 * 앱 진입점: 라우팅 및 인증 제공
 * - /login: 로그인 (미인증 접근)
 * - /: 인증 필요, 하단 탭바 레이아웃 (홈/룰렛/상품/내 정보)
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="roulette" element={<Roulette />} />
            <Route path="products" element={<Products />} />
            <Route path="my" element={<MyInfo />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
