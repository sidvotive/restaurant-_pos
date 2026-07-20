import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/AppShell'
import RequireAuth from './components/RequireAuth'
import PosPage from './routes/PosPage'
import OrdersPage from './routes/OrdersPage'
import KdsPage from './routes/KdsPage'
import LoginPage from './routes/LoginPage'
import PlaceholderPage from './routes/PlaceholderPage'
import { AuthProvider } from './features/auth/AuthContext'
import { OrdersProvider } from './features/orders/OrdersStore'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <PosPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'kds', element: <KdsPage /> },
          { path: 'tables', element: <PlaceholderPage title="Tables" issue="issue #5" /> },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <RouterProvider router={router} />
      </OrdersProvider>
    </AuthProvider>
  )
}
