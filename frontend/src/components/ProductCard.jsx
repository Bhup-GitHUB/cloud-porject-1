function formatStars(rating) {
  const fullStars = Math.round(rating)
  return `${'★'.repeat(fullStars)}${'☆'.repeat(5 - fullStars)} ${rating.toFixed(1)}`
}

export default function ProductCard({ product, onView }) {
  const matchPercent = Math.round(product.score * 100)

  return (
    <div
      onClick={() => onView(product.id)}
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full aspect-square object-cover"
      />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900">{product.name}</h3>
          <span className="text-xs font-medium text-blue-700 bg-blue-100 rounded-full px-2 py-1 whitespace-nowrap">
            {product.category}
          </span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-sm text-yellow-500">{formatStars(product.rating)}</p>
        <p className="text-sm text-gray-500">
          {product.salesCount.toLocaleString()} sold
        </p>
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Match</span>
            <span>{matchPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${matchPercent}%` }}
            />
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onView(product.id)
          }}
          className="mt-3 text-sm text-blue-600 hover:underline text-left"
        >
          View
        </button>
      </div>
    </div>
  )
}
