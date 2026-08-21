export interface LiveSport {
  id: string
  name: string
}

export interface LiveTeam {
  name: string
  badge: string
}

export interface LiveSource {
  source: string
  id: string
}

export interface LiveMatch {
  id: string
  title: string
  category: string
  date: number
  poster?: string | null
  popular: boolean
  teams?: {
    home?: LiveTeam
    away?: LiveTeam
  } | null
  sources: LiveSource[]
}

export interface LiveStream {
  id: string
  streamNo: number
  language: string
  hd: boolean
  embedUrl: string
  source: string
}

export interface LiveMatchesPage {
  matches: LiveMatch[]
  liveIds: string[]
  liveCount: number
  total: number
  page: number
  hasMore: boolean
}
