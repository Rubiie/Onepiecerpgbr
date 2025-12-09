import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

// Criar bucket de storage para fotos de personagens
async function initStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketName = 'make-a9a64c9e-character-photos'
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      })
      console.log(`Created bucket: ${bucketName}`)
    }
  } catch (error) {
    console.error('Error initializing storage:', error)
  }
}

initStorage()

// Rota de signup
app.post('/make-server-a9a64c9e/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, senha e nome são obrigatórios' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    })

    if (error) {
      console.error('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    return c.json({ success: true, user: data.user })
  } catch (error) {
    console.error('Error during signup:', error)
    return c.json({ error: 'Erro ao criar usuário' }, 500)
  }
})

// Upload de foto de personagem
app.post('/make-server-a9a64c9e/upload-photo', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const formData = await c.req.formData()
    const file = formData.get('photo') as File
    
    if (!file) {
      return c.json({ error: 'Nenhum arquivo enviado' }, 400)
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const bucketName = 'make-a9a64c9e-character-photos'

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return c.json({ error: uploadError.message }, 500)
    }

    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365) // 1 ano

    return c.json({ 
      success: true, 
      path: fileName,
      url: signedUrlData?.signedUrl 
    })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return c.json({ error: 'Erro ao fazer upload da foto' }, 500)
  }
})

// Obter URL assinada de uma foto
app.get('/make-server-a9a64c9e/photo/:path', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const path = c.req.param('path')
    const bucketName = 'make-a9a64c9e-character-photos'

    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 60 * 60 * 24 * 365) // 1 ano

    return c.json({ url: signedUrlData?.signedUrl })
  } catch (error) {
    console.error('Error getting photo URL:', error)
    return c.json({ error: 'Erro ao obter URL da foto' }, 500)
  }
})

// Salvar ficha de personagem
app.post('/make-server-a9a64c9e/character', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const characterData = await c.req.json()
    
    // Salvar no KV store com chave user:characters:{userId}:{characterId}
    const characterId = characterData.id || crypto.randomUUID()
    const key = `user:characters:${user.id}:${characterId}`
    
    await kv.set(key, {
      ...characterData,
      id: characterId,
      userId: user.id,
      updatedAt: new Date().toISOString(),
    })

    return c.json({ success: true, characterId })
  } catch (error) {
    console.error('Error saving character:', error)
    return c.json({ error: 'Erro ao salvar personagem' }, 500)
  }
})

// Listar personagens do usuário
app.get('/make-server-a9a64c9e/characters', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const prefix = `user:characters:${user.id}:`
    const characters = await kv.getByPrefix(prefix)

    return c.json({ characters })
  } catch (error) {
    console.error('Error listing characters:', error)
    return c.json({ error: 'Erro ao listar personagens' }, 500)
  }
})

// Obter um personagem específico
app.get('/make-server-a9a64c9e/character/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const characterId = c.req.param('id')
    const key = `user:characters:${user.id}:${characterId}`
    const character = await kv.get(key)

    if (!character) {
      return c.json({ error: 'Personagem não encontrado' }, 404)
    }

    return c.json({ character })
  } catch (error) {
    console.error('Error getting character:', error)
    return c.json({ error: 'Erro ao obter personagem' }, 500)
  }
})

// Deletar personagem
app.delete('/make-server-a9a64c9e/character/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const characterId = c.req.param('id')
    const key = `user:characters:${user.id}:${characterId}`
    
    await kv.del(key)

    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting character:', error)
    return c.json({ error: 'Erro ao deletar personagem' }, 500)
  }
})

// Criar tripulação
app.post('/make-server-a9a64c9e/crew', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const { name, characterName } = await c.req.json()
    const crewId = `crew_${Date.now()}`
    
    const crew = {
      id: crewId,
      name,
      captainId: user.id,
      members: [{
        id: user.id,
        name: user.user_metadata?.name || user.email,
        characterName,
        role: 'captain'
      }],
      maxMembers: 8,
      isActive: true,
    }

    await kv.set(`crew:${crewId}`, crew)
    await kv.set(`user:crew:${user.id}`, crewId)

    return c.json({ success: true, crew })
  } catch (error) {
    console.error('Error creating crew:', error)
    return c.json({ error: 'Erro ao criar tripulação' }, 500)
  }
})

