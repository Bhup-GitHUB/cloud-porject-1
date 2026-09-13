function ScoreBar({ label, value, tone, emphasis }) {
  const trackHeight = emphasis ? 'h-2' : 'h-1.5'
  const fillTone =
    tone === 'match'
      ? 'bg-emerald-500'
      : tone === 'affinity'
        ? 'bg-blue-500'
        : 'bg-slate-400'
  const labelTone = emphasis
    ? 'text-slate-700 font-medium'
    : 'text-slate-500'

  return (
    <div>
      <div className={`mb-1 flex items-center justify-between text-xs ${labelTone}`}>
        <span>{label}</span>
        <span className="tabular-nums">{value}%</span>
      </div>
      <div className={`w-full overflow-hidden rounded-full bg-slate-200 ${trackHeight}`}>
        <div
          className={`${trackHeight} rounded-full ${fillTone} transition-all duration-300`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function Stars({ rating }) {
  const fullStars = Math.round(rating)

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 ${
              i < fullStars ? 'text-amber-400' : 'text-slate-200'
            }`}
            fill="currentColor"
          >
            <path d="m12 2.6 2.9 5.87 6.48.94-4.69 4.57 1.11 6.45L12 17.38l-5.8 3.05 1.11-6.45L2.62 9.4l6.48-.94z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-medium tabular-nums text-slate-600">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

export default function ProductCard({ product, onView }) {
  const matchPercent = Math.round(product.score * 100)
  const popularityPercent = Math.round(product.popularityScore * 100)
  const affinityPercent = Math.round(product.affinityScore * 100)

  return (
    <div
      onClick={() => onView(product.id)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
          {product.category}
        </span>
        {affinityPercent > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Recommended for you
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold leading-snug text-slate-900">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-lg font-semibold tabular-nums tracking-tight text-slate-900">
            ${product.price.toFixed(2)}
          </p>
          <Stars rating={product.rating} />
        </div>

        <p className="mt-1 text-xs text-slate-500">
          {product.salesCount.toLocaleString()} sold
        </p>

        <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          <ScoreBar
            label="Match"
            value={matchPercent}
            tone="match"
            emphasis
          />
          <ScoreBar label="Popularity" value={popularityPercent} tone="popularity" />
          <ScoreBar label="Your interest" value={affinityPercent} tone="affinity" />
          <p className="pt-0.5 text-xs text-slate-400">
            Viewed {product.viewCount}{' '}
            {product.viewCount === 1 ? 'time' : 'times'}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onView(product.id)
          }}
          className="btn-secondary mt-4 w-full"
        >
          View product
        </button>
      </div>
    </div>
  )
}
