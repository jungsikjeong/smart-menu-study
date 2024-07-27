import {
  ApolloClient,
  InMemoryCache,
  split,
  ApolloLink,
  from,
  HttpLink,
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3000/graphql',
  }),
)

const authLink = new ApolloLink((operation, forward) => {
  return forward(operation)
})

// 분기처리 서버쪽에서 subscription를 구독하는거면 true를 리턴해서 wsLink로 연결해줌
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
  //   uploadLink
)

const client = new ApolloClient({
  link: from([authLink, link]),
  cache: new InMemoryCache(),
})

export default client
