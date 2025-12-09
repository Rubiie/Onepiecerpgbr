export interface Character {
  id: string
  user_id: string
  name: string
  race: string
  gender: string
  age: number
  height: string
  weight: string
  appearance: string
  backstory: string
  personality: string
  
  // Akuma no Mi
  akuma_no_mi: string
  akuma_type: 'Paramecia' | 'Zoan' | 'Logia' | 'Nenhuma'
  akuma_abilities: string
  
  // Haki
  has_haki_observation: boolean
  has_haki_armament: boolean
  has_haki_conqueror: boolean
  haki_level: number
  
  // Atributos
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  
  // Stats de Combate
  health_points: number
  max_health_points: number
  stamina: number
  max_stamina: number
  defense: number
  speed: number
  
  // Habilidades
  skills: string[]
  special_abilities: string[]
  fighting_style: string
  
  // Equipamento
  weapons: string[]
  equipment: string[]
  
  // Imagem
  image_url?: string
  
  // Metadados
  level: number
  experience: number
  bounty: number
  crew?: string
  role?: string
  created_at?: string
  updated_at?: string
}

export interface CharacterFormData extends Omit<Character, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}