// Listar tripulações
app.get('/make-server-a9a64c9e/crews', async (c) => {
  try {
    const crews = await kv.getByPrefix('crew:')
    return c.json({ crews })
  } catch (error) {
    console.error('Error loading crews:', error)
    return c.json({ error: 'Erro ao carregar tripulações' }, 500)
  }
})

// Obter minha tripulação
app.get('/make-server-a9a64c9e/my-crew', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const crewId = await kv.get(`user:crew:${user.id}`)
    
    if (!crewId) {
      return c.json({ crew: null })
    }

    const crew = await kv.get(`crew:${crewId}`)
    return c.json({ crew })
  } catch (error) {
    console.error('Error loading my crew:', error)
    return c.json({ error: 'Erro ao carregar tripulação' }, 500)
  }
})

// Entrar em tripulação
app.post('/make-server-a9a64c9e/crew/:id/join', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const crewId = c.req.param('id')
    const { characterName } = await c.req.json()
    
    const crew = await kv.get(`crew:${crewId}`)
    
    if (!crew) {
      return c.json({ error: 'Tripulação não encontrada' }, 404)
    }

    if (crew.members.length >= crew.maxMembers) {
      return c.json({ error: 'Tripulação está cheia' }, 400)
    }

    crew.members.push({
      id: user.id,
      name: user.user_metadata?.name || user.email,
      characterName,
      role: 'member'
    })

    await kv.set(`crew:${crewId}`, crew)
    await kv.set(`user:crew:${user.id}`, crewId)

    return c.json({ success: true, crew })
  } catch (error) {
    console.error('Error joining crew:', error)
    return c.json({ error: 'Erro ao entrar na tripulação' }, 500)
  }
})

// Sair da tripulação
app.post('/make-server-a9a64c9e/crew/:id/leave', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const crewId = c.req.param('id')
    const crew = await kv.get(`crew:${crewId}`)
    
    if (!crew) {
      return c.json({ error: 'Tripulação não encontrada' }, 404)
    }

    crew.members = crew.members.filter(m => m.id !== user.id)
    
    if (crew.members.length === 0) {
      await kv.del(`crew:${crewId}`)
    } else {
      await kv.set(`crew:${crewId}`, crew)
    }

    await kv.del(`user:crew:${user.id}`)

    return c.json({ success: true })
  } catch (error) {
    console.error('Error leaving crew:', error)
    return c.json({ error: 'Erro ao sair da tripulação' }, 500)
  }
})

// Iniciar sessão
app.post('/make-server-a9a64c9e/crew/:id/start-session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const crewId = c.req.param('id')
    const crew = await kv.get(`crew:${crewId}`)
    
    if (!crew) {
      return c.json({ error: 'Tripulação não encontrada' }, 404)
    }

    if (crew.captainId !== user.id) {
      return c.json({ error: 'Apenas o capitão pode iniciar sessões' }, 403)
    }

    const sessionId = `session_${Date.now()}`
    const session = {
      id: sessionId,
      crewId,
      players: crew.members.map(m => ({
        id: m.id,
        name: m.name,
        hp: 50,
        maxHp: 50,
        initiative: 0,
        conditions: []
      })),
      enemies: [],
      notes: [],
      currentTurn: 0,
      roundNumber: 1,
    }

    await kv.set(`session:${sessionId}`, session)
    crew.sessionId = sessionId
    await kv.set(`crew:${crewId}`, crew)

    return c.json({ success: true, sessionId })
  } catch (error) {
    console.error('Error starting session:', error)
    return c.json({ error: 'Erro ao iniciar sessão' }, 500)
  }
})

