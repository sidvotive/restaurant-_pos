import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/AppShell'
import PosPage from './routes/PosPage'
import OrdersPage from './routes/OrdersPage'
import KdsPage from './routes/KdsPage'
import PlaceholderPage from './routes/PlaceholderPage'
import { OrdersProvider } from './features/orders/OrdersStore'

const router = createBrowserRouter([
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
])

export default function App() {
  return (
    <OrdersProvider>
      <RouterProvider router={router} />
    </OrdersProvider>
  )
}
