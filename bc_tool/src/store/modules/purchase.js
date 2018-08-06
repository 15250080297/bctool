const purchase={
  state:{
    detailData:{},
    showDetail:false,
    showAdd:false,
    importRequistionEvent:{},
    prDetailData:{},
    prShowDetail:false,
    prAddDetailData:{},
    prAddShowDetail:false,
  },
  mutations:{
    UPDATE_PURCHASE_DETAIL_DATA:(state, data)=>{
      state.detailData = data;
    },
    SHOW_PURCHASE_DETAIL:(state, data)=>{
      state.detailData = data;
      state.showDetail = true;
    },
    HIDE_PURCHASE_DETAIL:(state)=>{
      state.showDetail = false;
    },
    SHOW_ADD_PURCHASE_DETAIL:(state, data)=>{
      state.detailData = data;
      state.showAdd = true;
    },
    HIDE_ADD_PURCHASE_DETAIL:(state)=>{
      state.showAdd = false;
    },
    SHOW_IMPORT_REQUISTION:(state, event)=>{
      state.importRequistionEvent = event;
    },
    HIDE_IMPORT_REQUISTION:(state)=>{
      state.importRequistionEvent.show = false;
    },
    SHOW_PR_REFUND_ADD:(state, data)=>{
      state.prAddDetailData = data;
      state.prAddShowDetail = true;
    },
    HIDE_PR_REFUND_ADD:(state)=>{
      state.prAddShowDetail = false;
    },
    SHOW_PR_REFUND_DETAIL:(state, data)=>{
      state.prDetailData = data;
      state.prShowDetail = true;
    },
    HIDE_PR_REFUND_DETAIL:(state)=>{
      state.prShowDetail = false;
    }
  },
  actions:{
    UpdatePurchaseDetailData:({ commit }, data)=>{
      commit('UPDATE_PURCHASE_DETAIL_DATA', data);
    },
    ShowPurchaseDetail:({ commit }, data)=>{
      commit('SHOW_PURCHASE_DETAIL', data);
    },
    HidePurchaseDetail:({ commit })=>{
      commit('HIDE_PURCHASE_DETAIL');
    },
    ShowAddPurchaseDetail:({ commit }, data)=>{
      commit('SHOW_ADD_PURCHASE_DETAIL', data);
    },
    HideAddPurchaseDetail:({ commit })=>{
      commit('HIDE_ADD_PURCHASE_DETAIL');
    },
    ShowImportRequistion:({ commit },event)=>{
      commit('SHOW_IMPORT_REQUISTION',event);
    },
    HideImportRequistion:({ commit })=>{
      commit('HIDE_IMPORT_REQUISTION');
    },
    ShowPrOrderAdd:({ commit }, data)=>{
      commit('SHOW_PR_REFUND_ADD', data);
    },
    HidePrOrderAdd:({ commit })=>{
      commit('HIDE_PR_REFUND_ADD');
    },
    ShowPrOrderDetail:({ commit }, data)=>{
      commit('SHOW_PR_REFUND_DETAIL', data);
    },
    HidePrOrderDetail:({ commit })=>{
      commit('HIDE_PR_REFUND_DETAIL');
    }
  }
}
export default purchase
