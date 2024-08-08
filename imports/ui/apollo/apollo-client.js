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
import { ALL } from '../../utils/constants'
import { authToken, itemPage } from '../stores'
import { get } from 'svelte/store'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import Shortid from 'shortid'

// const httpLink = new HttpLink({
//   uri: 'http://localhost:3000/graphql',
// })

const uploadLink = createUploadLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'same-origin',
  headers: { 'Apollo-Require-Preflight': 'true' },
})

// subscription을 사용하기위해서는 이걸 설정해줘야됌
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3000/graphql',
  }),
)

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('Meteor.loginToken')

  if (!token) authToken.checkToken()

  operation.setContext(() => {
    return {
      headers: {
        authorization: token ? token : '',
      },
    }
  })
  return forward(operation)
})

// 분기처리 서버쪽에서 subscription를 구독하는거면 true를 리턴해서 wsLink로 연결해줌
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  // httpLink,
  uploadLink,
)

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        itemsPageCount: {
          keyArgs: false,
        },
        items: {
          keyArgs: ['_id'],
          merge(existing = [], incoming = [], { args, readField }) {
            const newArr = [...existing, ...incoming]
            // 중복 제거
            const uniqueArr = newArr.filter(
              (arr, index, callback) =>
                index === callback.findIndex((t) => t.__ref === arr.__ref),
            )

            // categoryId 필터링
            let resultArr = []
            // if (args.itemCategoryId !== ALL) {
            //   resultArr = uniqueArr.filter(
            //     (_id) =>
            //       readField('itemCategoryId', _id) === args.itemCategoryId,
            //   )
            // } else {
            //   resultArr = uniqueArr
            // }

            const itemPageNumber = get(itemPage)
            if (itemPageNumber.pageNumber <= 1) {
              resultArr = incoming
            } else {
              resultArr = newArr
            }

            return resultArr
          },
        },
      },
    },
  },

  dataIdFromObject(responseObject) {
    switch (responseObject.__typename) {
      // 보통 cache id의 경우 콜렉션명인 __typename + _id로 만들어 짐.
      // 문제는 하위배열인 item의 경우 중복 발생이 일어날 수 있어서 _id를 cache id로사용하면 안됨.
      // 이럴때 커스텀 key를 다음과 같이 만들어주면 됨.
      case 'OrderItem':
        return `OrderItem:${Shortid.generate()}`
      default:
        return defaultDataIdFromObject(responseObject)
    }
  },
})

const client = new ApolloClient({
  link: from([authLink, link]),

  cache,
})

export default client
