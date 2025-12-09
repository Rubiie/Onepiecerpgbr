import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { AlertCircle } from 'lucide-react'

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  onSignup: (email: string, password: string, name: string) => Promise<void>
}

export function AuthForm({ onLogin, onSignup }: AuthFormProps) {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('signup')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onLogin(loginEmail, loginPassword)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (signupPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    setIsLoading(true)
    try {
      await onSignup(signupEmail, signupPassword, signupName)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-2 text-yellow-400">⚓ One Piece RPG</h1>
          <p className="text-white/80">Crie seu pirata e navegue pelos mares!</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            <TabsTrigger value="login">Entrar</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Crie sua conta</CardTitle>
                <CardDescription>Comece sua jornada nos mares</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
                  </div>
                  <div className="text-xs text-blue-700 bg-blue-50 p-3 rounded flex gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Primeira vez aqui? Crie sua conta para começar a jogar!
                    </span>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo de volta!</CardTitle>
                <CardDescription>Entre para acessar suas fichas</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded flex gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Não tem conta? Vá para a aba <strong>&quot;Cadastrar&quot;</strong> primeiro!
                    </span>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}