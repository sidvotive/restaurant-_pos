import MenuGrid from '../features/pos/MenuGrid'
import CartPanel from '../features/pos/CartPanel'
import HeldBillsBar from '../features/held/HeldBillsBar'
import { CartProvider } from '../features/cart/CartContext'

export default function PosPage() {
  return (
    <CartProvider>
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <h1 className="text-lg font-semibold">Point of Sale</h1>
          </header>
          <HeldBillsBar />
          <MenuGrid />
        </div>
        <CartPanel />
      </div>
    </CartProvider>
  )
}
