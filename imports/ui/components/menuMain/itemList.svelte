<script>
  import { query } from 'svelte-apollo'
  import { GET_ITEMS } from '../../apollo/query'
  import ItemLoading from './itemLoading.svelte'
  import Item from './item.svelte'
  import {
    itemPage,
    modalActiveItem,
    itemPageLock,
    itemFormMode,
    itemCategorySelected,
    itemSearch,
  } from '../../stores'

  let component
  let elementScroll

  const items = query(GET_ITEMS)

  const onOpenModalItemForm = () => {
    modalActiveItem.openModal()
    itemFormMode.onAddMode()
  }

  const onScroll = (e) => {
    const scrollHeight = e.target.scrollHeight // 스크롤 높이
    const clientHeight = e.target.clientHeight // 화면 높의
    const scrollTop = e.target.scrollTop // 현재 스크롤 위치
    const realHeight = scrollHeight - clientHeight // 실제 스크롤 사이즈
    const triggerHeight = realHeight * 0.7 // 다음 페이지가 호출될 스크롤 위치

    const triggerComputed = () => scrollTop > triggerHeight
    const scrollTrigger = () => triggerComputed() && !$itemPageLock
    const countCheck = () => $items.data.itemPageCount <= $itemPage.pageNumber

    if (countCheck()) {
      itemPageLock.set(true) // 페이지가 더이상 진행되지 않도록 잠굼
    }

    if (scrollTrigger()) {
      console.log('next')
      itemPage.nextPage()
    }
  }

  $: {
    // onScroll 이벤트를 돔에 연동
    // 스크롤 액션 인식
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode

      element.addEventListener('scroll', onScroll)
      element.addEventListener('resize', onScroll)
    }

    // 페이지 번호가 변하면 fetchMore를 이용해 다음 페이지 값을 불러옴
    items
      .fetchMore({
        variables: {
          pageNumber: $itemPage.pageNumber,
          itemCategoryId: $itemCategorySelected,
          search: $itemSearch,
        },
      })
      .then((result) => {
        itemPageLock.set(false) // 다음페이지 이동을위해 false로 설정
        // itemMainLoading.set(false)
        // itemPageLoading.set(false)
      })

    items.refetch({
      itemCategoryId: $itemCategorySelected,
      search: $itemSearch,
    })
  }
</script>

<div
  class="row row-cols-4 g-4 pl-3 pr-3 pt-2 pb-4 list-bg-shadow"
  bind:this={component}
>
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
