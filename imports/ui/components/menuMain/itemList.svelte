<script>
  import { query } from 'svelte-apollo'
  import { GET_ITEMS } from '../../apollo/query'
  import ItemLoading from './itemLoading.svelte'
  import Item from './item.svelte'
  import { modalActiveItem } from '../../stores'

  const items = query(GET_ITEMS)

  const onOpenModalItemForm = () => {
    modalActiveItem.openModal()
  }
</script>

<div class="row row-cols-4 g-4 pl-3 pr-3 pt-2 pb-4 list-bg-shadow">
  {#if $items.loading}
    <ItemLoading />
  {:else}
    <div class="col mb-2">
      <span class="btn-add-modal-show" on:click={onOpenModalItemForm}>
        <div
          class="card menu-add-box h-100 d-flex justify-content-center align-items-center"
        >
          <i class="bx bx-plus bx-md"></i>
        </div>
      </span>
    </div>

    {#each $items.data.items as item (item._id)}
      <Item {item} />
    {/each}
  {/if}
</div>
