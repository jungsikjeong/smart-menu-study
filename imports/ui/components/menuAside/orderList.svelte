<script>
  import { orders } from '../../stores'

  const onIncrementOrder = (item) => {
    orders.incrementOrder(item)
  }

  const onDecrementOrder = (item) => {
    orders.decrementOrder(item)
  }
</script>

<ul>
  {#each $orders.orderItems as item (item._id)}
    <li class="d-flex p-4 align-items-center">
      <div class="order-title-box d-flex flex-column justify-content-between">
        <h4>{item.itemName}</h4>
        <p class="price-sum">{item.itemPriceSum}</p>
      </div>
      <div class="order-btn-box d-flex justify-content-end">
        <button class="btn btn-ui mr-1" on:click={() => onIncrementOrder(item)}
          ><i class="bx bx-plus"></i></button
        >
        <input
          type="text"
          class="form-control border-line"
          bind:value={item.itemCount}
        />
        <button class="btn btn-ui ml-1" on:click={() => onDecrementOrder(item)}
          ><i class="bx bx-minus"></i></button
        >
      </div>
    </li>
  {/each}
</ul>
