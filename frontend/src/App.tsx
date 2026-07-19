import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/AppShell'
import PosPage from './routes/PosPage'
import PlaceholderPage from './routes/PlaceholderPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <PosPage /> },
      { path: 'orders', element: <PlaceholderPage title="Orders" issue="issue #6" /> },
      { path: 'tables', element: <PlaceholderPage title="Tables" issue="issue #5" /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
