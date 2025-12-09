import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Book, Lightbulb, Dices, Calculator, TrendingUp, X, Scroll, Sword, Heart, Shield } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface RPGResourcesProps {
  onClose: () => void
  defaultTab?: string
}

export function RPGResources({ onClose, defaultTab = 'rules' }: RPGResourcesProps) {
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [selectedDice, setSelectedDice] = useState<number>(20)
  const [attributeValue, setAttributeValue] = useState<number>(10)
  const [characterLevel, setCharacterLevel] = useState<number>(1)

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1
    setDiceResult(result)
    setSelectedDice(sides)
  }

  const getModifier = (value: number) => {
    const mod = Math.floor((value - 10) / 2)
    return mod >= 0 ? `+${mod}` : `${mod}`
  }

  const calculateHP = (level: number, conMod: number) => {
    const baseHP = 10
    const hpPerLevel = 6
    return baseHP + (conMod * level) + (hpPerLevel * (level - 1))
  }

  const generateName = () => {
    const firstNames = ['Monkey D.', 'Roronoa', 'Nami', 'Usopp', 'Vinsmoke', 'Nico', 'Franky', 'Brook', 'Tony Tony', 'Portgas D.']
    const lastNames = ['Ace', 'Zoro', 'Sanji', 'Robin', 'Luffy', 'Law', 'Kid', 'Sabo', 'Shanks', 'Teach']
    const first = firstNames[Math.floor(Math.random() * firstNames.length)]
    const last = lastNames[Math.floor(Math.random() * lastNames.length)]
    return `${first} ${last}`
  }

  const [generatedName, setGeneratedName] = useState<string>('')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl flex items-center gap-2">
            <Book className="w-6 h-6" />
            Recursos de RPG
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="rules">
                <Scroll className="w-4 h-4 mr-2" />
                Regras
              </TabsTrigger>
              <TabsTrigger value="tips">
                <Lightbulb className="w-4 h-4 mr-2" />
                Dicas
              </TabsTrigger>
              <TabsTrigger value="dice">
                <Dices className="w-4 h-4 mr-2" />
                Dados
              </TabsTrigger>
              <TabsTrigger value="calculator">
                <Calculator className="w-4 h-4 mr-2" />
                Calculadora
              </TabsTrigger>
              <TabsTrigger value="progression">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progressão
              </TabsTrigger>
            </TabsList>

            {/* Regras */}
            <TabsContent value="rules" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Jogo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold mb-2">Atributos Básicos</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Força (STR):</strong> Poder físico, dano corpo a corpo</li>
                      <li><strong>Destreza (DEX):</strong> Agilidade, esquiva, precisão</li>
                      <li><strong>Constituição (CON):</strong> Resistência, HP, defesa</li>
                      <li><strong>Inteligência (INT):</strong> Raciocínio, conhecimento</li>
                      <li><strong>Sabedoria (WIS):</strong> Percepção, intuição</li>
                      <li><strong>Carisma (CHA):</strong> Persuasão, liderança</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">Modificadores</h3>
                    <p className="text-sm">Modificador = (Valor do Atributo - 10) / 2 (arredondado para baixo)</p>
                    <p className="text-sm mt-2">Exemplo: Força 16 = +3 de modificador</p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">Testes de Habilidade</h3>
                    <p className="text-sm">Role 1d20 + Modificador vs Dificuldade (CD)</p>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li>CD 5: Muito Fácil</li>
                      <li>CD 10: Fácil</li>
                      <li>CD 15: Médio</li>
                      <li>CD 20: Difícil</li>
                      <li>CD 25: Muito Difícil</li>
                      <li>CD 30: Quase Impossível</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">Combate</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Iniciativa:</strong> 1d20 + Modificador de DEX</li>
                      <li><strong>Ataque:</strong> 1d20 + Modificador + Proficiência</li>
                      <li><strong>Dano:</strong> Dado da arma + Modificador</li>
                      <li><strong>Classe de Armadura (CA):</strong> 10 + Modificador de DEX + Armadura</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Akuma no Mi (Frutas do Diabo)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-bold">Paramecia</h3>
                    <p className="text-sm">Concedem habilidades super-humanas variadas. Exemplos: Gomu Gomu no Mi (borracha), Bara Bara no Mi (separação).</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Zoan</h3>
                    <p className="text-sm">Permitem transformação em animais. Ganhe +2 STR e +2 CON na forma híbrida/completa.</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Logia</h3>
                    <p className="text-sm">Transformam o corpo em elemento. Imunidade a ataques não-Haki. Muito poderosas!</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="text-sm"><strong>Desvantagem:</strong> Usuários não podem nadar e ficam fracos em água do mar.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Haki</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-bold">Haki da Observação</h3>
                    <p className="text-sm">Permite sentir a presença de outros, antecipar ataques. +2 em testes de Percepção e Iniciativa.</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Haki do Armamento</h3>
                    <p className="text-sm">Endurece o corpo e permite atingir usuários de Logia. +1d4 de dano em ataques corpo a corpo.</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Haki do Conquistador</h3>
                    <p className="text-sm">Raro! Intimida inimigos fracos. Pode nocautear NPCs com Vontade baixa.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dicas */}
            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Jogadores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      <Sword className="w-4 h-4" />
                      Criação de Personagem
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li>Defina um sonho para seu personagem (ex: ser o Rei dos Piratas)</li>
                      <li>Crie uma backstory interessante com motivação clara</li>
                      <li>Pense na função que você quer ter na tripulação</li>
                      <li>Não precisa começar com Akuma no Mi - pode adquirir depois!</li>
                      <li>Balance seus atributos de acordo com seu papel</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Durante o Jogo
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li>Trabalhe em equipe - One Piece é sobre amizade!</li>
                      <li>Use o ambiente a seu favor em combates</li>
                      <li>Roleplay suas peculiaridades e sonhos</li>
                      <li>Não tenha medo de fugir de lutas impossíveis</li>
                      <li>Interaja com NPCs - podem ter missões secundárias</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Combate Tático
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li>Use ações de ajuda para dar vantagem aos aliados</li>
                      <li>Posicionamento é crucial - evite ser cercado</li>
                      <li>Guarde recursos (Haki, técnicas especiais) para momentos críticos</li>
                      <li>Ataques coordenados podem derrotar inimigos fortes</li>
                      <li>Conheça as fraquezas dos inimigos (Logia precisa de Haki)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Mestres (DM)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Crie ilhas únicas com culturas e problemas diferentes</li>
                    <li>Use recompensas (bounties) para criar senso de progressão</li>
                    <li>Introduza Marine, Piratas e Revolucionários como facções</li>
                    <li>Dê aos jogadores pistas sobre Poneglyphs e tesouros lendários</li>
                    <li>Crie batalhas navais emocionantes entre navios</li>
                    <li>Permita que os jogadores sejam criativos com suas frutas</li>
                    <li>Balance combates: nem muito fácil, nem impossível</li>
                    <li>Use NPCs recorrentes para criar conexões emocionais</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gerador de Nomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">Precisa de inspiração para nomear seu personagem?</p>
                    <Button onClick={() => setGeneratedName(generateName())}>
                      Gerar Nome Aleatório
                    </Button>
                    {generatedName && (
                      <div className="bg-blue-50 p-4 rounded">
                        <p className="font-bold text-lg">{generatedName}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rolador de Dados */}
            <TabsContent value="dice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rolador de Dados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[4, 6, 8, 10, 12, 20].map(sides => (
                      <Button
                        key={sides}
                        onClick={() => rollDice(sides)}
                        variant={selectedDice === sides && diceResult !== null ? 'default' : 'outline'}
                        className="h-20"
                      >
                        <div className="text-center">
                          <Dices className="w-6 h-6 mx-auto mb-1" />
                          <div>d{sides}</div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {diceResult !== null && (
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
                      <p className="text-sm opacity-90">Resultado do d{selectedDice}</p>
                      <p className="text-6xl font-bold my-4">{diceResult}</p>
                      <p className="text-sm opacity-90">
                        {diceResult === selectedDice ? '🎉 Crítico! Acerto Perfeito!' :
                         diceResult === 1 ? '💀 Falha Crítica!' :
                         diceResult >= selectedDice * 0.75 ? '⭐ Ótimo resultado!' :
                         diceResult <= selectedDice * 0.25 ? '😅 Resultado baixo...' :
                         '✓ Resultado normal'}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded space-y-2">
                    <p className="font-bold text-sm">Quando usar cada dado:</p>
                    <ul className="text-sm space-y-1">
                      <li><strong>d4:</strong> Adagas, dano mínimo</li>
                      <li><strong>d6:</strong> Espadas curtas, 1 mão</li>
                      <li><strong>d8:</strong> Espadas longas, armas versáteis</li>
                      <li><strong>d10:</strong> Armas grandes, 2 mãos</li>
                      <li><strong>d12:</strong> Armas gigantes, dano massivo</li>
                      <li><strong>d20:</strong> Testes de habilidade, ataques</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calculadora */}
            <TabsContent value="calculator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calculadora de Atributos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="attr-value">Valor do Atributo</Label>
                    <Input
                      id="attr-value"
                      type="number"
                      value={attributeValue}
                      onChange={(e) => setAttributeValue(parseInt(e.target.value) || 10)}
                      min={1}
                      max={30}
                    />
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-90">Modificador</p>
                    <p className="text-5xl font-bold my-2">{getModifier(attributeValue)}</p>
                    <p className="text-sm opacity-90">
                      Use este valor em testes de habilidade
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-bold">Teste de Habilidade</p>
                      <p>1d20 {getModifier(attributeValue)}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="font-bold">Teste com Vantagem</p>
                      <p>2d20 (maior) {getModifier(attributeValue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calculadora de HP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="char-level">Nível do Personagem</Label>
                    <Input
                      id="char-level"
                      type="number"
                      value={characterLevel}
                      onChange={(e) => setCharacterLevel(parseInt(e.target.value) || 1)}
                      min={1}
                      max={20}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Modificador de Constituição</Label>
                    <p className="text-2xl font-bold">{getModifier(attributeValue)}</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-90">HP Máximo Estimado</p>
                    <p className="text-5xl font-bold my-2">
                      {calculateHP(characterLevel, parseInt(getModifier(attributeValue)))}
                    </p>
                    <p className="text-sm opacity-90">
                      Base: 10 + ({characterLevel} × {getModifier(attributeValue)}) + ({characterLevel - 1} × 6)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tabela de Progressão */}
            <TabsContent value="progression" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tabela de Progressão de Nível</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2">
                          <th className="text-left p-2">Nível</th>
                          <th className="text-left p-2">XP Necessário</th>
                          <th className="text-left p-2">Bônus de Proficiência</th>
                          <th className="text-left p-2">Recursos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { level: 1, xp: 0, prof: 2, features: 'Início da jornada' },
                          { level: 2, xp: 300, prof: 2, features: 'Primeira habilidade especial' },
                          { level: 3, xp: 900, prof: 2, features: 'Aumento de atributo' },
                          { level: 4, xp: 2700, prof: 2, features: 'Feat ou +2 atributo' },
                          { level: 5, xp: 6500, prof: 3, features: 'Ataque extra' },
                          { level: 6, xp: 14000, prof: 3, features: 'Habilidade de função' },
                          { level: 7, xp: 23000, prof: 3, features: 'Aumento de atributo' },
                          { level: 8, xp: 34000, prof: 3, features: 'Feat ou +2 atributo' },
                          { level: 9, xp: 48000, prof: 4, features: 'Despertar (Fruta)' },
                          { level: 10, xp: 64000, prof: 4, features: 'Habilidade poderosa' },
                          { level: 11, xp: 85000, prof: 4, features: 'Ataque triplo' },
                          { level: 12, xp: 100000, prof: 4, features: 'Feat ou +2 atributo' },
                          { level: 13, xp: 120000, prof: 5, features: 'Haki avançado' },
                          { level: 14, xp: 140000, prof: 5, features: 'Habilidade definitiva' },
                          { level: 15, xp: 165000, prof: 5, features: 'Aumento de atributo' },
                          { level: 16, xp: 195000, prof: 5, features: 'Feat ou +2 atributo' },
                          { level: 17, xp: 225000, prof: 6, features: 'Poder Yonko' },
                          { level: 18, xp: 265000, prof: 6, features: 'Domínio completo' },
                          { level: 19, xp: 305000, prof: 6, features: 'Feat ou +2 atributo' },
                          { level: 20, xp: 355000, prof: 6, features: 'Lendário' },
                        ].map((row) => (
                          <tr key={row.level} className="border-b hover:bg-blue-50">
                            <td className="p-2 font-bold">{row.level}</td>
                            <td className="p-2">{row.xp.toLocaleString('pt-BR')}</td>
                            <td className="p-2">+{row.prof}</td>
                            <td className="p-2">{row.features}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Referência de Recompensas (Bounties)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Nível 1-3:</span>
                      <span className="font-bold">฿0 - ฿10.000.000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Nível 4-6:</span>
                      <span className="font-bold">฿10.000.000 - ฿50.000.000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span>Nível 7-9:</span>
                      <span className="font-bold">฿50.000.000 - ฿100.000.000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span>Nível 10-12:</span>
                      <span className="font-bold">฿100.000.000 - ฿300.000.000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span>Nível 13-15:</span>
                      <span className="font-bold">฿300.000.000 - ฿800.000.000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span>Nível 16-18:</span>
                      <span className="font-bold">฿800.000.000 - ฿2.000.000.000</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span>Nível 19-20 (Yonko):</span>
                      <span className="font-bold">฿2.000.000.000+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}