<script>
  import Modal from '../common/modal.svelte'
  import { modalActiveCategory } from '../../stores'
  import {
    ADD_CATEGORY,
    DELETE_CATEGORY,
    GET_CATEGORIES,
    UPDATE_CATEGORY,
  } from '../../apollo/query'
  import { query, mutation } from 'svelte-apollo'
  import notyf from '../../../utils/notyConfig'

  const categories = query(GET_CATEGORIES)
  const addCategory = mutation(ADD_CATEGORY)
  const deleteCategory = mutation(DELETE_CATEGORY)
  const updateCategory = mutation(UPDATE_CATEGORY)

  let addValues = {
    categoryName: '',
  }

  let updateValues = {
    _id: '',
    categoryName: '',
  }

  const clearCategoryForm = () => {
    categories.refetch() // 카테고리 목록을 다시 불러옴
    addValues.categoryName = ''
    updateValues._id = ''
    updateValues.categoryName = ''
  }

  const onAddCategory = async () => {
    try {
      await addCategory({ variables: addValues })
      clearCategoryForm()
    } catch (error) {
      console.log(`add cateogry error ${error.message}`)
    }
  }

  const onDeleteCategory = async (_id) => {
    const deleteCategoryValue = {
      _id: _id,
    }

    if (confirm('해당 카테고리를 삭제하겠습니까?')) {
      try {
        await deleteCategory({ variables: deleteCategoryValue })
        clearCategoryForm()
      } catch (error) {
        console.log(`delete category error: ${error.message}`)
      }
    }
  }

  const onEditMode = (category) => {
    updateValues._id = category._id
    updateValues.categoryName = category.categoryName
  }

  const onUpdateCategory = async () => {
    try {
      await updateCategory({ variables: updateValues })
      clearCategoryForm()
    } catch (error) {
      console.log(`update category error: ${error.message}`)
    }
  }
</script>

<Modal bind:modalActive={$modalActiveCategory}>
  <h4 slot="modal-title">메뉴 추가</h4>

  <div class="modal-body" slot="modal-body">
    <h5 class="mb-3">카테고리 목록</h5>

    {#if $categories.loading}
      <li><p>Loading</p></li>
    {:else}
      {#each $categories.data.categories as category (category._id)}
        {#if updateValues._id !== category._id}
          <li class="mb-3 d-flex justfiy-content-between">
            <p>{category?.categoryName}</p>

            <div class="edit-box">
              <a href="#nulll" class="link">
                <i
                  class="bx bxs-pencil"
                  on:click={() => onEditMode(category)}
                />
              </a>
              <a href="#nulll" class="link">
                <i
                  class="bx bxs-trash"
                  on:click={() => onDeleteCategory(category._id)}
                />
              </a>
            </div>
          </li>
        {:else}
          <li class="mb-3 d-flex justify-contnets-between">
            <input
              type="text"
              class="form-control border-line"
              bind:value={updateValues.categoryName}
              on:focusout={onUpdateCategory}
            />
          </li>
        {/if}
      {/each}
    {/if}
  </div>

  <div
    class="modal-footer d-flex flex-column align-items-stretch"
    slot="modal-footer"
  >
    <div class="input-group">
      <input
        type="text"
        class="form-control border-line"
        bind:value={addValues.categoryName}
      />
      <button class="btn btn-primary" on:click={onAddCategory}>등록</button>
    </div>
  </div>
</Modal>
