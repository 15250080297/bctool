const warehouse={
  state:{
    showAdd:false

  },
  mutations:{
    HIDE_ADD_REQUISTION_DETAIL:(state)=>{
      state.showAdd = false;
    }

  },
  actions:{
    HideAddRequistionDetail:({ commit })=>{
      commit('HIDE_ADD_REQUISTION_DETAIL');
    }

  }
}
export default warehouse
