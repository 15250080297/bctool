const requistion = {
  state: {
    showAdd: false
  },
  mutations: {

    SHOW_ADD_DUTY: (state) => {
      state.showAdd = true;
    },
    HIDE_ADD_DUTY:(state)=>{
      state.showAdd = false;
    },
  },
  actions: {
    ShowAddDuty: ({commit}, data) => {
      commit('SHOW_ADD_DUTY', data);
    },

    HideAddDuty: ({commit}) => {
      commit('HIDE_ADD_DUTY');
    },
  }
}
export default requistion
