<script>
  import { mutation } from 'svelte-apollo'
  import { modalActiveComplateOrder, orders } from '../../stores'
  import Modal from '../common/modal.svelte'
  import { ADD_ORDER } from '../../apollo/query'
  import { orderValidateSchema } from '../../../utils/validates'

  const addOrder = mutation(ADD_ORDER)

  const onComplateOrder = async () => {
    try {
      await addOrder({ variables: $orders })
      modalActiveComplateOrder.set(false)
      orders.resetOrder()

      alert('주문이 완료되었습니다.')
      // notyf.success('주문이 완료되었습니다. ');
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmitComplateOrder = async () => {
    try {
      await orderValidateSchema.validate($orders, { abortEarly: false })
      onComplateOrder()
    } catch (error) {
      console.log(error)
      // errors = extractErrors(error)
    }
  }
</script>

<Modal bind:modalActive={$modalActiveComplateOrder}>
  <h4 slot="modal-title">주문 완료</h4>
  <div class="modal-body" slot="modal-body">
    <h5 class="mb-3">
      {$orders.orderPriceSum} 원 결재
    </h5>
    <!-- {#if errors.orderCount}
      <span class="invalid-feedback was-validated">{errors.orderCount}</span>
    {/if} -->
  </div>
  <div class="modal-footer" slot="modal-footer">
    <button class="btn btn-primary" on:click={onSubmitComplateOrder}
      >확인</button
    >
  </div>
</Modal>
