import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/AppShell'
import RequireAuth from './components/RequireAuth'
import PosPage from './routes/PosPage'
import OrdersPage from './routes/OrdersPage'
import KdsPage from './routes/KdsPage'
import TablesPage from './routes/TablesPage'
import MenuPage from './routes/MenuPage'
import ReportsPage from './routes/ReportsPage'
import LoginPage from './routes/LoginPage'
import { AuthProvider } from './features/auth/AuthContext'
import { OrdersProvider } from './features/orders/OrdersStore'
import { TablesProvider } from './features/tables/TablesStore'
import { MenuProvider } from './features/menu/MenuStore'
import { HeldBillsProvider } from './features/held/HeldBillsStore'

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
          { path: 'reports', element: <ReportsPage /> },
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
            <HeldBillsProvider>
              <RouterProvider router={router} />
            </HeldBillsProvider>
          </OrdersProvider>
        </TablesProvider>
      </MenuProvider>
    </AuthProvider>
  )
}
