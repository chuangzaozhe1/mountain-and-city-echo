// 背景常量定义

const BASE_URL = import.meta.env.BASE_URL

export interface BackgroundInfo {
  id: string
  image: string
  gradient: string
  category: 'city' | 'nature' | 'indoor' | 'night' | 'special'
}

export const BACKGROUNDS: BackgroundInfo[] = [
  // 城市场景
  {
    id: 'office',
    image: `${BASE_URL}data/images/city_1.jpg`,
    gradient: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
    category: 'city'
  },
  {
    id: 'school_entrance',
    image: `${BASE_URL}data/images/city_1.jpg`,
    gradient: 'linear-gradient(135deg, #00b894 0%, #81ecec 100%)',
    category: 'city'
  },
  {
    id: 'meeting_hall',
    image: `${BASE_URL}data/images/city_1.jpg`,
    gradient: 'linear-gradient(135deg, #636e72 0%, #b2bec3 100%)',
    category: 'city'
  },
  {
    id: 'school_office',
    image: `${BASE_URL}data/images/city_1.jpg`,
    gradient: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
    category: 'city'
  },
  {
    id: 'classroom',
    image: `${BASE_URL}data/images/city_1.jpg`,
    gradient: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
    category: 'city'
  },

  // 夜景场景
  {
    id: 'home_night',
    image: `${BASE_URL}data/images/night_1.jpg`,
    gradient: 'linear-gradient(180deg, #2d3436 0%, #1e272e 100%)',
    category: 'night'
  },
  {
    id: 'chongqing_night',
    image: `${BASE_URL}data/images/night_2.jpg`,
    gradient: 'linear-gradient(180deg, #0c0c1e 0%, #1a1a3e 50%, #2d2d6b 100%)',
    category: 'night'
  },
  {
    id: 'chongqing_station',
    image: `${BASE_URL}data/images/night_2.jpg`,
    gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
    category: 'night'
  },
  {
    id: 'station',
    image: `${BASE_URL}data/images/night_2.jpg`,
    gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
    category: 'night'
  },
  {
    id: 'metro_station',
    image: `${BASE_URL}data/images/night_2.jpg`,
    gradient: 'linear-gradient(135deg, #636e72 0%, #b2bec3 100%)',
    category: 'night'
  },
  {
    id: 'night_market',
    image: `${BASE_URL}data/images/night_2.jpg`,
    gradient: 'linear-gradient(180deg, #1a1a2e 0%, #e74c3c 50%, #f39c12 100%)',
    category: 'night'
  },
  {
    id: 'night_street',
    image: `${BASE_URL}data/images/night_2.jpg`,
    gradient: 'linear-gradient(180deg, #1a1a2e 0%, #e74c3c 50%, #f39c12 100%)',
    category: 'night'
  },

  // 室内场景
  {
    id: 'cafe_interior',
    image: `${BASE_URL}data/images/cafe_1.jpg`,
    gradient: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b0 100%)',
    category: 'indoor'
  },
  {
    id: 'cafe',
    image: `${BASE_URL}data/images/cafe_1.jpg`,
    gradient: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b0 100%)',
    category: 'indoor'
  },
  {
    id: 'restaurant',
    image: `${BASE_URL}data/images/cafe_1.jpg`,
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)',
    category: 'indoor'
  },
  {
    id: 'hotpot_restaurant',
    image: `${BASE_URL}data/images/cafe_1.jpg`,
    gradient: 'linear-gradient(135deg, #d63031 0%, #e17055 50%, #fab1a0 100%)',
    category: 'indoor'
  },

  // 自然场景
  {
    id: 'jinyun_mountain_trail',
    image: `${BASE_URL}data/images/mountain_1.jpg`,
    gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 50%, #dfe6e9 100%)',
    category: 'nature'
  },
  {
    id: 'jinyun_summit',
    image: `${BASE_URL}data/images/mountain_2.jpg`,
    gradient: 'linear-gradient(180deg, #74b9ff 0%, #fdcb6e 100%)',
    category: 'nature'
  },
  {
    id: 'mountain_trail',
    image: `${BASE_URL}data/images/mountain_1.jpg`,
    gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 50%, #81ecec 100%)',
    category: 'nature'
  },
  {
    id: 'mountain_path',
    image: `${BASE_URL}data/images/mountain_1.jpg`,
    gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 50%, #81ecec 100%)',
    category: 'nature'
  },
  {
    id: 'mountain_viewpoint',
    image: `${BASE_URL}data/images/mountain_2.jpg`,
    gradient: 'linear-gradient(180deg, #74b9ff 0%, #a29bfe 50%, #81ecec 100%)',
    category: 'nature'
  },
  {
    id: 'mountain_night',
    image: `${BASE_URL}data/images/night_1.jpg`,
    gradient: 'linear-gradient(180deg, #0a1628 0%, #1a2a4a 50%, #2d4a6a 100%)',
    category: 'nature'
  },
  {
    id: 'mountain_rain',
    image: `${BASE_URL}data/images/night_1.jpg`,
    gradient: 'linear-gradient(180deg, #0a1628 0%, #1a2a4a 50%, #2d4a6a 100%)',
    category: 'nature'
  },
  {
    id: 'dai_lake_picnic',
    image: `${BASE_URL}data/images/mountain_1.jpg`,
    gradient: 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 50%, #56c596 100%)',
    category: 'nature'
  },

  // 特殊场景
  {
    id: 'minsu',
    image: `${BASE_URL}data/images/night_1.jpg`,
    gradient: 'linear-gradient(135deg, #fab1a0 0%, #ffeaa7 100%)',
    category: 'special'
  },
  {
    id: 'romantic',
    image: `${BASE_URL}data/images/romantic_1.jpg`,
    gradient: 'linear-gradient(180deg, #2d3436 0%, #6c5ce7 50%, #a29bfe 100%)',
    category: 'special'
  },
  {
    id: 'desert',
    image: `${BASE_URL}data/images/night_2.jpg`,
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    category: 'special'
  },
  {
    id: 'desert_night',
    image: `${BASE_URL}data/images/night_1.jpg`,
    gradient: 'linear-gradient(180deg, #0c0c1e 0%, #1a1a3e 50%, #2d2d6b 100%)',
    category: 'special'
  }
]

export const BACKGROUND_MAP = new Map(BACKGROUNDS.map(bg => [bg.id, bg]))

export function getBackgroundImage(id: string): string {
  return BACKGROUND_MAP.get(id)?.image || ''
}

export function getBackgroundGradient(id: string): string {
  return BACKGROUND_MAP.get(id)?.gradient || 'linear-gradient(180deg, #1e1e2e 0%, #2d2d44 100%)'
}

export function getBackgroundStyle(id: string): string {
  const bg = BACKGROUND_MAP.get(id)
  if (!bg) return 'linear-gradient(180deg, #1e1e2e 0%, #2d2d44 100%)'

  if (bg.image) {
    return `url(${bg.image}) center/cover no-repeat, ${bg.gradient}`
  }
  return bg.gradient
}

export function getBackgroundsByCategory(category: BackgroundInfo['category']): BackgroundInfo[] {
  return BACKGROUNDS.filter(bg => bg.category === category)
}
