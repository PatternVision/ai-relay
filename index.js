import Fastify from 'fastify'
import Anthropic from '@anthropic-ai/sdk'

const app = Fastify({logger:true})
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.get('/health', async () => ({
  status: 'ok',
  channel: 'UCfLrpntIQ2wkzaQa6_XuOkQ',
  claude: 'connected'
}))

app.get('/api/v1/webhook/in/youtube', async (req, reply) => {
  const mode = req.query['hub.mode']
  const challenge = req.query['hub.challenge']
  console.log('YouTube verification ping!', mode)
  if (mode === 'subscribe') return reply.header('Content-Type','text/plain').send(challenge)
  return reply.send({ok:true})
})

app.post('/api/v1/webhook/in/youtube', async (req, reply) => {
  console.log('NEW VIDEO UPLOADED!', new Date().toISOString())
  const body = req.body
  const videoId = body?.entry?.['yt:videoId']?.[0] ?? 'unknown'
  const title = body?.entry?.title?.[0] ?? 'New video'
  console.log('Video ID:', videoId, 'Title:', title)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `A new YouTube video was just uploaded. Video ID: ${videoId}, Title: "${title}". Give 3 quick suggestions to improve the title and description for better SEO.`
    }]
  })

  const suggestion = message.content[0].text
  console.log('Claude says:', suggestion)
  return reply.send({ received: true, video_id: videoId, claude_suggestion: suggestion })
})

await app.listen({port: process.env.PORT || 3001, host:'0.0.0.0'})
console.log('Relay + Claude running!')
