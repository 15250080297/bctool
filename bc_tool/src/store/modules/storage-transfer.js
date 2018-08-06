const storageTransfer =
  {
    state: {
      detailData: {},
      showAdd: false,
      showEdit: false
    },
    mutations: {
      SHOW_ADD_STORAGE_TRANSFER_DETAIL: (state) => {
        state.showAdd = true
      },
      HIDE_ADD_STORAGE_TRANSFER_DETAIL: (state) => {
        state.showAdd = false
      },
      SHOW_EDIT_STORAGE_TRANSFER_DETAIL: (state, data) => {
        state.showEdit = true,
        state.detailData = data
      },
      HIDE_EDIT_STORAGE_TRANSFER_DETAIL: (state) => {
        state.showEdit = false
      },
    },
    actions: {
      ShowAddStorageTransferDetail: ({commit}) => {
        commit('SHOW_ADD_STORAGE_TRANSFER_DETAIL')
      },
      HideAddStorageTransferDetail: ({commit}) => {
        commit('HIDE_ADD_STORAGE_TRANSFER_DETAIL')
      },
      ShowEditStorageTransFerDetail: ({commit}, data) => {
        commit('SHOW_EDIT_STORAGE_TRANSFER_DETAIL', data)
      },
      HideEditStorageTransFerDetail: ({commit}) => {
        commit('HIDE_EDIT_STORAGE_TRANSFER_DETAIL')
      },

    }
  }
export default storageTransfer
