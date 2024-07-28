import { ADD_MODE, EDIT_MODE } from '../../utils/constants'

const { writable } = require('svelte/store')

function setModalActiveItem() {
  const { subscribe, set } = writable(false)

  const openModal = () => set(true)
  const closeModal = () => set(false)

  return {
    subscribe,
    set,
    openModal,
    closeModal,
  }
}

function setItemFormValue() {
  const initValues = {
    _id: '',
    itemName: '',
    itemCategoryId: '',
    itemPrice: '',
    itemImage: '',
  }

  const { subscribe, set } = writable({ ...initValues })

  const resetForm = () => set({ ...initValues })

  return {
    subscribe,
    set,
    resetForm,
  }
}

function setItemPage() {
  const initValues = {
    pageNumber: 1,
  }

  const { subscribe, set, update } = writable({ ...initValues })

  const nextPage = () => {
    update((data) => {
      data.pageNumber = data.pageNumber + 1
      itemPageLock.set(true) // 페이지 넘버가 증가하면 서버에 새로운 데이터를 호출하게되기 때문에 true를 줘서 Lock을걸어줌
      itemPageLoading.set(true)
      return data
    })
  }

  const resetPage = () => {
    itemPageLock.set(true)
    set({ ...initValues })
  }

  return {
    subscribe,
    nextPage,
    resetPage,
  }
}

function setItemFormMode() {
  const { subscribe, set } = writable('')

  const onAddMode = () => set(ADD_MODE)
  const onEditMode = () => set(EDIT_MODE)

  return {
    subscribe,
    onAddMode,
    onEditMode,
  }
}

export const modalActiveCategory = writable(false)
export const modalActiveItem = setModalActiveItem()
export const itemFormValue = setItemFormValue()
export const itemPageLock = writable(false)
export const itemPage = setItemPage()
export const itemPageLoading = writable(false)
export const itemFormMode = setItemFormMode()
