const conversion={
  state:{
    addEvent:'',
    editEvent:''
  },
  mutations:{
    SET_ADD_EVENT:(state,event)=>{
      state.addEvent = event;
    },
    SET_EDIT_EVENT:(state,event)=>{
      state.editEvent = event;
    }
  },
  actions:{
    setAddEvent:({ commit },event)=>{
      commit('SET_ADD_EVENT',event);
    },
    setEditEvent:({ commit },event)=>{
      commit('SET_EDIT_EVENT',event);
    }
  }
}
export default conversion