// Obter sessão
app.get('/make-server-a9a64c9e/session/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const sessionId = c.req.param('id')
    const session = await kv.get(`session:${sessionId}`)
    
    if (!session) {
      return c.json({
        players: [],
        enemies: [],
        notes: [],
        currentTurn: 0,
        roundNumber: 1,
      })
    }

    return c.json(session)
  } catch (error) {
    console.error('Error loading session:', error)
    return c.json({ error: 'Erro ao carregar sessão' }, 500)
  }
})

// Salvar sessão
app.post('/make-server-a9a64c9e/session/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const sessionId = c.req.param('id')
    const sessionData = await c.req.json()
    
    await kv.set(`session:${sessionId}`, {
      id: sessionId,
      ...sessionData,
    })

    return c.json({ success: true })
  } catch (error) {
    console.error('Error saving session:', error)
    return c.json({ error: 'Erro ao salvar sessão' }, 500)
  }
})

// Salvar progresso da história nas fichas
app.post('/make-server-a9a64c9e/session/:id/save-progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const sessionId = c.req.param('id')
    const { storyProgress, sessionNotes, xpAwarded, itemsObtained, players } = await c.req.json()

    // Para cada jogador, atualizar sua ficha de personagem
    const allCharacters = await kv.getByPrefix(`user:${user.id}:char:`)
    
    for (const playerInfo of players) {
      // Encontrar o personagem do jogador pelo nome
      for (const character of allCharacters) {
        if (character.name === playerInfo.name) {
          // Adicionar novo progresso ao histórico
          const sessionProgress = {
            sessionId,
            sessionDate: new Date().toISOString(),
            storyProgress,
            notes: sessionNotes,
            xpGained: xpAwarded,
            itemsObtained: itemsObtained || [],
          }

          if (!character.sessionHistory) {
            character.sessionHistory = []
          }

          character.sessionHistory.push(sessionProgress)

          // Atualizar XP se fornecido
          if (xpAwarded > 0) {
            character.xp = (character.xp || 0) + xpAwarded
          }

          // Salvar personagem atualizado
          await kv.set(`user:${user.id}:char:${character.id}`, character)
          break
        }
      }
    }

    return c.json({ success: true })
  } catch (error) {
    console.error('Error saving story progress:', error)
    return c.json({ error: 'Erro ao salvar progresso' }, 500)
  }
})

// ========== ROTAS DO FÓRUM ==========

// Listar posts do fórum
app.get('/make-server-a9a64c9e/forum/posts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const posts = await kv.getByPrefix('forum_post_')
    const sortedPosts = posts.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return c.json({ posts: sortedPosts })
  } catch (error) {
    console.error('Error loading forum posts:', error)
    return c.json({ error: 'Erro ao carregar posts' }, 500)
  }
})

// Obter post específico com comentários
app.get('/make-server-a9a64c9e/forum/post/:postId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const postId = c.req.param('postId')
    const post = await kv.get(`forum_post_${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post não encontrado' }, 404)
    }

    // Incrementar views
    post.views = (post.views || 0) + 1
    await kv.set(`forum_post_${postId}`, post)

    // Carregar comentários
    const allComments = await kv.getByPrefix('forum_comment_')
    const postComments = allComments.filter((c: any) => c.postId === postId)
    post.comments = postComments.sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    return c.json({ post })
  } catch (error) {
    console.error('Error loading forum post:', error)
    return c.json({ error: 'Erro ao carregar post' }, 500)
  }
})

// Criar post
app.post('/make-server-a9a64c9e/forum/post', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const { title, content, category } = await c.req.json()
    
    if (!title || !content) {
      return c.json({ error: 'Título e conteúdo são obrigatórios' }, 400)
    }

    const postId = `${Date.now()}_${user.id}`
    const post = {
      id: postId,
      authorId: user.id,
      authorName: user.user_metadata?.name || user.email,
      title,
      content,
      category: category || 'geral',
      likes: 0,
      commentsCount: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    }

    await kv.set(`forum_post_${postId}`, post)

    return c.json({ success: true, post })
  } catch (error) {
    console.error('Error creating forum post:', error)
    return c.json({ error: 'Erro ao criar post' }, 500)
  }
})

// Atualizar post
app.put('/make-server-a9a64c9e/forum/post/:postId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const postId = c.req.param('postId')
    const post = await kv.get(`forum_post_${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post não encontrado' }, 404)
    }

    // Verificar se o usuário é o autor do post
    if (post.authorId !== user.id) {
      return c.json({ error: 'Você não tem permissão para editar este post' }, 403)
    }

    const { title, content, category } = await c.req.json()

    if (!title?.trim() || !content?.trim()) {
      return c.json({ error: 'Título e conteúdo são obrigatórios' }, 400)
    }

    // Atualizar o post
    post.title = title
    post.content = content
    post.category = category || post.category
    post.updatedAt = new Date().toISOString()

    await kv.set(`forum_post_${postId}`, post)

    return c.json({ success: true, post })
  } catch (error) {
    console.error('Error updating forum post:', error)
    return c.json({ error: 'Erro ao atualizar post' }, 500)
  }
})

