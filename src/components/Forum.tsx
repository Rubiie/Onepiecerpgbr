import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { MessageSquare, ThumbsUp, Send, Plus, User, Clock, Eye, TrendingUp, HelpCircle, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useTheme } from '../contexts/ThemeContext'

interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

interface Post {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  category: string
  likes: number
  commentsCount: number
  views: number
  createdAt: string
  comments?: Comment[]
  imageUrl?: string
}

interface ForumProps {
  userId: string
  userName: string
  projectId: string
  accessToken: string
}

export function Forum({ userId, userName, projectId, accessToken }: ForumProps) {
  const { isDark } = useTheme()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostCategory, setNewPostCategory] = useState('geral')
  const [newComment, setNewComment] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/forum/posts`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }

  const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error('Preencha título e conteúdo')
      return
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/forum/post`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: newPostTitle,
            content: newPostContent,
            category: newPostCategory,
          }),
        }
      )

      if (response.ok) {
        toast.success('Post criado!')
        setNewPostTitle('')
        setNewPostContent('')
        setNewPostCategory('geral')
        setShowCreatePost(false)
        loadPosts()
      } else {
        toast.error('Erro ao criar post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Erro ao criar post')
    }
  }

  const likePost = async (postId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/forum/post/${postId}/like`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        loadPosts()
        if (selectedPost?.id === postId) {
          loadPost(postId)
        }
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const loadPost = async (postId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/forum/post/${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setSelectedPost(data.post)
      }
    } catch (error) {
      console.error('Error loading post:', error)
    }
  }

  const addComment = async () => {
    if (!selectedPost || !newComment.trim()) {
      toast.error('Escreva um comentário')
      return
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/forum/post/${selectedPost.id}/comment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            content: newComment,
          }),
        }
      )

      if (response.ok) {
        toast.success('Comentário adicionado!')
        setNewComment('')
        loadPost(selectedPost.id)
        loadPosts()
      } else {
        toast.error('Erro ao adicionar comentário')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Erro ao adicionar comentário')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    if (days < 7) return `${days}d atrás`
    return date.toLocaleDateString('pt-BR')
  }

  const startEditPost = (post: Post) => {
    setEditingPost(post)
    setEditTitle(post.title)
    setEditContent(post.content)
    setEditCategory(post.category)
  }

  const cancelEdit = () => {
    setEditingPost(null)
    setEditTitle('')
    setEditContent('')
    setEditCategory('')
  }

  const updatePost = async () => {
    if (!editingPost || !editTitle.trim() || !editContent.trim()) {
      toast.error('Preencha título e conteúdo')
      return
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/forum/post/${editingPost.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: editTitle,
            content: editContent,
            category: editCategory,
          }),
        }
      )

      if (response.ok) {
        toast.success('Post atualizado!')
        cancelEdit()
        loadPosts()
        if (selectedPost?.id === editingPost.id) {
          loadPost(editingPost.id)
        }
      } else {
        toast.error('Erro ao atualizar post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Erro ao atualizar post')
    }
  }

  const confirmDeletePost = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setDeletingPostId(postId)
  }

  const cancelDelete = () => {
    setDeletingPostId(null)
  }

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a9a64c9e/forum/post/${postId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.ok) {
        toast.success('Post excluído!')
        setDeletingPostId(null)
        
        // Se estava visualizando o post, volta para lista
        if (selectedPost?.id === postId) {
          setSelectedPost(null)
        }
        
        loadPosts()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao excluir post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Erro ao excluir post')
    }
  }

  // Função para detectar e renderizar imagens do conteúdo
  const renderContentWithImages = (content: string) => {
    // Regex para detectar URLs de imagem
    const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp|svg)(?:\?[^\s]*)?)/gi
    const parts = content.split(imageUrlRegex)
    
    return parts.map((part, index) => {
      if (imageUrlRegex.test(part)) {
        // Reset regex lastIndex
        imageUrlRegex.lastIndex = 0
        return (
          <div key={index} className="my-4">
            <img 
              src={part} 
              alt="Imagem do post" 
              className="max-w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  // Função para remover URLs de imagem do texto (para prévia)
  const getTextWithoutImageUrls = (content: string) => {
    const imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp|svg)(?:\?[^\s]*)?)/gi
    return content.replace(imageUrlRegex, '').trim()
  }

  const categories = [
    { id: 'all', name: 'Todos', icon: TrendingUp },
    { id: 'geral', name: 'Geral', icon: MessageSquare },
    { id: 'regras', name: 'Regras', icon: MessageSquare },
    { id: 'duvidas', name: 'Dúvidas', icon: HelpCircle },
    { id: 'historia', name: 'História', icon: MessageSquare },
    { id: 'galeria', name: 'Galeria de Artes', icon: ImageIcon },
  ]

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.category === filter)

  const bgClass = isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100'
  const cardBg = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
  const textClass = isDark ? 'text-white' : 'text-gray-900'
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-600'

  if (selectedPost) {
    return (
      <div className={`${bgClass} min-h-screen p-6`}>
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={() => setSelectedPost(null)}
            variant="outline"
            className="mb-4"
          >
            ← Voltar
          </Button>

          {/* Modal de Confirmação de Exclusão */}
          {deletingPostId === selectedPost.id && (
            <Card className={`${cardBg} mb-4 border-2 border-red-500`}>
              <CardContent className="p-6">
                <h3 className={`text-xl mb-4 ${textClass}`}>⚠️ Confirmar Exclusão</h3>
                <p className={mutedClass}>
                  Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => deletePost(selectedPost.id)}
                    variant="destructive"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sim, Excluir
                  </Button>
                  <Button
                    onClick={cancelDelete}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {editingPost?.id === selectedPost.id ? (
            <Card className={cardBg}>
              <CardHeader>
                <CardTitle className={textClass}>Editar Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className={`block mb-2 ${textClass}`}>Categoria</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className={`w-full p-2 rounded border ${
                      isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white border-gray-300'
                    }`}
                  >
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Título do post"
                    className={isDark ? 'bg-slate-700 text-white border-slate-600' : ''}
                  />
                </div>
                <div>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder={editCategory === 'galeria' 
                      ? "Descreva sua arte e cole a URL da imagem aqui (ex: https://i.imgur.com/exemplo.jpg)" 
                      : "Conteúdo do post"
                    }
                    className={isDark ? 'bg-slate-700 text-white border-slate-600' : ''}
                    rows={10}
                  />
                  {editCategory === 'galeria' && (
                    <p className={`text-xs mt-1 ${mutedClass}`}>
                      💡 Dica: Use serviços como Imgur, ImgBB ou Discord para hospedar suas imagens e cole a URL direta aqui
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={updatePost} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={cardBg}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedPost.category}
                      </span>
                    </div>
                    <CardTitle className={`text-3xl ${textClass}`}>{selectedPost.title}</CardTitle>
                    <div className={`flex items-center gap-4 mt-3 text-sm ${mutedClass}`}>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedPost.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(selectedPost.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {selectedPost.views}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedPost.authorId === userId && (
                      <>
                        <Button
                          onClick={() => startEditPost(selectedPost)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            confirmDeletePost(selectedPost.id)
                          }}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => likePost(selectedPost.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {selectedPost.likes}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`whitespace-pre-wrap mb-6 ${textClass}`}>
                  {renderContentWithImages(selectedPost.content)}
                </div>

                <div className="border-t pt-6">
                  <h3 className={`text-xl mb-4 ${textClass}`}>
                    Comentários ({selectedPost.comments?.length || 0})
                  </h3>

                  <div className="space-y-4 mb-6">
                    {selectedPost.comments?.map(comment => (
                      <div key={comment.id} className={`p-4 rounded-lg ${
                        isDark ? 'bg-slate-700' : 'bg-gray-50'
                      }`}>
                        <div className={`flex items-center gap-2 mb-2 text-sm ${mutedClass}`}>
                          <User className="w-4 h-4" />
                          <span className={textClass}>{comment.authorName}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className={textClass}>{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escreva um comentário..."
                      className={isDark ? 'bg-slate-700 text-white border-slate-600' : ''}
                      rows={3}
                    />
                    <Button onClick={addComment} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Comentar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`${bgClass} min-h-screen p-6`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-4xl font-['Pirata_One'] ${textClass}`}>
            Fórum da Comunidade
          </h1>
          <Button
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
        </div>

        {showCreatePost && (
          <Card className={`${cardBg} mb-6`}>
            <CardHeader>
              <CardTitle className={textClass}>Criar Novo Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className={`block mb-2 ${textClass}`}>Categoria</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className={`w-full p-2 rounded border ${
                    isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white border-gray-300'
                  }`}
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Título do post"
                  className={isDark ? 'bg-slate-700 text-white border-slate-600' : ''}
                />
              </div>
              <div>
                <Textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={newPostCategory === 'galeria' 
                    ? "Descreva sua arte e cole a URL da imagem aqui (ex: https://i.imgur.com/exemplo.jpg)" 
                    : "Conteúdo do post"
                  }
                  className={isDark ? 'bg-slate-700 text-white border-slate-600' : ''}
                  rows={6}
                />
                {newPostCategory === 'galeria' && (
                  <p className={`text-xs mt-1 ${mutedClass}`}>
                    💡 Dica: Use serviços como Imgur, ImgBB ou Discord para hospedar suas imagens e cole a URL direta aqui
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={createPost} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
                <Button
                  onClick={() => setShowCreatePost(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                variant={filter === cat.id ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.name}
              </Button>
            )
          })}
        </div>

        <div className="space-y-4">
          {filteredPosts.length === 0 && (
            <Card className={cardBg}>
              <CardContent className="p-12 text-center">
                <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${mutedClass}`} />
                <p className={mutedClass}>Nenhum post encontrado</p>
                <p className={`text-sm mt-2 ${mutedClass}`}>
                  Seja o primeiro a criar um post!
                </p>
              </CardContent>
            </Card>
          )}

          {filteredPosts.map(post => (
            <Card
              key={post.id}
              className={`${cardBg} cursor-pointer hover:shadow-lg transition-shadow`}
              onClick={() => {
                loadPost(post.id)
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                    <h3 className={`text-xl mb-2 ${textClass}`}>{post.title}</h3>
                    <p className={`mb-3 line-clamp-2 ${mutedClass}`}>
                      {getTextWithoutImageUrls(post.content)}
                    </p>
                    <div className={`flex items-center gap-4 text-sm ${mutedClass}`}>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(post.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.commentsCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}