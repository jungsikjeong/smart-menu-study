import { ApolloServer } from '@apollo/server'
import express from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import { json } from 'body-parser'
import { WebApp } from 'meteor/webapp'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { getUser } from 'meteor/apollo'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'

import resolverItem from '../api/item/resolvers'
import typeDefsItem from '../api/item/schemas'
import resolverOrder from '../api/order/resolvers'
import typeDefsOrder from '../api/order/schemas'
import resolverAuth from '../api/auth/resolvers'
import typeDefsAuth from '../api/auth/schemas'
;(async function () {
  const typeDefs = [typeDefsItem, typeDefsOrder, typeDefsAuth] // 타입을 모아주고
  const resolvers = [resolverItem, resolverOrder, resolverAuth] // resolver들을 모아줌

  // 하나로 merge시켜줌
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const wsServer = new WebSocketServer({
    noServer: true,
    path: '/graphql',
  })

  WebApp.httpServer.on('upgrade', (request, socket, head) => {
    if (request.url === '/graphql') {
      return wsServer.handleUpgrade(
        request,
        socket,
        head,
        (done = (ws) => {
          wsServer.emit('connection', ws, request)
        }),
      )
    } else {
      return
    }
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const app = express()

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageDisabled(), // 샌드박스 비활성화
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    json(),
    graphqlUploadExpress(),
    cors(),

    expressMiddleware(server, {
      context: async ({ req }) => ({
        user: await getUser(req.headers.authorization),
        userToken: req.headers.authorization,
      }),
    }),
  )

  WebApp.connectHandlers.use('/graphql', app)
})()
