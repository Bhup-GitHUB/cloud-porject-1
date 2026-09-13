import { useEffect, useState } from 'react'
import api from '../api/axios'
import AppHeader from '../components/AppHeader'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleView = async (productId) => {
    await api.post(`/products/${productId}/view`)
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Personalized product ranking
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
            Products ranked for you based on overall popularity and your
            browsing history. Viewing a product raises your interest score and
            re-ranks the list.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Match is the final ranking score
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Popularity comes from sales and ratings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Your interest comes from your views
            </span>
          </div>
        </div>

        {loading ? (
          <div className="surface flex flex-col items-center justify-center px-6 py-20 text-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            <p className="mt-4 text-sm text-slate-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="surface flex flex-col items-center justify-center px-6 py-20 text-center">
            <h3 className="text-sm font-semibold text-slate-900">
              No products available
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Once the catalog is seeded, ranked products will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
