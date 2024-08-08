import { query } from 'svelte-apollo'
import { ADD_MODE, EDIT_MODE, ALL, ADMIN } from '../../utils/constants'
import { GET_ME } from '../apollo/query'
import { derived, writable } from 'svelte/store'

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

function setItemCategorySelected() {
  const { subscribe, set } = writable(ALL)

  const selectCategory = (_id) => {
    set(_id)
    itemPage.resetPage()
  }

  return {
    subscribe,
    selectCategory,
  }
}

function setAuthToken() {
  const isLoginToken = localStorage.getItem('Meteor.loginToken')

  const { subscribe, update, set } = writable(isLoginToken)

  const saveAuthToken = ({ data: { loginWithPassword } }) => {
    try {
      localStorage.setItem('Meteor.loginToken', loginWithPassword.authToken)
      set(loginWithPassword.authToken)
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const removeAuthToken = () => {
    localStorage.removeItem('Meteor.loginToken')
    set('')
  }

  const checkToken = () => {
    const isToken = localStorage.getItem('Meteor.loginToken')
    if (!isToken) set('')
  }

  return {
    subscribe,
    saveAuthToken,
    removeAuthToken,
    checkToken,
  }
}

function setAuth() {
  let initValues = {
    _id: '',
    email: '',
    role: '',
  }

  const { subscribe, set } = writable({ ...initValues })

  const createAuth = async () => {
    try {
      const getLoginUser = query(GET_ME)
      const loginUser = await getLoginUser.refetch()

      const _id = loginUser.data.me._id
      const email = loginUser.data.me.emails[0].address
      const role = loginUser.data.me.profile.role

      set({ _id, email, role })
      return
    } catch (error) {
      authToken.removeAuthToken()
      set({ ...initValues })
      return
    }
  }

  const resetAuth = () => {
    authToken.removeAuthToken()
    set({ ...initValues })
    return
  }

  return {
    subscribe,
    createAuth,
    resetAuth,
  }
}

function setIsAdmin() {
  // derived는 원본이 되는 스토어를 참고하여, 원본 스토어 조작없이 어떤 값을 만들어주는 스토어임
  // derived를 이용해 만든 값은 원본 스토어에 변화가 발생하면 바로 대응하는 반응성을 가짐
  const checkRole = derived(auth, ($auth) =>
    $auth.role === ADMIN ? true : false,
  )
  return checkRole
}

export const modalActiveCategory = writable(false)
export const modalActiveItem = setModalActiveItem()
export const itemFormValue = setItemFormValue()
export const itemPageLock = writable(false)
export const itemPage = setItemPage()
export const itemPageLoading = writable(false)
export const itemFormMode = setItemFormMode()
export const itemCategorySelected = setItemCategorySelected()
export const itemSearch = writable('')
export const authToken = setAuthToken()
export const auth = setAuth()
export const isAdmin = setIsAdmin()
