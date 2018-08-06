const sales={
  state:{
    detailData:{},
    showDetail:false,
    showAdd:false
  },
  mutations:{
    UPDATE_SALES_DETAIL_DATA:(state, data)=>{
      state.detailData = data;
    },
    SHOW_SALES_DETAIL:(state, data)=>{
      state.detailData = data;
      state.showDetail = true;
    },
    HIDE_SALES_DETAIL:(state)=>{
      state.showDetail = false;
    },
    SHOW_ADD_SALES_DETAIL:(state)=>{
      state.showAdd = true;
    },
    HIDE_ADD_SALES_DETAIL:(state)=>{
      state.showAdd = false;
    },
    CLEAR_SALES_DETAIL:(state)=>{
      state.showAdd = false;
      state.showDetail = false;
      state.detailData = {};
    }
  },
  actions:{
    UpdateSalesDetailData:({ commit }, data)=>{
      commit('UPDATE_SALES_DETAIL_DATA', data);
    },
    ShowSalesDetail:({ commit }, data)=>{
      commit('SHOW_SALES_DETAIL', data);
    },
    HideSalesDetail:({ commit })=>{
      commit('HIDE_SALES_DETAIL');
    },
    ShowAddSalesDetail:({ commit })=>{
      commit('SHOW_ADD_SALES_DETAIL');
    },
    HideAddSalesDetail:({ commit })=>{
      commit('HIDE_ADD_SALES_DETAIL');
    },
    ClearSalesDetail:({ commit })=>{
      commit('CLEAR_SALES_DETAIL');
    }
  }
}
export default sales
