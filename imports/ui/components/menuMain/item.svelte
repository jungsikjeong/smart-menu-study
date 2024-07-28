<script>
  import { itemFormMode, itemFormValue, modalActiveItem } from '../../stores'
  export let item

  const openEditModeActiveItem = () => {
    $itemFormValue._id = item._id
    $itemFormValue.itemName = item.itemName
    $itemFormValue.itemPrice = item.itemPrice
    $itemFormValue.itemCategoryId = item.itemCategoryId
    $itemFormValue.itemImage = item.itemImage

    itemFormMode.onEditMode()
    modalActiveItem.openModal()
  }
</script>

<div class="col mb-2">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="card ct-shadow-sm menu-item-box"
    on:click={openEditModeActiveItem}
  >
    <div class="img-box-loading" style=""></div>
    <div class="card-body">
      <h5 class="card-title">{item.itemName}</h5>
      <p class="card-text">{item.itemPrice} 원</p>
    </div>
  </div>
</div>
