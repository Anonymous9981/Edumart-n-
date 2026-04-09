export type HomepageAudience = 'student' | 'teacher'

export interface HomepageProduct {
  id: string
  slug: string
  title: string
  vendor: string
  category: string
  audience: HomepageAudience
  image: string
  rating: number
  reviews: number
  price: number
  finalPrice: number
  discountPercentage: number
  discountType?: 'PERCENTAGE' | 'FIXED'
  discountValue?: number
  schoolClasses?: string[]
  description: string
  featured: boolean
  sceneVideoUrl?: string
}

export interface HomepageData {
  products: HomepageProduct[]
}
