import Fastify from 'fastify'
const app = Fastify({logger:true})
app.get('/health', async () => ({status:'ok',channel:'UCfLrpntIQ2wkzaQa6_XuOkQ'}))
app.get('/api/v1/webhook/in/youtube', async (req, reply) => {
  const mode = req.query['hub.mode']
  const challenge = req.query['hub.challenge']
  console.log('YouTube ping!', mode, challenge)
  if (mode === 'subscribe') return reply.header('Content-Type','text/plain').send(challenge)
  return reply.send({ok:true})
})
app.post('/api/v1/webhook/in/youtube', async (req, reply) => {
  console.log('NEW VIDEO UPLOADED!', new Date().toISOString())
  return reply.send({received:true})
})
await app.listen({port:3001,host:'0.0.0.0'})
console.log('Relay running on port 3001')
