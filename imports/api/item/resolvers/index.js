import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import mutations from './mutations'
import queries from './queries'

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: mutations,
  Query: queries,
}

export default resolvers
