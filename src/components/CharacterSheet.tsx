import { Character } from './CharacterForm'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Download, Edit, User, X } from 'lucide-react'
import { jsPDF } from 'jspdf'

interface CharacterSheetProps {
  character: Character
  onClose: () => void
  onEdit: () => void
}

export function CharacterSheet({ character, onClose, onEdit }: CharacterSheetProps) {
  const getModifier = (value: number) => {
    const mod = Math.floor((value - 10) / 2)
    return mod >= 0 ? `+${mod}` : `${mod}`
  }

  const downloadPDF = async () => {
    const pdf = new jsPDF()
    
    // Configuração
    const margin = 20
    let y = margin

    // Título
    pdf.setFontSize(24)
    pdf.setTextColor(0, 102, 204)
    pdf.text('FICHA DE PERSONAGEM', margin, y)
    pdf.setFontSize(16)
    pdf.text('One Piece RPG', margin, y + 10)
    
    y += 25

    // Informações Básicas
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text('INFORMAÇÕES BÁSICAS', margin, y)
    y += 8

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    
    const addLine = (label: string, value: string) => {
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${label}:`, margin, y)
      pdf.setFont('helvetica', 'normal')
      pdf.text(value, margin + 50, y)
      y += 6
    }

    addLine('Nome', character.name)
    if (character.epithet) addLine('Epíteto', character.epithet)
    addLine('Idade', `${character.age} anos`)
    addLine('Gênero', character.gender)
    addLine('Raça', character.race)
    if (character.origin) addLine('Origem', character.origin)
    addLine('Função', character.role)
    
    y += 5

    // Akuma no Mi
    if (character.devilFruit !== 'Nenhuma') {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.text('AKUMA NO MI', margin, y)
      y += 8
      pdf.setFontSize(11)
      addLine('Fruta', character.devilFruit)
      addLine('Tipo', character.devilFruitType)
      y += 5
    }

    // Haki
    if (character.haki.length > 0) {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.text('HAKI', margin, y)
      y += 8
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(11)
      character.haki.forEach(h => {
        pdf.text(`• ${h.charAt(0).toUpperCase() + h.slice(1)}`, margin + 5, y)
        y += 6
      })
      y += 5
    }

    // Atributos
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('ATRIBUTOS', margin, y)
    y += 8
    pdf.setFontSize(11)

    const attributes = [
      ['Força', character.strength],
      ['Destreza', character.dexterity],
      ['Constituição', character.constitution],
      ['Inteligência', character.intelligence],
      ['Sabedoria', character.wisdom],
      ['Carisma', character.charisma],
    ]

    attributes.forEach(([name, value]) => {
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${name}:`, margin, y)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`${value} (${getModifier(value as number)})`, margin + 50, y)
      y += 6
    })

    y += 5

    // Habilidades
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('HABILIDADES', margin, y)
    y += 8
    pdf.setFontSize(11)

    const skills = [
      ['Navegação', character.navigation],
      ['Medicina', character.medicine],
      ['Culinária', character.cooking],
      ['Carpintaria Naval', character.shipwright],
      ['Música', character.musicianship],
      ['Arqueologia', character.archaeology],
    ]

    skills.forEach(([name, value]) => {
      if (value > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${name}:`, margin, y)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`+${value}`, margin + 50, y)
        y += 6
      }
    })

    y += 5

    // Combate
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('COMBATE', margin, y)
    y += 8
    pdf.setFontSize(11)

    addLine('Nível', `${character.level}`)
    addLine('HP', `${character.hp} / ${character.maxHp}`)
    if (character.bounty > 0) {
      addLine('Recompensa', `฿${character.bounty.toLocaleString('pt-BR')}`)
    }

    // Nova página para descrições
    if (character.appearance || character.personality || character.backstory) {
      pdf.addPage()
      y = margin

      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('DESCRIÇÕES', margin, y)
      y += 10

      if (character.appearance) {
        pdf.setFontSize(12)
        pdf.text('Aparência:', margin, y)
        y += 6
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const appearanceLines = pdf.splitTextToSize(character.appearance, 170)
        pdf.text(appearanceLines, margin, y)
        y += appearanceLines.length * 5 + 8
      }

      if (character.personality) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Personalidade:', margin, y)
        y += 6
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const personalityLines = pdf.splitTextToSize(character.personality, 170)
        pdf.text(personalityLines, margin, y)
        y += personalityLines.length * 5 + 8
      }

      if (character.backstory) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('História:', margin, y)
        y += 6
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const backstoryLines = pdf.splitTextToSize(character.backstory, 170)
        pdf.text(backstoryLines, margin, y)
      }
    }

    // Download
    pdf.save(`${character.name.replace(/\s+/g, '_')}_Ficha.pdf`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl">Ficha de Personagem</h2>
          <div className="flex gap-2">
            <Button onClick={downloadPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={onEdit} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header com Foto */}
          <div className="flex items-start gap-6">
            {character.photoUrl ? (
              <img
                src={character.photoUrl}
                alt={character.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-yellow-400">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-3xl mb-1">{character.name}</h3>
              {character.epithet && (
                <p className="text-xl text-muted-foreground mb-2">&quot;{character.epithet}&quot;</p>
              )}
              {character.bounty > 0 && (
                <div className="inline-block bg-yellow-100 border-2 border-yellow-400 px-4 py-2 rounded">
                  <p className="text-sm">WANTED</p>
                  <p className="text-lg">฿{character.bounty.toLocaleString('pt-BR')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Idade</p>
                <p className="font-medium">{character.age} anos</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gênero</p>
                <p className="font-medium capitalize">{character.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Raça</p>
                <p className="font-medium capitalize">{character.race}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Função</p>
                <p className="font-medium capitalize">{character.role}</p>
              </div>
              {character.origin && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Origem</p>
                  <p className="font-medium">{character.origin}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Akuma no Mi */}
          {character.devilFruit !== 'Nenhuma' && (
            <Card>
              <CardHeader>
                <CardTitle>⚡ Akuma no Mi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Fruta do Diabo</p>
                  <p className="font-medium">{character.devilFruit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium capitalize">{character.devilFruitType}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Haki */}
          {character.haki.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>💫 Haki</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {character.haki.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="capitalize">{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Atributos */}
          <Card>
            <CardHeader>
              <CardTitle>Atributos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-muted-foreground">Força</p>
                <p className="text-2xl">{character.strength}</p>
                <p className="text-sm">{getModifier(character.strength)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-muted-foreground">Destreza</p>
                <p className="text-2xl">{character.dexterity}</p>
                <p className="text-sm">{getModifier(character.dexterity)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-muted-foreground">Constituição</p>
                <p className="text-2xl">{character.constitution}</p>
                <p className="text-sm">{getModifier(character.constitution)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-muted-foreground">Inteligência</p>
                <p className="text-2xl">{character.intelligence}</p>
                <p className="text-sm">{getModifier(character.intelligence)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-muted-foreground">Sabedoria</p>
                <p className="text-2xl">{character.wisdom}</p>
                <p className="text-sm">{getModifier(character.wisdom)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-muted-foreground">Carisma</p>
                <p className="text-2xl">{character.charisma}</p>
                <p className="text-sm">{getModifier(character.charisma)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Habilidades */}
          <Card>
            <CardHeader>
              <CardTitle>Habilidades</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {character.navigation > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Navegação</p>
                  <p className="font-medium">+{character.navigation}</p>
                </div>
              )}
              {character.medicine > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Medicina</p>
                  <p className="font-medium">+{character.medicine}</p>
                </div>
              )}
              {character.cooking > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Culinária</p>
                  <p className="font-medium">+{character.cooking}</p>
                </div>
              )}
              {character.shipwright > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Carpintaria</p>
                  <p className="font-medium">+{character.shipwright}</p>
                </div>
              )}
              {character.musicianship > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Música</p>
                  <p className="font-medium">+{character.musicianship}</p>
                </div>
              )}
              {character.archaeology > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Arqueologia</p>
                  <p className="font-medium">+{character.archaeology}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Combate */}
          <Card>
            <CardHeader>
              <CardTitle>Combate</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <p className="text-sm text-muted-foreground">Nível</p>
                <p className="text-3xl">{character.level}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded">
                <p className="text-sm text-muted-foreground">HP Atual</p>
                <p className="text-3xl">{character.hp}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <p className="text-sm text-muted-foreground">HP Máximo</p>
                <p className="text-3xl">{character.maxHp}</p>
              </div>
            </CardContent>
          </Card>

          {/* Descrições */}
          {(character.appearance || character.personality || character.backstory) && (
            <Card>
              <CardHeader>
                <CardTitle>Descrições</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {character.appearance && (
                  <div>
                    <p className="font-medium mb-1">Aparência</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.appearance}
                    </p>
                  </div>
                )}
                {character.personality && (
                  <div>
                    <p className="font-medium mb-1">Personalidade</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.personality}
                    </p>
                  </div>
                )}
                {character.backstory && (
                  <div>
                    <p className="font-medium mb-1">História</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}