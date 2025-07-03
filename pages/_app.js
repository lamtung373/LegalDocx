import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra xem có token không khi load trang
    const token = localStorage.getItem('token')
    const publicRoutes = ['/login', '/']
    
    if (!token && !publicRoutes.includes(router.pathname)) {
      router.push('/login')
    }
  }, [router])

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
