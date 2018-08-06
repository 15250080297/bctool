const storage ={
  state:{
    addEvent:'',
    addListEvent:'',
    editEvent:'',
    warehouseEvent:''
  },
  mutations:{
    SET_ADD_EVENT:(state,event) => {
      state.addEvent = event
    },
    SET_ADD_LIST_EVENT:(state,event) => {
      state.addListEvent = event
    },
    SET_EDIT_EVENT:(state,event) =>{
      state.editEvent = event
    },
    SET_WAREHOUSE_EVENT:(state,event)=>{
      state.warehouseEvent=event
    }
  },
  actions:{
    StorageAddEvent:({commit},event)=>{
      console.log('StorageAddEvent',event)
      commit('SET_ADD_EVENT',event)
    },
    StorageEditEvent:({commit},event) => {
      commit('SET_EDIT_EVENT',event)
    },
    StorageAddListEvent:({commit},event) => {
      commit('SET_ADD_LIST_EVENT',event)
    },
    WarehouseEvent:({commit},event)=>{
      commit('SET_WAREHOUSE_EVENT',event)
    }
  }
}

export default storage