// Excluir post
app.delete('/make-server-a9a64c9e/forum/post/:postId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const postId = c.req.param('postId')
    const post = await kv.get(`forum_post_${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post não encontrado' }, 404)
    }

    // Verificar se o usuário é o autor do post
    if (post.authorId !== user.id) {
      return c.json({ error: 'Você não tem permissão para excluir este post' }, 403)
    }

    // Excluir post
    await kv.del(`forum_post_${postId}`)
    
    // Excluir comentários do post
    const allKeys = await kv.getByPrefix('forum_comment_')
    const commentsToDelete = allKeys.filter(item => item.value?.postId === postId)
    if (commentsToDelete.length > 0) {
      await kv.mdel(commentsToDelete.map(item => item.key))
    }
    
    // Excluir likes do post
    const likesKeys = await kv.getByPrefix(`forum_like_${postId}_`)
    if (likesKeys.length > 0) {
      await kv.mdel(likesKeys.map(item => item.key))
    }

    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting forum post:', error)
    return c.json({ error: 'Erro ao excluir post' }, 500)
  }
})

// Like em post
app.post('/make-server-a9a64c9e/forum/post/:postId/like', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const postId = c.req.param('postId')
    const post = await kv.get(`forum_post_${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post não encontrado' }, 404)
    }

    const likeKey = `forum_like_${postId}_${user.id}`
    const existingLike = await kv.get(likeKey)

    if (existingLike) {
      // Remove like
      await kv.del(likeKey)
      post.likes = Math.max(0, (post.likes || 0) - 1)
    } else {
      // Adiciona like
      await kv.set(likeKey, { userId: user.id, postId, createdAt: new Date().toISOString() })
      post.likes = (post.likes || 0) + 1
    }

    await kv.set(`forum_post_${postId}`, post)

    return c.json({ success: true, likes: post.likes })
  } catch (error) {
    console.error('Error liking forum post:', error)
    return c.json({ error: 'Erro ao curtir post' }, 500)
  }
})

// Adicionar comentário
app.post('/make-server-a9a64c9e/forum/post/:postId/comment', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Não autorizado' }, 401)
    }

    const postId = c.req.param('postId')
    const { content } = await c.req.json()
    
    if (!content || !content.trim()) {
      return c.json({ error: 'Conteúdo do comentário é obrigatório' }, 400)
    }

    const post = await kv.get(`forum_post_${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post não encontrado' }, 404)
    }

    const commentId = `${Date.now()}_${user.id}`
    const comment = {
      id: commentId,
      postId,
      authorId: user.id,
      authorName: user.user_metadata?.name || user.email,
      content,
      createdAt: new Date().toISOString(),
    }

    await kv.set(`forum_comment_${commentId}`, comment)

    // Atualizar contagem de comentários
    post.commentsCount = (post.commentsCount || 0) + 1
    await kv.set(`forum_post_${postId}`, post)

    return c.json({ success: true, comment })
  } catch (error) {
    console.error('Error adding comment:', error)
    return c.json({ error: 'Erro ao adicionar comentário' }, 500)
  }
})

Deno.serve(app.fetch)