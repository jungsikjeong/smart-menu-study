import { gql } from 'graphql-tag';

const typeDefs = gql`
  type OrderItem {
    _id: ID!
    itemId: ID
    itemName: String
    itemPrice: Int
    itemPriceSum: Int
    itemCount: Int
  }

  type Order {
    _id: ID!
    orderDate: Date
    orderPriceSum: Int
    orderCount: Int
    orderState: Boolean
    orderItems: [OrderItem]
  }

  input OrderItemInput {
    _id: ID
    itemName: String
    itemPrice: Int
    itemPriceSum: Int
    itemCount: Int
  }

  extend type Mutation {
    addOrder(
      orderPriceSum: Int
      orderCount: Int
      orderItems: [OrderItemInput]
    ): ID
    checkOrder(_id: ID, orderState: Boolean): ID
  }

  extend type Query {
    orders(limit: Int): [Order]
  }

  type Subscription {
    orderAdded(authToken: String): Order
  }
`;
// 두번째 쿼리, 뮤테이션부터는 extends를 붙여줘야됌

export default typeDefs;
