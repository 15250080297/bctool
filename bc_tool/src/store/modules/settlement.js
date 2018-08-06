const settlement={
  state:{
    detailData:{},
    showDetail:false,
    showAdd:false,
    importSettlementEvent:{}
  },
  mutations:{
    UPDATE_SETTLEMENT_DETAIL_DATA:(state, data)=>{
      state.detailData = data;
    },
    SHOW_SETTLEMENT_DETAIL:(state, data)=>{
      state.detailData = data;
      state.showDetail = true;
    },
    HIDE_SETTLEMENT_DETAIL:(state)=>{
      state.showDetail = false;
    },
    SHOW_ADD_SETTLEMENT_DETAIL:(state,data)=>{
      state.detailData = data;
      state.showAdd = true;
    },
    HIDE_ADD_SETTLEMENT_DETAIL:(state)=>{
      state.showAdd = false;
    },
    CLEAR_SETTLEMENT_DETAIL:(state)=>{
      state.showAdd = false;
      state.showDetail = false;
      state.detailData = {};
    },
    SHOW_IMPORT_SETTLEMENT:(state, event)=>{
      state.importSettlementEvent = event;
    },
    HIDE_IMPORT_SETTLEMENT:(state)=>{
      state.importSettlementEvent.show = false;
    }
  },
  actions:{
    UpdateSettlementDetailData:({ commit }, data)=>{
      commit('UPDATE_SETTLEMENT_DETAIL_DATA', data);
    },
    ShowSettlementDetail:({ commit }, data)=>{
      commit('SHOW_SETTLEMENT_DETAIL', data);
    },
    HideSettlementDetail:({ commit })=>{
      commit('HIDE_SETTLEMENT_DETAIL');
    },
    ShowAddSettlementDetail:({ commit },data)=>{
      commit('SHOW_ADD_SETTLEMENT_DETAIL',data);
    },
    HideAddSettlementDetail:({ commit })=>{
      commit('HIDE_ADD_SETTLEMENT_DETAIL');
    },
    ClearSettlementDetail:({ commit })=>{
      commit('CLEAR_SETTLEMENT_DETAIL');
    },
    ShowImportSettlement:({ commit },event)=>{
      commit('SHOW_IMPORT_SETTLEMENT',event);
    },
    HideImportSettlement:({ commit })=>{
      commit('HIDE_IMPORT_SETTLEMENT');
    }
  }
}
export default settlement
