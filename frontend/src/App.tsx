import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/AppShell'
import RequireAuth from './components/RequireAuth'
import PosPage from './routes/PosPage'
import OrdersPage from './routes/OrdersPage'
import KdsPage from './routes/KdsPage'
import TablesPage from './routes/TablesPage'
import MenuPage from './routes/MenuPage'
import LoginPage from './routes/LoginPage'
import { AuthProvider } from './features/auth/AuthContext'
import { OrdersProvider } from './features/orders/OrdersStore'
import { TablesProvider } from './features/tables/TablesStore'
import { MenuProvider } from './features/menu/MenuStore'

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
          { path: 'tables', element: <TablesPage /> },
          { path: 'menu', element: <MenuPage /> },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <TablesProvider>
          <OrdersProvider>
            <RouterProvider router={router} />
          </OrdersProvider>
        </TablesProvider>
      </MenuProvider>
    </AuthProvider>
  )
}
