import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Textarea } from './ui/textarea'
import { X, Plus, Trash2, Dices, Users, Sword, ScrollText, Target, Heart, Shield, Save, BookOpen, Book } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { RPGResources } from './RPGResources'

interface Player {
  id: string
  name: string
  hp: number
  maxHp: number
  initiative: number
  conditions: string[]
}

interface Enemy {
  id: string
  name: string
  hp: number
  maxHp: number
  ac: number
  initiative: number
}

interface SessionNote {
  id: string
  text: string
  timestamp: Date
}

interface DMSessionProps {
  onClose: () => void
  sessionId: string
  projectId: string
  accessToken: string
}

export function DMSession({ onClose, sessionId, projectId, accessToken }: DMSessionProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [notes, setNotes] = useState<SessionNote[]>([])
  const [currentTurn, setCurrentTurn] = useState(0)
  const [roundNumber, setRoundNumber] = useState(1)
  const [newNote, setNewNote] = useState('')
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [storyProgress, setStoryProgress] = useState('')
  const [sessionNotes, setSessionNotes] = useState('')
  const [xpAwarded, setXpAwarded] = useState(0)
  const [itemsObtained, setItemsObtained] = useState('')
  const [showResources, setShowResources] = useState(false)

  // Carregar dados da sessão
  useEffect(() => {
    loadSessionData()
  }, [])

  const loadSessionData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/session/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setPlayers(data.players || [])
        setEnemies(data.enemies || [])
        setNotes(data.notes || [])
        setCurrentTurn(data.currentTurn || 0)
        setRoundNumber(data.roundNumber || 1)
        setStoryProgress(data.storyProgress || '')
        setSessionNotes(data.sessionNotes || '')
        setXpAwarded(data.xpAwarded || 0)
        setItemsObtained(data.itemsObtained || '')
      }
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }

  const saveSessionData = async () => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/session/${sessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            players,
            enemies,
            notes,
            currentTurn,
            roundNumber,
            storyProgress,
            sessionNotes,
            xpAwarded,
            itemsObtained,
          }),
        }
      )
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  useEffect(() => {
    saveSessionData()
  }, [players, enemies, notes, currentTurn, roundNumber, storyProgress, sessionNotes, xpAwarded, itemsObtained])

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1
    setDiceResult(result)
    addNote(`🎲 Rolagem: d${sides} = ${result}`)
  }

  const addNote = (text: string) => {
    const newNoteObj: SessionNote = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
    }
    setNotes([newNoteObj, ...notes])
  }

  const addPlayer = () => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: 'Novo Jogador',
      hp: 50,
      maxHp: 50,
      initiative: 0,
      conditions: [],
    }
    setPlayers([...players, newPlayer])
  }

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(players.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id))
  }

  const addEnemy = () => {
    const newEnemy: Enemy = {
      id: Date.now().toString(),
      name: 'Novo Inimigo',
      hp: 30,
      maxHp: 30,
      ac: 12,
      initiative: 0,
    }
    setEnemies([...enemies, newEnemy])
  }

  const updateEnemy = (id: string, updates: Partial<Enemy>) => {
    setEnemies(enemies.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const removeEnemy = (id: string) => {
    setEnemies(enemies.filter(e => e.id !== id))
  }

  const sortByInitiative = () => {
    const allCombatants = [
      ...players.map(p => ({ ...p, type: 'player' as const })),
      ...enemies.map(e => ({ ...e, type: 'enemy' as const })),
    ].sort((a, b) => b.initiative - a.initiative)

    const sortedPlayers = allCombatants.filter(c => c.type === 'player') as Player[]
    const sortedEnemies = allCombatants.filter(c => c.type === 'enemy') as Enemy[]

    setPlayers(sortedPlayers)
    setEnemies(sortedEnemies)
    setCurrentTurn(0)
    toast.success('Ordem de iniciativa organizada!')
  }

  const nextTurn = () => {
    const totalCombatants = players.length + enemies.length
    const newTurn = (currentTurn + 1) % totalCombatants
    
    if (newTurn === 0) {
      setRoundNumber(roundNumber + 1)
      addNote(`⚔️ Rodada ${roundNumber + 1} iniciada!`)
    }
    
    setCurrentTurn(newTurn)
  }

  const allCombatants = [
    ...players.map(p => ({ ...p, type: 'player' })),
    ...enemies.map(e => ({ ...e, type: 'enemy' })),
  ]

  const currentCombatant = allCombatants[currentTurn]

  const saveStoryProgress = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/session/${sessionId}/save-progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            storyProgress,
            sessionNotes,
            xpAwarded,
            itemsObtained: itemsObtained.split(',').map(i => i.trim()).filter(Boolean),
            players: players.map(p => ({ id: p.id, name: p.name })),
          }),
        }
      )

      if (response.ok) {
        toast.success('Progresso salvo nas fichas dos jogadores!')
        addNote(`📝 Progresso da sessão salvo nas fichas dos personagens`)
      } else {
        toast.error('Erro ao salvar progresso')
      }
    } catch (error) {
      console.error('Error saving story progress:', error)
      toast.error('Erro ao salvar progresso')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border-4 border-yellow-600">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 flex items-center justify-between border-b-4 border-yellow-600">
          <h2 className="text-3xl font-['Pirata_One'] flex items-center gap-3">
            <Sword className="w-8 h-8 text-yellow-400" />
            Mesa do Mestre
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowResources(true)} 
              variant="outline" 
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-black"
            >
              <Book className="w-4 h-4 mr-2" />
              Regras
            </Button>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-5rem)]">
          <Tabs defaultValue="combat" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-700">
              <TabsTrigger value="combat" className="data-[state=active]:bg-blue-600">
                <Target className="w-4 h-4 mr-2" />
                Combate
              </TabsTrigger>
              <TabsTrigger value="players" className="data-[state=active]:bg-blue-600">
                <Users className="w-4 h-4 mr-2" />
                Jogadores
              </TabsTrigger>
              <TabsTrigger value="enemies" className="data-[state=active]:bg-blue-600">
                <Sword className="w-4 h-4 mr-2" />
                Inimigos
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-blue-600">
                <ScrollText className="w-4 h-4 mr-2" />
                Notas
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-green-600">
                <BookOpen className="w-4 h-4 mr-2" />
                Progresso
              </TabsTrigger>
            </TabsList>

            {/* Combate */}
            <TabsContent value="combat" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Rolador de Dados */}
                <Card className="bg-slate-800 border-yellow-600">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Rolador de Dados</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[4, 6, 8, 10, 12, 20].map(sides => (
                        <Button
                          key={sides}
                          onClick={() => rollDice(sides)}
                          className="h-16 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          d{sides}
                        </Button>
                      ))}
                    </div>
                    {diceResult !== null && (
                      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-lg text-center">
                        <p className="text-5xl font-bold">{diceResult}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Iniciativa */}
                <Card className="bg-slate-800 border-yellow-600">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Controle de Turno</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Rodada</p>
                      <p className="text-4xl font-bold text-yellow-400">{roundNumber}</p>
                    </div>
                    {currentCombatant && (
                      <div className="bg-blue-900/50 p-4 rounded-lg border-2 border-blue-500">
                        <p className="text-sm text-gray-400">Turno Atual</p>
                        <p className="text-xl font-bold">{currentCombatant.name}</p>
                        <p className="text-sm text-gray-400">
                          {'type' in currentCombatant && currentCombatant.type === 'player' ? '👤 Jogador' : '⚔️ Inimigo'}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={sortByInitiative} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        Ordenar Iniciativa
                      </Button>
                      <Button onClick={nextTurn} className="flex-1 bg-green-600 hover:bg-green-700">
                        Próximo Turno
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Ordem de Iniciativa */}
                <Card className="bg-slate-800 border-yellow-600">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Ordem de Iniciativa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {allCombatants.map((combatant, index) => (
                        <div
                          key={combatant.id}
                          className={`p-3 rounded-lg flex justify-between items-center ${
                            index === currentTurn
                              ? 'bg-blue-600 border-2 border-yellow-400'
                              : 'type' in combatant && combatant.type === 'player'
                              ? 'bg-green-900/30'
                              : 'bg-red-900/30'
                          }`}
                        >
                          <div>
                            <p className="font-bold">{combatant.name}</p>
                            <p className="text-sm text-gray-300">
                              Init: {combatant.initiative} | HP: {combatant.hp}/{combatant.maxHp}
                            </p>
                          </div>
                          {'type' in combatant && combatant.type === 'player' ? (
                            <Users className="w-5 h-5 text-green-400" />
                          ) : (
                            <Sword className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Jogadores */}
            <TabsContent value="players" className="space-y-4">
              <Button onClick={addPlayer} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Jogador
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {players.map(player => (
                  <Card key={player.id} className="bg-slate-800 border-green-600">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <Input
                          value={player.name}
                          onChange={(e) => updatePlayer(player.id, { name: e.target.value })}
                          className="text-xl font-bold bg-slate-700 border-green-500 text-white"
                        />
                        <Button
                          onClick={() => removePlayer(player.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-gray-300">HP Atual</Label>
                          <Input
                            type="number"
                            value={player.hp}
                            onChange={(e) => updatePlayer(player.id, { hp: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border-green-500 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">HP Máximo</Label>
                          <Input
                            type="number"
                            value={player.maxHp}
                            onChange={(e) => updatePlayer(player.id, { maxHp: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border-green-500 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300">Iniciativa</Label>
                        <Input
                          type="number"
                          value={player.initiative}
                          onChange={(e) => updatePlayer(player.id, { initiative: parseInt(e.target.value) || 0 })}
                          className="bg-slate-700 border-green-500 text-white"
                        />
                      </div>

                      {/* Barra de HP */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">HP</span>
                          <span className="text-green-400">{player.hp}/{player.maxHp}</span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              (player.hp / player.maxHp) > 0.5 ? 'bg-green-500' :
                              (player.hp / player.maxHp) > 0.25 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Inimigos */}
            <TabsContent value="enemies" className="space-y-4">
              <Button onClick={addEnemy} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Inimigo
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enemies.map(enemy => (
                  <Card key={enemy.id} className="bg-slate-800 border-red-600">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <Input
                          value={enemy.name}
                          onChange={(e) => updateEnemy(enemy.id, { name: e.target.value })}
                          className="text-xl font-bold bg-slate-700 border-red-500 text-white"
                        />
                        <Button
                          onClick={() => removeEnemy(enemy.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-gray-300 flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            HP
                          </Label>
                          <Input
                            type="number"
                            value={enemy.hp}
                            onChange={(e) => updateEnemy(enemy.id, { hp: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border-red-500 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Max HP</Label>
                          <Input
                            type="number"
                            value={enemy.maxHp}
                            onChange={(e) => updateEnemy(enemy.id, { maxHp: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border-red-500 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            CA
                          </Label>
                          <Input
                            type="number"
                            value={enemy.ac}
                            onChange={(e) => updateEnemy(enemy.id, { ac: parseInt(e.target.value) || 0 })}
                            className="bg-slate-700 border-red-500 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300">Iniciativa</Label>
                        <Input
                          type="number"
                          value={enemy.initiative}
                          onChange={(e) => updateEnemy(enemy.id, { initiative: parseInt(e.target.value) || 0 })}
                          className="bg-slate-700 border-red-500 text-white"
                        />
                      </div>

                      {/* Barra de HP */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">HP</span>
                          <span className="text-red-400">{enemy.hp}/{enemy.maxHp}</span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 transition-all"
                            style={{ width: `${Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Notas */}
            <TabsContent value="notes" className="space-y-4">
              <Card className="bg-slate-800 border-yellow-600">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Adicionar Nota</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escreva uma nota sobre a sessão..."
                    className="bg-slate-700 border-yellow-500 text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newNote.trim()) {
                        addNote(newNote)
                        setNewNote('')
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (newNote.trim()) {
                        addNote(newNote)
                        setNewNote('')
                      }
                    }}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                  >
                    Adicionar Nota
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-yellow-600">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Histórico da Sessão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {notes.map(note => (
                      <div key={note.id} className="bg-slate-700 p-3 rounded-lg">
                        <p className="text-white">{note.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(note.timestamp).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progresso */}
            <TabsContent value="progress" className="space-y-4">
              <Card className="bg-slate-800 border-green-600">
                <CardHeader>
                  <CardTitle className="text-green-400">Progresso da Sessão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={storyProgress}
                    onChange={(e) => setStoryProgress(e.target.value)}
                    placeholder="Descreva o progresso da sessão..."
                    className="bg-slate-700 border-green-500 text-white"
                  />
                  <Textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Adicione notas adicionais..."
                    className="bg-slate-700 border-green-500 text-white"
                  />
                  <Input
                    type="number"
                    value={xpAwarded}
                    onChange={(e) => setXpAwarded(parseInt(e.target.value) || 0)}
                    placeholder="XP concedido"
                    className="bg-slate-700 border-green-500 text-white"
                  />
                  <Input
                    value={itemsObtained}
                    onChange={(e) => setItemsObtained(e.target.value)}
                    placeholder="Itens obtidos (separados por vírgula)"
                    className="bg-slate-700 border-green-500 text-white"
                  />
                  <Button
                    onClick={saveStoryProgress}
                    className="w-full bg-green-600 hover:bg-green-700 text-black"
                  >
                    Salvar Progresso
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* RPG Resources Modal */}
      {showResources && (
        <RPGResources 
          onClose={() => setShowResources(false)} 
        />
      )}
    </div>
  )
}