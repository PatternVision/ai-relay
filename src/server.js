import Fastify from "fastify"
const app = Fastify({logger:true})
app.get("/health", async () => ({status:"ok"}))
await app.listen({port:3001,host:"0.0.0.0"})
console.log("Relay running on port 3001")