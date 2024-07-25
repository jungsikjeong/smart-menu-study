import Orders from './collections';
import { getCurrentDate } from '/imports/utils/formatDate.js';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { ORDER_ADDED, ADMIN } from '/imports/utils/constants';
import { getUser } from 'meteor/apollo';

const pubsub = new PubSub();

const queries = {
  async orders(_, args, context, info) {
    try {
      const result = await Orders.find({
        orderDate: { $gte: new Date() }, // gte는 특정값만을 조회하는것, 즉 오늘 이전에 주문은 나타나지않음,오늘 날짜 이후의 데이터만 나타나게끔함
      });

      return result;
    } catch (error) {
      throw `orders query Error: ${error}`;
    }
  },
};

const mutations = {
  async addOrder(_, { orderPriceSum, orderCount, orderItems }, { user }, info) {
    const newDate = getCurrentDate();

    let orderValues = {
      orderDate: newDate,
      orderPriceSum: orderPriceSum,
      orderCount: orderCount,
      orderItems: orderItems,
      orderState: false,
    };

    try {
      const result = Orders.insert(orderValues);

      orderValues._id = result;
      await pubsub.publish(ORDER_ADDED, { orderAdded: orderValues }); // 오더 구독

      return result;
    } catch (error) {
      throw `order Add Error: ${error}`;
    }
  },

  async checkOrder(_, { _id, orderState }, { user }, info) {
    const changeOrderState = {
      orderState: !orderState,
    };

    try {
      await Orders.update({ _id: _id }, { $set: changeOrderState });

      return _id;
    } catch (error) {
      throw `checkOrder Update Error: ${error}`;
    }
  },
};

const subscriptions = {
  orderAdded: {
    // 모두에게 publish
    // subscribe: () => {
    //   return pubsub.asyncIterator(ORDER_ADDED);
    // },

    // admin이라는 특정유저에게만 publish
    subscribe: withFilter(
      () => pubsub.asyncIterator(ORDER_ADDED),
      async (payload, variables) => {
        const getUserRole = await getUser(variables.authToken);
        const checkRole = getUserRole.profile.role === ADMIN;
        return checkRole;
      }
    ),
  },
};

const resolvers = {
  Query: queries,
  Mutation: mutations,
  Subscription: subscriptions,
};

export default resolvers;
