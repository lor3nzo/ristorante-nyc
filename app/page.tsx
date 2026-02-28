'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

const NEIGHBORHOODS = [
  'All', 'West Village', 'East Village', 'Upper West Side', 'Upper East Side',
  'Midtown', "Hell's Kitchen", 'SoHo', 'Tribeca', 'Williamsburg', 'Astoria', 'Arthur Avenue'
]

const PRICES = ['All', '$', '$$', '$$$', '$$$$']

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [neighborhood, setNeighborhood] = useState('All')
  const [price, setPrice] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [neighborhood, price])

  async function fetchRestaurants() {
    setLoading(true)
    let query = supabase
      .from('restaurants')
      .select('*')
      .order('rating', { ascending: false })

    if (neighborhood !== 'All') {
      query = query.ilike('neighborhood', `%${neighborhood}%`)
    }
    if (price !== 'All') {
      query = query.eq('price_level', PRICES.indexOf(price))
    }

    const { data } = await query.limit(100)
    setRestaurants(data || [])
    setLoading(false)
  }

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const priceLabel = (level) => '$'.repeat(level || 1)

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-red-700 text-white py-10 px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">ristorante.nyc</h1>
        <p className="mt-2 text-red-200 text-lg">The best Italian restaurants in New York City</p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-stone-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <select
          value={neighborhood}
          onChange={e => setNeighborhood(e.target.value)}
          className="border border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {NEIGHBORHOODS.map(n => <option key={n}>{n}</option>)}
        </select>
        <select
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {PRICES.map(p => <option key={p}>{p}</option>)}
        </select>
        <span className="text-stone-500 text-sm">{filtered.length} restaurants</span>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-stone-400 col-span-3 text-center py-12">Loading...</p>
        ) : filtered.map(r => (
          <div key={r.place_id} className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-stone-800 text-lg leading-tight">{r.name}</h2>
              <span className="text-green-700 font-medium text-sm ml-2 shrink-0">{priceLabel(r.price_level)}</span>
            </div>
            <p className="text-stone-500 text-sm mb-3">{r.neighborhood?.split(',')[0]}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-500 text-sm">★ {r.rating || 'N/A'}</span>
              <span className="text-stone-400 text-xs">({r.review_count?.toLocaleString()} reviews)</span>
            </div>
            {r.address && <p className="text-stone-400 text-xs mb-4">{r.address}</p>}
            <div className="flex gap-3">
              {r.google_maps_url && (
                <a href={r.google_maps_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs bg-red-700 text-white px-3 py-1.5 rounded-lg hover:bg-red-800 transition">
                  View on Maps
                </a>
              )}
              {r.website && (
                <a href={r.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs border border-stone-300 text-stone-600 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition">
                  Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}