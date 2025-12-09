import { Character } from './CharacterForm'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Trash2, Eye, User } from 'lucide-react'

interface CharacterListProps {
  characters: Character[]
  onView: (character: Character) => void
  onDelete: (id: string) => void
}

export function CharacterList({ characters, onView, onDelete }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum personagem criado ainda. Crie seu primeiro pirata!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character) => (
        <Card key={character.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              {character.photoUrl ? (
                <img
                  src={character.photoUrl}
                  alt={character.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-yellow-400">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <CardTitle className="truncate">{character.name}</CardTitle>
                {character.epithet && (
                  <p className="text-sm text-muted-foreground truncate">
                    {character.epithet}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nível:</span>
              <span className="font-medium">{character.level}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Função:</span>
              <span className="font-medium capitalize">{character.role}</span>
            </div>
            {character.bounty > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recompensa:</span>
                <span className="font-medium">฿{character.bounty.toLocaleString('pt-BR')}</span>
              </div>
            )}
            {character.devilFruit !== 'Nenhuma' && (
              <div className="text-sm">
                <span className="text-muted-foreground">Akuma no Mi:</span>
                <p className="font-medium truncate">{character.devilFruit}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => onView(character)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Ficha
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => character.id && onDelete(character.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
