export interface Promotion {
    id: string
    title: string
    description: string
    imageUrl: string
    start_date: string
    end_date: string
    time_remaining?: string
    discount: {
      type: 'percentage' | 'fixed' | 'free'
      value: number
    },
    suggest: boolean
  }