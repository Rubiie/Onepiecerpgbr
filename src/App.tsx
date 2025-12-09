import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js@2'
import { AuthForm } from './components/AuthForm'
import { CharacterForm } from './components/CharacterForm'
import { Character } from './types/character'
import { CharacterList } from './components/CharacterList'
import { CharacterSheet } from './components/CharacterSheet'
import { RPGResources } from './components/RPGResources'
import { DMSession } from './components/DMSession'
import { CrewLobby } from './components/CrewLobby'
import { Header } from './components/Header'
import { Forum } from './components/Forum'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { Button } from './components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { PlusCircle, LogOut, Anchor, Book, Users, Crown } from 'lucide-react'
import { toast, Toaster } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from './utils/supabase/info'

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

function AppContent() {
  const { isDark } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [accessToken, setAccessToken] = useState<string>('')
  const [characters, setCharacters] = useState<Character[]>([])
  const [currentPage, setCurrentPage] = useState<'home' | 'characters'>('home')
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [viewingCharacter, setViewingCharacter] = useState<Character | null>(null)
  const [showResources, setShowResources] = useState(false)
  const [showCrewLobby, setShowCrewLobby] = useState(false)
  const [showDMSession, setShowDMSession] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [pendingImageGeneration, setPendingImageGeneration] = useState<{ race: string; gender: string; appearance: string } | null>(null)

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    if (user) {
      loadCharacters()
    }
  }, [user])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (session?.access_token) {
        setAccessToken(session.access_token)
        setUser(session.user)
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login response:', { data, error })

      if (error) {
        console.error('Login error details:', error)
        
        // Mensagens de erro mais específicas
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos. Verifique suas credenciais ou crie uma conta na aba "Cadastrar".')
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Email não confirmado. Verifique seu email.')
        } else {
          toast.error(`Erro ao fazer login: ${error.message}`)
        }
        return
      }

      if (data.session) {
        setAccessToken(data.session.access_token)
        setUser(data.user)
        toast.success('Login realizado com sucesso!')
      } else {
        toast.error('Erro: sessão não criada')
      }
    } catch (error) {
      console.error('Login exception:', error)
      toast.error('Erro ao fazer login. Tente novamente.')
    }
  }

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting signup for:', email)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      )

      const data = await response.json()
      console.log('Signup response:', { status: response.status, data })

      if (!response.ok) {
        console.error('Signup error:', data)
        toast.error(`Erro ao criar conta: ${data.error}`)
        return
      }

      toast.success('Conta criada com sucesso! Fazendo login...')
      
      // Fazer login automático após o cadastro
      setTimeout(() => {
        handleLogin(email, password)
      }, 500)
    } catch (error) {
      console.error('Signup exception:', error)
      toast.error('Erro ao criar conta')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAccessToken('')
    setCharacters([])
    toast.success('Logout realizado')
  }

  const loadCharacters = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/characters`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        setCharacters(data.characters || [])
      }
    } catch (error) {
      console.error('Error loading characters:', error)
    }
  }

  const handleUploadPhoto = async (file: File): Promise<{ url: string; path: string }> => {
    const formData = new FormData()
    formData.append('photo', file)

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/upload-photo`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer upload')
    }

    return { url: data.url, path: data.path }
  }

  const handleSaveCharacter = async (character: Character) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/character`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(character),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        toast.error(`Erro ao salvar personagem: ${data.error}`)
        return
      }

      toast.success('Personagem salvo com sucesso!')
      await loadCharacters()
      setCurrentView('list')
      setSelectedCharacter(null)
    } catch (error) {
      console.error('Error saving character:', error)
      toast.error('Erro ao salvar personagem')
    }
  }

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este personagem?')) {
      return
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/character/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        toast.error('Erro ao deletar personagem')
        return
      }

      toast.success('Personagem deletado')
      await loadCharacters()
    } catch (error) {
      console.error('Error deleting character:', error)
      toast.error('Erro ao deletar personagem')
    }
  }

  const handleViewCharacter = (character: Character) => {
    setViewingCharacter(character)
  }

  const handleEditCharacter = () => {
    setSelectedCharacter(viewingCharacter)
    setViewingCharacter(null)
    setCurrentView('edit')
  }

  const handleGenerateImage = async (data: { race: string; gender: string; appearance: string }): Promise<string> => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/generate-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        // Se erro de autenticação, mostrar modal para configurar token
        if (response.status === 500 && result.error?.includes('Token do Replicate')) {
          setPendingImageGeneration(data)
          throw new Error('Configure o token do Replicate para continuar')
        }
        throw new Error(result.error || 'Erro ao gerar imagem')
      }

      return result.imageUrl
    } catch (error) {
      console.error('Error generating image:', error)
      throw error
    }
  }

  const handleSaveToken = async (token: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/save-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Erro ao salvar token')
        return
      }
      
      // Se havia uma geração pendente, tentar novamente
      if (pendingImageGeneration) {
        setTimeout(async () => {
          try {
            toast.info('Gerando imagem... Aguarde.')
            await handleGenerateImage(pendingImageGeneration)
            setPendingImageGeneration(null)
          } catch (error: any) {
            toast.error(error.message || 'Erro ao gerar imagem')
          }
        }, 1000)
      }
    } catch (error) {
      console.error('Error saving token:', error)
      toast.error('Erro ao salvar token')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Anchor className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <Header 
        userName={user.user_metadata?.name || user.email}
        onLogout={handleLogout}
        onNavigate={(view) => {
          if (view === 'characters') {
            setCurrentPage('characters')
            setCurrentView('list')
          } else if (view === 'home') {
            setCurrentPage('home')
          }
        }}
        onShowDMSession={() => {
          const sessionId = Date.now().toString()
          setCurrentSessionId(sessionId)
          setShowDMSession(true)
        }}
      />

      {/* Main Content */}
      {currentPage === 'home' && (
        <Forum
          userId={user.id}
          userName={user.user_metadata?.name || user.email}
          projectId={projectId}
          accessToken={accessToken}
        />
      )}

      {currentPage === 'characters' && (
        <main className={`container mx-auto px-4 py-8 ${isDark ? 'bg-slate-900 text-white' : ''}`}>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-3xl">
              {currentView === 'list' && 'Meus Personagens'}
              {currentView === 'create' && 'Criar Novo Personagem'}
              {currentView === 'edit' && 'Editar Personagem'}
            </h2>
            {currentView === 'list' && (
              <Button onClick={() => setCurrentView('create')}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Novo Personagem
              </Button>
            )}
            {currentView !== 'list' && (
              <Button onClick={() => {
                setCurrentView('list')
                setSelectedCharacter(null)
              }} variant="outline">
                Voltar
              </Button>
            )}
          </div>

          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            {currentView === 'list' && (
              <CharacterList
                characters={characters}
                onView={handleViewCharacter}
                onDelete={handleDeleteCharacter}
              />
            )}

            {currentView === 'create' && (
              <CharacterForm
                onSave={handleSaveCharacter}
                onUploadPhoto={handleUploadPhoto}
              />
            )}

            {currentView === 'edit' && selectedCharacter && (
              <CharacterForm
                onSave={handleSaveCharacter}
                onUploadPhoto={handleUploadPhoto}
                initialData={selectedCharacter}
              />
            )}
          </div>
        </main>
      )}

      {/* Floating Resources Button */}
      <button
        onClick={() => setShowResources(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
        title="Recursos de RPG"
      >
        <Book className="w-6 h-6" />
      </button>

      {/* Floating Crew Button */}
      <button
        onClick={() => setShowCrewLobby(true)}
        className="fixed bottom-24 right-8 bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
        title="Tripulações"
      >
        <Users className="w-6 h-6" />
      </button>

      {/* Floating DM Button */}
      <button
        onClick={() => {
          const sessionId = Date.now().toString()
          setCurrentSessionId(sessionId)
          setShowDMSession(true)
        }}
        className="fixed bottom-40 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
        title="Mesa do Mestre"
      >
        <Crown className="w-6 h-6" />
      </button>

      {/* RPG Resources Modal */}
      {showResources && (
        <RPGResources onClose={() => setShowResources(false)} />
      )}

      {/* Crew Lobby Modal */}
      {showCrewLobby && (
        <CrewLobby
          onClose={() => setShowCrewLobby(false)}
          userId={user.id}
          userName={user.user_metadata?.name || user.email}
          projectId={projectId}
          accessToken={accessToken}
          onStartSession={(sessionId) => {
            setCurrentSessionId(sessionId)
            setShowCrewLobby(false)
            setShowDMSession(true)
          }}
        />
      )}

      {/* DM Session Modal */}
      {showDMSession && currentSessionId && (
        <DMSession
          onClose={() => setShowDMSession(false)}
          sessionId={currentSessionId}
          projectId={projectId}
          accessToken={accessToken}
        />
      )}

      {/* Character Sheet Modal */}
      {viewingCharacter && (
        <CharacterSheet
          character={viewingCharacter}
          onClose={() => setViewingCharacter(null)}
          onEdit={handleEditCharacter}
        />
      )}

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <img
          src="https://images.unsplash.com/photo-1548711567-b8113d81f3db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXJhdGUlMjBzaGlwJTIwb2NlYW58ZW58MXx8fHwxNzY1MTc1MzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="absolute bottom-0 right-0 w-1/3 opacity-5"
        />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}