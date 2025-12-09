import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { X, Plus, Users, Anchor, Crown, UserPlus, LogOut as LeaveIcon, Play, Copy, Check, Hash } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface CrewMember {
  id: string
  name: string
  characterName: string
  role: 'captain' | 'member'
}

interface Crew {
  id: string
  name: string
  captainId: string
  members: CrewMember[]
  maxMembers: number
  isActive: boolean
  sessionId?: string
}

interface CrewLobbyProps {
  onClose: () => void
  userId: string
  userName: string
  projectId: string
  accessToken: string
  onStartSession: (sessionId: string) => void
}

export function CrewLobby({ onClose, userId, userName, projectId, accessToken, onStartSession }: CrewLobbyProps) {
  const [crews, setCrews] = useState<Crew[]>([])
  const [myCrew, setMyCrew] = useState<Crew | null>(null)
  const [newCrewName, setNewCrewName] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [joinByIdInput, setJoinByIdInput] = useState('')
  const [joinByIdCharacter, setJoinByIdCharacter] = useState('')

  useEffect(() => {
    loadCrews()
    loadMyCrew()
  }, [])

  const loadCrews = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/crews`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setCrews(data.crews || [])
      }
    } catch (error) {
      console.error('Error loading crews:', error)
    }
  }

  const loadMyCrew = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/my-crew`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setMyCrew(data.crew)
      }
    } catch (error) {
      console.error('Error loading my crew:', error)
    }
  }

  const createCrew = async () => {
    if (!newCrewName.trim()) {
      toast.error('Digite um nome para a tripulação')
      return
    }

    if (!selectedCharacter.trim()) {
      toast.error('Digite o nome do seu personagem')
      return
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/crew`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: newCrewName,
            characterName: selectedCharacter,
          }),
        }
      )

      if (response.ok) {
        toast.success('Tripulação criada!')
        setNewCrewName('')
        setSelectedCharacter('')
        loadCrews()
        loadMyCrew()
      } else {
        toast.error('Erro ao criar tripulação')
      }
    } catch (error) {
      console.error('Error creating crew:', error)
      toast.error('Erro ao criar tripulação')
    }
  }

  const joinCrew = async (crewId: string) => {
    if (!selectedCharacter.trim()) {
      toast.error('Digite o nome do seu personagem')
      return
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/crew/${crewId}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            characterName: selectedCharacter,
          }),
        }
      )

      if (response.ok) {
        toast.success('Você entrou na tripulação!')
        setSelectedCharacter('')
        loadCrews()
        loadMyCrew()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao entrar na tripulação')
      }
    } catch (error) {
      console.error('Error joining crew:', error)
      toast.error('Erro ao entrar na tripulação')
    }
  }

  const leaveCrew = async () => {
    if (!myCrew) return

    if (!confirm('Tem certeza que deseja sair da tripulação?')) {
      return
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/crew/${myCrew.id}/leave`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        toast.success('Você saiu da tripulação')
        setMyCrew(null)
        loadCrews()
      } else {
        toast.error('Erro ao sair da tripulação')
      }
    } catch (error) {
      console.error('Error leaving crew:', error)
      toast.error('Erro ao sair da tripulação')
    }
  }

  const startSession = async () => {
    if (!myCrew) return

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/crew/${myCrew.id}/start-session`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        toast.success('Sessão iniciada!')
        onStartSession(data.sessionId)
      } else {
        toast.error('Erro ao iniciar sessão')
      }
    } catch (error) {
      console.error('Error starting session:', error)
      toast.error('Erro ao iniciar sessão')
    }
  }

  const copyCrewId = (crewId: string) => {
    // Fallback method for copying text
    const textArea = document.createElement('textarea')
    textArea.value = crewId
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      textArea.remove()
      setCopiedId(crewId)
      toast.success('ID copiado!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      textArea.remove()
      toast.error('Erro ao copiar ID')
    }
  }

  const joinCrewById = async () => {
    if (!joinByIdInput.trim()) {
      toast.error('Digite o ID da tripulação')
      return
    }

    if (!joinByIdCharacter.trim()) {
      toast.error('Digite o nome do seu personagem')
      return
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/crew/${joinByIdInput}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            characterName: joinByIdCharacter,
          }),
        }
      )

      if (response.ok) {
        toast.success('Você entrou na tripulação!')
        setJoinByIdInput('')
        setJoinByIdCharacter('')
        loadCrews()
        loadMyCrew()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao entrar na tripulação')
      }
    } catch (error) {
      console.error('Error joining crew by ID:', error)
      toast.error('Erro ao entrar na tripulação')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-yellow-500">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 flex items-center justify-between border-b-4 border-yellow-400">
          <h2 className="text-3xl font-['Pirata_One'] flex items-center gap-3">
            <Anchor className="w-8 h-8 text-white" />
            Encontrar Tripulação
          </h2>
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
          <Tabs defaultValue={myCrew ? 'my-crew' : 'find'} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="find" className="data-[state=active]:bg-blue-600">
                <Users className="w-4 h-4 mr-2" />
                Encontrar Tripulação
              </TabsTrigger>
              <TabsTrigger value="my-crew" className="data-[state=active]:bg-blue-600">
                <Anchor className="w-4 h-4 mr-2" />
                Minha Tripulação
              </TabsTrigger>
            </TabsList>

            {/* Encontrar Tripulação */}
            <TabsContent value="find" className="space-y-4">
              {!myCrew && (
                <>
                  <Card className="bg-slate-800 border-yellow-500">
                    <CardHeader>
                      <CardTitle className="text-yellow-400">Criar Nova Tripulação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Nome da Tripulação</Label>
                        <Input
                          value={newCrewName}
                          onChange={(e) => setNewCrewName(e.target.value)}
                          placeholder="Ex: Piratas do Chapéu de Palha"
                          className="bg-slate-700 border-yellow-500 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Seu Personagem</Label>
                        <Input
                          value={selectedCharacter}
                          onChange={(e) => setSelectedCharacter(e.target.value)}
                          placeholder="Nome do seu personagem"
                          className="bg-slate-700 border-yellow-500 text-white"
                        />
                      </div>
                      <Button
                        onClick={createCrew}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Tripulação
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-blue-500">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Entrar por ID</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-300">ID da Tripulação</Label>
                        <Input
                          value={joinByIdInput}
                          onChange={(e) => setJoinByIdInput(e.target.value)}
                          placeholder="Cole o ID que seu amigo compartilhou"
                          className="bg-slate-700 border-blue-500 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Seu Personagem</Label>
                        <Input
                          value={joinByIdCharacter}
                          onChange={(e) => setJoinByIdCharacter(e.target.value)}
                          placeholder="Nome do seu personagem"
                          className="bg-slate-700 border-blue-500 text-white"
                        />
                      </div>
                      <Button
                        onClick={joinCrewById}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!joinByIdInput.trim() || !joinByIdCharacter.trim()}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        Entrar com ID
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-['Pirata_One'] text-yellow-400">Tripulações Disponíveis</h3>
                
                {crews.filter(crew => crew.members.length < crew.maxMembers).length === 0 && (
                  <Card className="bg-slate-800 border-gray-600">
                    <CardContent className="p-8 text-center">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">Nenhuma tripulação disponível no momento</p>
                      <p className="text-sm text-gray-500 mt-2">Crie sua própria tripulação acima!</p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {crews
                    .filter(crew => crew.members.length < crew.maxMembers)
                    .map(crew => (
                      <Card key={crew.id} className="bg-slate-800 border-blue-500 hover:border-yellow-500 transition-colors">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-bold text-yellow-400">{crew.name}</h4>
                              <p className="text-sm text-gray-400">
                                Capitão: {crew.members.find(m => m.role === 'captain')?.name || 'Desconhecido'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Users className="w-4 h-4" />
                              {crew.members.length}/{crew.maxMembers}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">Membros:</p>
                            <div className="flex flex-wrap gap-2">
                              {crew.members.map(member => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full text-sm"
                                >
                                  {member.role === 'captain' && <Crown className="w-3 h-3 text-yellow-400" />}
                                  <span>{member.characterName}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {!myCrew && (
                            <div className="space-y-2">
                              <Input
                                placeholder="Nome do seu personagem"
                                value={selectedCharacter}
                                onChange={(e) => setSelectedCharacter(e.target.value)}
                                className="bg-slate-700 border-blue-500 text-white text-sm"
                              />
                              <Button
                                onClick={() => joinCrew(crew.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Entrar na Tripulação
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>

            {/* Minha Tripulação */}
            <TabsContent value="my-crew" className="space-y-4">
              {myCrew ? (
                <>
                  <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-yellow-500 border-2">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-3xl font-['Pirata_One'] text-yellow-400">
                            {myCrew.name}
                          </CardTitle>
                          <p className="text-sm text-gray-400 mt-2">
                            Tripulação • {myCrew.members.length}/{myCrew.maxMembers} membros
                          </p>
                        </div>
                        <Button
                          onClick={() => copyCrewId(myCrew.id)}
                          variant="outline"
                          size="sm"
                          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                        >
                          {copiedId === myCrew.id ? (
                            <><Check className="w-4 h-4 mr-2" /> Copiado</>
                          ) : (
                            <><Copy className="w-4 h-4 mr-2" /> ID</>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {myCrew.members.map(member => (
                          <div
                            key={member.id}
                            className={`p-4 rounded-lg ${
                              member.role === 'captain'
                                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-black'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {member.role === 'captain' ? (
                                <Crown className="w-5 h-5" />
                              ) : (
                                <Users className="w-5 h-5" />
                              )}
                              <span className="font-bold">
                                {member.role === 'captain' ? 'Capitão' : 'Tripulante'}
                              </span>
                            </div>
                            <p className="text-sm opacity-90">{member.name}</p>
                            <p className="font-bold">{member.characterName}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-700">
                        {myCrew.captainId === userId && (
                          <Button
                            onClick={startSession}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Iniciar Sessão
                          </Button>
                        )}
                        <Button
                          onClick={leaveCrew}
                          variant="outline"
                          className="flex-1 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <LeaveIcon className="w-4 h-4 mr-2" />
                          Sair da Tripulação
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-blue-500">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Como funciona?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-gray-300">
                      <p>• O <strong className="text-yellow-400">Capitão</strong> pode iniciar sessões de jogo</p>
                      <p>• Compartilhe o <strong className="text-yellow-400">ID da tripulação</strong> com seus amigos</p>
                      <p>• Membros podem entrar usando o ID</p>
                      <p>• Quando todos estiverem prontos, inicie a sessão!</p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-slate-800 border-gray-600">
                  <CardContent className="p-12 text-center">
                    <Anchor className="w-20 h-20 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">Você não está em nenhuma tripulação</h3>
                    <p className="text-gray-500 mb-6">Crie uma nova tripulação ou entre em uma existente!</p>
                    <Button
                      onClick={() => {
                        const findTab = document.querySelector('[value="find"]') as HTMLButtonElement
                        findTab?.click()
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Procurar Tripulações
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}