<script>
  import Modal from '../common/modal.svelte'
  import {
    itemFormValue,
    itemFormMode,
    modalActiveItem,
    itemCategorySelected,
  } from '../../stores'
  import { mutation, query } from 'svelte-apollo'
  import {
    ADD_ITEM,
    DELETE_ITEM,
    GET_CATEGORIES,
    GET_ITEMS,
    ITEM_FIELDS,
    UPDATE_ITEM,
    UPLOAD_FILE,
  } from '../../apollo/query'
  import { ADD_MODE, EDIT_MODE } from '../../../utils/constants'

  $: {
    if ($itemFormMode === ADD_MODE) itemFormValue.resetForm()
  }

  const items = query(GET_ITEMS)
  const categories = query(GET_CATEGORIES)
  const addItem = mutation(ADD_ITEM)
  const updateItem = mutation(UPDATE_ITEM)
  const deleteItem = mutation(DELETE_ITEM)
  const uploadFile = mutation(UPLOAD_FILE)

  const onAddItem = async () => {
    $itemFormValue.itemPrice = Number($itemFormValue.itemPrice)

    try {
      await addItem({
        variables: $itemFormValue,
        update: (cache, { data: { addItem } }) => {
          // const existingItems = cache.readQuery({ query: GET_ITEMS })
          // const newItem = addItem

          // cache.writeQuery({
          //   query: GET_ITEMS,
          //   variables: { itemCategoryId: $itemCategorySelected },
          //   data: {
          //     itemPageCount: existingItems.itemPageCount,
          //     items: [newItem, ...existingItems.items],
          //   },
          // })

          cache.modify({
            fields: {
              items(existingItemsRefs = [], { readField }) {
                const newItemRef = cache.writeFragment({
                  data: addItem,
                  fragment: ITEM_FIELDS,
                })

                return [newItemRef, ...existingItemsRefs]
              },
            },
          })
        },
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
    // items.refetch()
  }

  const onUpdateItem = async () => {
    $itemFormValue.itemPrice = Number($itemFormValue.itemPrice)

    try {
      await updateItem({
        variables: $itemFormValue,
        update: (cache, { data: { updateItem } }) => {
          // const existingItems = cache.readQuery({ query: GET_ITEMS })
          // const newItems = existingItems.items.map((item) =>
          //   item._id === updateItem._id ? (item = updateItem) : item,
          // )

          // cache.writeQuery({
          //   query: GET_ITEMS,
          //   variables: { itemCategoryId: $itemCategorySelected }, // 현재 캐시에 필터가있기때문에 꼭 넣어야한다고함
          //   data: {
          //     itemPageCount: existingItems.itemPageCount,
          //     items: newItems,
          //   },
          // })

          cache.modify({
            fields: {
              items(existingItemRefs, { readField }) {
                cache.writeFragment({
                  data: updateItem,
                  fragment: ITEM_FIELDS,
                })

                return existingItemRefs
              },
            },
          })
        },
      })
      clearItemForm()
    } catch (error) {
      console.log(`update item error ${error}`)
    }
  }

  const onDeleteItem = async () => {
    if (confirm('선택 메뉴를 삭제하겠습니까?')) {
      try {
        await deleteItem({
          variables: { _id: $itemFormValue._id },
          update: (cache, { data: { deleteItem } }) => {
            cache.modify({
              fields: {
                items(existingItems, {}) {
                  const newItems = existingItems.filter(
                    (item) => item.__ref !== `Item:${deleteItem}`, // deleteItem은 삭제된 __ref 값이 들어옴 (_id값이들어옴)  _id값 앞에 Item(타입)을 붙여야 캐시의 고유값과 같은 형태가 됌
                  )
                  return newItems
                },
              },
            })
          },
        })
        clearItemForm()
      } catch (error) {
        console.log(`delete item error: ${error}`)
      }
    }
  }
  // const onDeleteItem = async () => {
  //   if (confirm('선택 메뉴를 삭제하겠습니까?')) {
  //     try {
  //       await deleteItem({
  //         variables: { _id: $itemFormValue._id },
  //       })

  //       clearItemForm()
  //     } catch (error) {
  //       console.log(`delete item error: ${error}`)
  //     }
  //   }
  // }

  const onUploadFile = async (e) => {
    const { files } = e.target

    try {
      const upload = await uploadFile({ variables: { file: files[0] } })
      $itemFormValue.itemImage =
        upload.data.uploadFile.filePath + upload.data.uploadFile.fileName

      console.log('upload::', upload)
      return upload
    } catch (error) {
      console.log(`file upload error: ${error}`)
    }
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
      <input
        type="file"
        class="form-control"
        id="recipient-name"
        on:change={onUploadFile}
      />
      {#if $itemFormValue.itemImage}
        <div class="mb-3">
          <img
            src="http://localhost:3000/images{$itemFormValue.itemImage}"
            class="card-img-top"
            alt=""
          />
        </div>
      {/if}
    </div>
    <div class="mb-3">
      <img src="../images/food_img/KjdgrhOok.png" class="card-img-top" alt="" />
    </div>
  </div>

  <div
    class="modal-footer d-flex flex-column align-items-stretch"
    slot="modal-footer"
  >
    {#if $itemFormMode === ADD_MODE}
      <button
        type="button"
        class="btn btn-primary pt-3 pb-3"
        on:click={onAddItem}>메뉴 추가</button
      >
    {:else if $itemFormMode === EDIT_MODE}
      <div class="row item-bottom">
        <div class="col">
          <button
            type="button"
            class="btn btn-primary pt-3 pb-3"
            on:click={onUpdateItem}>메뉴 수정</button
          >
        </div>
        <div class="col">
          <button
            type="button"
            class="btn btn-danger pt-3 pb-3"
            on:click={onDeleteItem}>메뉴 삭제</button
          >
        </div>
      </div>
    {/if}
  </div>
</Modal>
