import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { User, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Slider } from './ui/slider'

export interface Character {
  id?: string
  name: string
  epithet: string
  age: number
  gender: string
  race: string
  origin: string
  devilFruit: string
  devilFruitType: string
  haki: string[]
  role: string
  appearance: string
  personality: string
  backstory: string
  photoUrl?: string
  photoPath?: string
  
  // Atributos
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  
  // Habilidades
  navigation: number
  medicine: number
  cooking: number
  shipwright: number
  musicianship: number
  archaeology: number
  
  // Combate
  bounty: number
  level: number
  hp: number
  maxHp: number
  
  // Histórico de Sessões
  sessionHistory?: SessionProgress[]
}

export interface SessionProgress {
  sessionId: string
  sessionDate: string
  storyProgress: string
  notes: string
  levelGained?: number
  itemsObtained?: string[]
  xpGained?: number
}

interface CharacterFormProps {
  onSave: (character: Character) => Promise<void>
  onUploadPhoto: (file: File) => Promise<{ url: string; path: string }>
  initialData?: Character
}

export function CharacterForm({ onSave, onUploadPhoto, initialData }: CharacterFormProps) {
  const [character, setCharacter] = useState<Character>(initialData || {
    name: '',
    epithet: '',
    age: 18,
    gender: 'masculino',
    race: 'humano',
    origin: '',
    devilFruit: 'Nenhuma',
    devilFruitType: 'N/A',
    haki: [],
    role: 'combatente',
    appearance: '',
    personality: '',
    backstory: '',
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    navigation: 0,
    medicine: 0,
    cooking: 0,
    shipwright: 0,
    musicianship: 0,
    archaeology: 0,
    bounty: 0,
    level: 1,
    hp: 20,
    maxHp: 20,
  })

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const updateField = (field: keyof Character, value: any) => {
    setCharacter(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho do arquivo (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem é muito grande! Por favor, escolha uma imagem menor que 2MB.')
      return
    }

    setIsUploading(true)
    try {
      // Comprimir imagem
      const compressedFile = await compressImage(file)
      const { url, path } = await onUploadPhoto(compressedFile)
      setCharacter(prev => ({ ...prev, photoUrl: url, photoPath: path }))
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Erro ao fazer upload da foto. Tente uma imagem menor.')
    } finally {
      setIsUploading(false)
    }
  }

  // Função para comprimir imagem
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Redimensionar se maior que 800px
          const maxSize = 800
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          } else if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                reject(new Error('Falha ao comprimir imagem'))
              }
            },
            'image/jpeg',
            0.8
          )
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave(character)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleHaki = (hakiType: string) => {
    setCharacter(prev => ({
      ...prev,
      haki: prev.haki.includes(hakiType)
        ? prev.haki.filter(h => h !== hakiType)
        : [...prev.haki, hakiType]
    }))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="attributes">Atributos</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="combat">Combate</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Foto do Personagem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  {character.photoUrl ? (
                    <img
                      src={character.photoUrl}
                      alt={character.name}
                      className="w-40 h-40 rounded-full object-cover border-4 border-yellow-400"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-yellow-400">
                      <User className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button type="button" disabled={isUploading} asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? 'Enviando...' : 'Upload de Foto'}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Personagem *</Label>
                  <Input
                    id="name"
                    value={character.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Ex: Monkey D. Luffy"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="epithet">Epíteto/Alcunha</Label>
                  <Input
                    id="epithet"
                    value={character.epithet}
                    onChange={(e) => updateField('epithet', e.target.value)}
                    placeholder="Ex: Chapéu de Palha"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      value={character.age || ''}
                      onChange={(e) => updateField('age', parseInt(e.target.value) || 18)}
                      min={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select value={character.gender} onValueChange={(v) => updateField('gender', v)}>
                      <SelectTrigger id="gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="race">Raça</Label>
                  <Select value={character.race} onValueChange={(v) => updateField('race', v)}>
                    <SelectTrigger id="race">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="humano">Humano</SelectItem>
                      <SelectItem value="tritão">Tritão</SelectItem>
                      <SelectItem value="homem-peixe">Homem-Peixe</SelectItem>
                      <SelectItem value="mink">Mink</SelectItem>
                      <SelectItem value="gigante">Gigante</SelectItem>
                      <SelectItem value="anão">Anão (Tontatta)</SelectItem>
                      <SelectItem value="braço-longo">Braço-Longo</SelectItem>
                      <SelectItem value="perna-longa">Perna-Longa</SelectItem>
                      <SelectItem value="cyborg">Cyborg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin">Origem (Mar/Ilha)</Label>
                  <Input
                    id="origin"
                    value={character.origin}
                    onChange={(e) => updateField('origin', e.target.value)}
                    placeholder="Ex: East Blue - Vila Foosha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Função na Tripulação</Label>
                  <Select value={character.role} onValueChange={(v) => updateField('role', v)}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="capitão">Capitão</SelectItem>
                      <SelectItem value="imediato">Imediato</SelectItem>
                      <SelectItem value="navegador">Navegador</SelectItem>
                      <SelectItem value="atirador">Atirador</SelectItem>
                      <SelectItem value="cozinheiro">Cozinheiro</SelectItem>
                      <SelectItem value="médico">Médico</SelectItem>
                      <SelectItem value="arqueólogo">Arqueólogo</SelectItem>
                      <SelectItem value="carpinteiro">Carpinteiro Naval</SelectItem>
                      <SelectItem value="músico">Músico</SelectItem>
                      <SelectItem value="timoneiro">Timoneiro</SelectItem>
                      <SelectItem value="combatente">Combatente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Akuma no Mi (Fruta do Diabo)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="devilFruit">Nome da Fruta</Label>
                  <Input
                    id="devilFruit"
                    value={character.devilFruit}
                    onChange={(e) => updateField('devilFruit', e.target.value)}
                    placeholder="Ex: Gomu Gomu no Mi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="devilFruitType">Tipo</Label>
                  <Select value={character.devilFruitType} onValueChange={(v) => updateField('devilFruitType', v)}>
                    <SelectTrigger id="devilFruitType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N/A">Nenhuma</SelectItem>
                      <SelectItem value="paramecia">Paramecia</SelectItem>
                      <SelectItem value="zoan">Zoan</SelectItem>
                      <SelectItem value="zoan-ancestral">Zoan Ancestral</SelectItem>
                      <SelectItem value="zoan-mítica">Zoan Mítica</SelectItem>
                      <SelectItem value="logia">Logia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Haki</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={character.haki.includes('observação')}
                    onChange={() => toggleHaki('observação')}
                    className="w-4 h-4"
                  />
                  <span>Haki da Observação (Kenbunshoku Haki)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={character.haki.includes('armamento')}
                    onChange={() => toggleHaki('armamento')}
                    className="w-4 h-4"
                  />
                  <span>Haki do Armamento (Busoshoku Haki)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={character.haki.includes('conquistador')}
                    onChange={() => toggleHaki('conquistador')}
                    className="w-4 h-4"
                  />
                  <span>Haki do Rei/Conquistador (Haoshoku Haki)</span>
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Descrições</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appearance">Aparência</Label>
                  <Textarea
                    id="appearance"
                    value={character.appearance}
                    onChange={(e) => updateField('appearance', e.target.value)}
                    placeholder="Descreva a aparência física do seu personagem..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personality">Personalidade</Label>
                  <Textarea
                    id="personality"
                    value={character.personality}
                    onChange={(e) => updateField('personality', e.target.value)}
                    placeholder="Descreva a personalidade e comportamento..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backstory">História/Origem</Label>
                  <Textarea
                    id="backstory"
                    value={character.backstory}
                    onChange={(e) => updateField('backstory', e.target.value)}
                    placeholder="Conte a história do seu personagem..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attributes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Atributos Principais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Força (STR)</Label>
                    <span className="font-bold">{character.strength}</span>
                  </div>
                  <Slider
                    value={[character.strength]}
                    onValueChange={([v]) => updateField('strength', v)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Destreza (DEX)</Label>
                    <span className="font-bold">{character.dexterity}</span>
                  </div>
                  <Slider
                    value={[character.dexterity]}
                    onValueChange={([v]) => updateField('dexterity', v)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Constituição (CON)</Label>
                    <span className="font-bold">{character.constitution}</span>
                  </div>
                  <Slider
                    value={[character.constitution]}
                    onValueChange={([v]) => updateField('constitution', v)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Inteligência (INT)</Label>
                    <span className="font-bold">{character.intelligence}</span>
                  </div>
                  <Slider
                    value={[character.intelligence]}
                    onValueChange={([v]) => updateField('intelligence', v)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Sabedoria (WIS)</Label>
                    <span className="font-bold">{character.wisdom}</span>
                  </div>
                  <Slider
                    value={[character.wisdom]}
                    onValueChange={([v]) => updateField('wisdom', v)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Carisma (CHA)</Label>
                    <span className="font-bold">{character.charisma}</span>
                  </div>
                  <Slider
                    value={[character.charisma]}
                    onValueChange={([v]) => updateField('charisma', v)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Habilidades Especializadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Navegação</Label>
                    <span className="font-bold">+{character.navigation}</span>
                  </div>
                  <Slider
                    value={[character.navigation]}
                    onValueChange={([v]) => updateField('navigation', v)}
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Medicina</Label>
                    <span className="font-bold">+{character.medicine}</span>
                  </div>
                  <Slider
                    value={[character.medicine]}
                    onValueChange={([v]) => updateField('medicine', v)}
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Culinária</Label>
                    <span className="font-bold">+{character.cooking}</span>
                  </div>
                  <Slider
                    value={[character.cooking]}
                    onValueChange={([v]) => updateField('cooking', v)}
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Carpintaria Naval</Label>
                    <span className="font-bold">+{character.shipwright}</span>
                  </div>
                  <Slider
                    value={[character.shipwright]}
                    onValueChange={([v]) => updateField('shipwright', v)}
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Música</Label>
                    <span className="font-bold">+{character.musicianship}</span>
                  </div>
                  <Slider
                    value={[character.musicianship]}
                    onValueChange={([v]) => updateField('musicianship', v)}
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Arqueologia</Label>
                    <span className="font-bold">+{character.archaeology}</span>
                  </div>
                  <Slider
                    value={[character.archaeology]}
                    onValueChange={([v]) => updateField('archaeology', v)}
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="combat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Combate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Nível</Label>
                  <Input
                    id="level"
                    type="number"
                    value={character.level || ''}
                    onChange={(e) => updateField('level', parseInt(e.target.value) || 1)}
                    min={1}
                    max={20}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hp">HP Atual</Label>
                    <Input
                      id="hp"
                      type="number"
                      value={character.hp || ''}
                      onChange={(e) => updateField('hp', parseInt(e.target.value) || 0)}
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxHp">HP Máximo</Label>
                    <Input
                      id="maxHp"
                      type="number"
                      value={character.maxHp || ''}
                      onChange={(e) => updateField('maxHp', parseInt(e.target.value) || 1)}
                      min={1}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bounty">Recompensa (Berries)</Label>
                  <Input
                    id="bounty"
                    type="number"
                    value={character.bounty || ''}
                    onChange={(e) => updateField('bounty', parseInt(e.target.value) || 0)}
                    min={0}
                    placeholder="0"
                  />
                  {character.bounty > 0 && (
                    <p className="text-sm text-muted-foreground">
                      ฿{character.bounty.toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Personagem'}
          </Button>
        </div>
      </form>
    </>
  )
}