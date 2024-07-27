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
export const modalActiveCategory = writable(false)
export const modalActiveItem = setModalActiveItem()
export const itemFormValue = setItemFormValue()
