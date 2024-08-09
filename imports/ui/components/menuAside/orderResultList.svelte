<script>
  import { query, mutation } from 'svelte-apollo'
  import { GET_ORDERS, SUBSCRIBE_ORDER, CHECK_ORDER } from '../../apollo/query'
  import notyf from '../../../utils/notyConfig'
  import { fade } from 'svelte/transition'
  import { authToken } from '../../stores'

  const orders = query(GET_ORDERS)
  const checkOrder = mutation(CHECK_ORDER)

  // subscribeToMore로는 데이터를 받아오는 정확성이떨어져서 polling사용
  // 장점:정확성이 좋음, 단점: 자원소모가 심함
  // orders.startPolling(3000) //3초마다 데이터를 요청해서 받아옴

  orders.subscribeToMore({
    document: SUBSCRIBE_ORDER,
    variables: { authToken: $authToken }, // 서버에서 관리자인지 판단
    // 발행된 구독이 발생했을 때 이벤트 처리
    // prev는 기존에 발생한 발행 목록,
    // subscriptionDatd는 지금 발행한 데이터
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev
      const newOrder = subscriptionData.data.orderAdded

      // alert(`주문이 추가 되었습니다. ${newOrder.orderDate}`)
      notyf.success(`주문이 추가 되었습니다. </br> ${newOrder.orderDate}`)

      return {
        orders: [...prev.orders, newOrder],
      }
    },
  })

  const onCheckOrder = async (_id, orderState) => {
    console.log(`_id: ${_id}, orderState: ${orderState}`)
    const values = {
      _id: _id,
      orderState: orderState,
    }

    try {
      await checkOrder({
        variables: values,
        update: (cache, { data: { checkOrder } }) => {
          const existingOrders = cache.readQuery({ query: GET_ORDERS })
          const newOrders = existingOrders.orders.map((order) => {
            if (order._id === checkOrder) {
              let newOrder = { ...order }
              newOrder.orderState = !orderState

              return newOrder
            }
            return order
          })

          cache.writeQuery({
            query: GET_ORDERS,
            data: {
              orders: newOrders,
            },
          })
        },
      })
    } catch (error) {
      console.log(error)
    }
  }
</script>

<ul>
  {#if $orders.loading}
    <li class="d-flex flex-column p-4 order-result-list"><p>Loading...</p></li>
  {:else}
    {#each [...$orders.data.orders].reverse() as order (order._id)}
      <!-- order one start -->
      <li
        class="d-flex flex-column p-4 order-result-list"
        in:fade={{ delay: 300, duration: 500 }}
      >
        <div class="d-flex justify-content-between">
          <ul class="order-inner-list">
            <li class="d-flex justify-content-between date">
              <p class:orderChecked={order.orderState}>{order.orderDate}</p>
              {#if order.orderState}
                <p
                  class="btnOrderCheck"
                  on:click={() => onCheckOrder(order._id, order.orderState)}
                >
                  취소
                </p>
              {:else}
                <p
                  class="btnOrderCheck"
                  on:click={() => onCheckOrder(order._id, order.orderState)}
                >
                  확인
                </p>
              {/if}
            </li>
            {#if order.orderItems}
              {#each order.orderItems as item}
                <li class="d-flex justify-content-between">
                  <p class:orderChecked={order.orderState}>{item.itemName}</p>
                  <p class:orderChecked={order.orderState}>
                    {item.itemCount}개
                  </p>
                </li>
                <li class="d-flex justify-content-between">
                  <p class:orderChecked={order.orderState}>
                    가격(개당: {item.itemPrice})
                  </p>
                  <p class:orderChecked={order.orderState}>
                    {item.itemPriceSum}
                  </p>
                </li>
              {/each}
            {/if}
            <li class="d-flex justify-content-between total">
              <p class:orderChecked={order.orderState}>개수합계</p>
              <p class:orderChecked={order.orderState}>{order.orderCount}</p>
            </li>
            <li class="d-flex justify-content-between total">
              <p class:orderChecked={order.orderState}>가격합계</p>
              <p class:orderChecked={order.orderState}>{order.orderPriceSum}</p>
            </li>
          </ul>
        </div>
      </li>
      <!-- order one end -->
    {/each}
  {/if}
</ul>

<!-- order results end-->

<style>
  .orderChecked {
    text-decoration-line: line-through underLine;
  }
  .btnOrderCheck {
    cursor: pointer;
  }
</style>
