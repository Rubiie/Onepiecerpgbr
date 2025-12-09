import { useState } from 'react'
import { Button } from './ui/button'
import { Anchor, LogOut, Users, Crown, Scroll, Lightbulb, Dices, Calculator, TrendingUp, Moon, Sun, MessageSquare } from 'lucide-react'
import { RPGResources } from './RPGResources'
import { useTheme } from '../contexts/ThemeContext'

interface HeaderProps {
  userName: string
  onLogout: () => void
  onNavigate: (view: string) => void
  onShowDMSession: () => void
}

export function Header({ userName, onLogout, onNavigate, onShowDMSession }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme()
  const [showResources, setShowResources] = useState(false)
  const [resourceTab, setResourceTab] = useState('rules')

  const openResources = (tab: string) => {
    setResourceTab(tab)
    setShowResources(true)
  }

  return (
    <>
      <header className={`${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900 border-b-4 border-yellow-600' 
          : 'bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 border-b-4 border-yellow-600'
      } shadow-xl sticky top-0 z-40`}>
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className={`flex items-center justify-between py-3 ${
            isDark ? 'border-b border-gray-700' : 'border-b border-blue-700'
          }`}>
            <div className="flex items-center gap-3">
              <Anchor className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-['Pirata_One'] text-yellow-400">One Piece RPG</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-blue-200'}`}>
                  Bem-vindo, {userName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={toggleTheme} 
                variant="outline" 
                size="sm"
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-black"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button 
                onClick={onLogout} 
                variant="outline" 
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-black"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-1 py-2 overflow-x-auto">
            <Button
              onClick={() => onNavigate('home')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-white hover:bg-gray-700 hover:text-yellow-400' 
                  : 'text-white hover:bg-blue-700 hover:text-yellow-400'
              } whitespace-nowrap`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Fórum
            </Button>

            <Button
              onClick={() => onNavigate('characters')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-white hover:bg-gray-700 hover:text-yellow-400' 
                  : 'text-white hover:bg-blue-700 hover:text-yellow-400'
              } whitespace-nowrap`}
            >
              <Users className="w-4 h-4 mr-2" />
              Meus Personagens
            </Button>

            <Button
              onClick={onShowDMSession}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-white hover:bg-gray-700 hover:text-yellow-400' 
                  : 'text-white hover:bg-purple-700 hover:text-yellow-400'
              } whitespace-nowrap`}
            >
              <Crown className="w-4 h-4 mr-2" />
              Mesa do Mestre
            </Button>

            <div className={`h-6 w-px ${isDark ? 'bg-gray-600' : 'bg-blue-600'} mx-2`} />

            <Button
              onClick={() => openResources('rules')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-white hover:bg-gray-700 hover:text-yellow-400' 
                  : 'text-white hover:bg-blue-700 hover:text-yellow-400'
              } whitespace-nowrap`}
            >
              <Scroll className="w-4 h-4 mr-2" />
              Regras
            </Button>

            <Button
              onClick={() => openResources('tips')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-white hover:bg-gray-700 hover:text-yellow-400' 
                  : 'text-white hover:bg-blue-700 hover:text-yellow-400'
              } whitespace-nowrap`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Dicas
            </Button>

            <Button
              onClick={() => openResources('dice')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-white hover:bg-gray-700 hover:text-yellow-400' 
                  : 'text-white hover:bg-blue-700 hover:text-yellow-400'
              } whitespace-nowrap`}
            >
              <Dices className="w-4 h-4 mr-2" />
              Dados
            </Button>

            <Button
              onClick={() => openResources('calculator')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-white hover:bg-gray-700 hover:text-yellow-400' 
                  : 'text-white hover:bg-blue-700 hover:text-yellow-400'
              } whitespace-nowrap`}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculadora
            </Button>

            <Button
              onClick={() => openResources('progression')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-white hover:bg-gray-700 hover:text-yellow-400' 
                  : 'text-white hover:bg-blue-700 hover:text-yellow-400'
              } whitespace-nowrap`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Progressão
            </Button>
          </nav>
        </div>
      </header>

      {/* RPG Resources Modal */}
      {showResources && (
        <RPGResources 
          onClose={() => setShowResources(false)} 
          defaultTab={resourceTab}
        />
      )}
    </>
  )
}