<script>
  import Modal from '../common/modal.svelte'
  import { itemFormValue, modalActiveItem } from '../../stores'
  import { mutation, query } from 'svelte-apollo'
  import { ADD_ITEM, GET_CATEGORIES, GET_ITEMS } from '../../apollo/query'

  const items = query(GET_ITEMS)
  const categories = query(GET_CATEGORIES)
  const addItem = mutation(ADD_ITEM)

  const onAddItem = async () => {
    $itemFormValue.itemPrice = Number($itemFormValue.itemPrice)

    try {
      await addItem({
        variables: $itemFormValue,
      })
      clearItemForm()
    } catch (error) {
      console.log(`add item error: ${error.message}`)
    }
  }

  const clearItemForm = () => {
    itemFormValue.resetForm()
    modalActiveItem.closeModal()
    // errors = {}
    items.refetch()
  }
</script>

<Modal bind:modalActive={$modalActiveItem}>
  <h4 slot="modal-title">메뉴 추가</h4>

  <div class="modal-body" slot="modal-body">
    <div class="mb-3">
      <label for="recipient-name" class="col-form-label">메뉴 이름:</label>
      <input
        type="text"
        class="form-control"
        id="recipient-name"
        bind:value={$itemFormValue.itemName}
      />
      <!-- <div class="invalid-feedback was-validated">이름을 입력해 주세요.</div> -->
    </div>
    <div class="mb-3">
      <label for="recipient-name" class="col-form-label">메뉴 카테고리:</label>
      <select
        name="menu-cateogry-select"
        class="form-select"
        bind:value={$itemFormValue.itemCategoryId}
      >
        <option value="">카테고리 선택</option>
        {#each $categories.data.categories as category (category._id)}
          <option value={category._id}>{category.categoryName}</option>
        {/each}
      </select>
      <!-- {#if errors.itemCategoryId}
        <span class="invalid-feedback was-validated"
          >{errors.itemCategoryId}</span
        >
      {/if} -->
    </div>
    <div class="mb-3">
      <label for="message-text" class="col-form-label">메뉴 가격:</label>
      <input
        type="text"
        class="form-control"
        id="recipient-name"
        bind:value={$itemFormValue.itemPrice}
      />
    </div>
    <div class="mb-3">
      <label for="message-text" class="col-form-label">메뉴 이미지:</label>
      <input type="file" class="form-control" id="recipient-name" />
    </div>
    <div class="mb-3">
      <img src="../images/food_img/KjdgrhOok.png" class="card-img-top" alt="" />
    </div>
  </div>

  <div
    class="modal-footer d-flex flex-column align-items-stretch"
    slot="modal-footer"
  >
    <button type="button" class="btn btn-primary pt-3 pb-3" on:click={onAddItem}
      >메뉴 추가</button
    >
  </div>
</Modal>
