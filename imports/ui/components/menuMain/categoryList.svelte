<script>
  import { query } from 'svelte-apollo'
  import { GET_CATEGORIES } from '../../apollo/query'
  import CategoryForm from './categoryForm.svelte'
  import { modalActiveCategory } from '../../stores'

  const categories = query(GET_CATEGORIES)

  const onOpenModalActiveCategory = () => {
    modalActiveCategory.set(true)
  }
</script>

<div class="header-box-bottom">
  <ul class="d-flex justify-content-start">
    <li>
      <a href="#null" class="d-flex align-items-center">모두보기</a>
    </li>

    {#if $categories.loading}
      <li>
        <p class="d-flex align-items-center">Loading</p>
      </li>
    {:else}
      {#each $categories.data.categories as category (category._id)}
        <li>
          <a href="#null" class="d-flex align-items-center"
            >{category.categoryName}</a
          >
        </li>
      {/each}
    {/if}

    <li>
      <a
        href="#null"
        class="d-flex align-items-center add"
        on:click={onOpenModalActiveCategory}>+관리</a
      >
    </li>
  </ul>
</div>
