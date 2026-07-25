import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/AppShell'
import RequireAuth from './components/RequireAuth'
import PosPage from './routes/PosPage'
import OrdersPage from './routes/OrdersPage'
import KdsPage from './routes/KdsPage'
import TablesPage from './routes/TablesPage'
import MenuPage from './routes/MenuPage'
import ReportsPage from './routes/ReportsPage'
import CustomersPage from './routes/CustomersPage'
import InventoryPage from './routes/InventoryPage'
import FinancePage from './routes/FinancePage'
import StaffPage from './routes/StaffPage'
import LoginPage from './routes/LoginPage'
import { AuthProvider } from './features/auth/AuthContext'
import { OrdersProvider } from './features/orders/OrdersStore'
import { TablesProvider } from './features/tables/TablesStore'
import { MenuProvider } from './features/menu/MenuStore'
import { HeldBillsProvider } from './features/held/HeldBillsStore'
import { InventoryProvider } from './features/inventory/InventoryStore'
import { ExpensesProvider } from './features/finance/ExpensesStore'
import { StaffProvider } from './features/staff/StaffStore'

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
          { path: 'customers', element: <CustomersPage /> },
          { path: 'inventory', element: <InventoryPage /> },
          { path: 'finance', element: <FinancePage /> },
          { path: 'staff', element: <StaffPage /> },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <InventoryProvider>
          <TablesProvider>
            <OrdersProvider>
              <HeldBillsProvider>
                <ExpensesProvider>
                  <StaffProvider>
                    <RouterProvider router={router} />
                  </StaffProvider>
                </ExpensesProvider>
              </HeldBillsProvider>
            </OrdersProvider>
          </TablesProvider>
        </InventoryProvider>
      </MenuProvider>
    </AuthProvider>
  )
}
