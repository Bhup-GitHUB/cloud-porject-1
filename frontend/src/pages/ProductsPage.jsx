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
    <div className="min-h-screen bg-gray-100">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <p className="text-gray-500 text-center py-8">
            Loading products...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
