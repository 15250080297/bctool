const requistion={
  state:{
    detailData:{},
    showDetail:false,
    showAdd:false
  },
  mutations:{
    UPDATE_REQUISTION_DETAIL_DATA:(state, data)=>{
      state.detailData = data;
    },
    SHOW_REQUISTION_DETAIL:(state, data)=>{
      state.detailData = data;
      state.showDetail = true;
    },
    HIDE_REQUISTION_DETAIL:(state)=>{
      state.showDetail = false;
    },
    SHOW_ADD_REQUISTION_DETAIL:(state)=>{
      state.showAdd = true;
    },
    HIDE_ADD_REQUISTION_DETAIL:(state)=>{
      state.showAdd = false;
    },
    CLEAR_REQUISTION_DETAIL:(state)=>{
      state.showAdd = false;
      state.showDetail = false;
      state.detailData = {};
    }
  },
  actions:{
    UpdateRequistionDetailData:({ commit }, data)=>{
      commit('UPDATE_REQUISTION_DETAIL_DATA', data);
    },
    ShowRequistionDetail:({ commit }, data)=>{
      commit('SHOW_REQUISTION_DETAIL', data);
    },
    HideRequistionDetail:({ commit })=>{
      commit('HIDE_REQUISTION_DETAIL');
    },
    ShowAddRequistionDetail:({ commit })=>{
      commit('SHOW_ADD_REQUISTION_DETAIL');
    },
    HideAddRequistionDetail:({ commit })=>{
      commit('HIDE_ADD_REQUISTION_DETAIL');
    },
    ClearRequistionDetail:({ commit })=>{
      commit('CLEAR_REQUISTION_DETAIL');
    }
  }
}
export default requistion
