<script>
  import CategoryForm from './categoryForm.svelte'
  import CategoryList from './categoryList.svelte'
  import ItemForm from './itemForm.svelte'
  import ItemList from './itemList.svelte'
  import ItemSearch from './itemSearch.svelte'
</script>

<main>
  <div class="content d-flex flex-column container-fluid">
    <div class="main-header-section d-flex flex-column">
      <ItemSearch />
      <CategoryList />
      <CategoryForm />
    </div>

    <div class="main-content-section simplebar">
      <ItemList />
      <ItemForm />
    </div>
  </div>
</main>
