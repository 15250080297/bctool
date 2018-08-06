const invoice={
  state:{
    detailData:{},
    showDetail:false,
    showAdd:false,
    importStorageEvent:{}
  },
  mutations:{
    SHOW_INVOICE_ADD:(state, data)=>{
      state.detailData = data;
      state.showAdd = true;
    },
    HIDE_INVOICE_ADD:(state)=>{
      state.showAdd = false;
    },
    SHOW_INVOICE_DETAIL:(state, data)=>{
      state.detailData = data;
      state.showDetail = true;
    },
    HIDE_INVOICE_DETAIL:(state)=>{
      state.showDetail = false;
    },
    SHOW_IMPORT_STORAGE:(state, event)=>{
      state.importStorageEvent = event;
    },
    HIDE_IMPORT_STORAGE:(state)=>{
      state.importStorageEvent.show = false;
    }
  },
  actions:{
    ShowInvoiceAdd:({ commit }, data)=>{
      commit('SHOW_INVOICE_ADD', data);
    },
    HideInvoiceAdd:({ commit })=>{
      commit('HIDE_INVOICE_ADD');
    },
    ShowInvoiceDetail:({ commit }, data)=>{
      commit('SHOW_INVOICE_DETAIL', data);
    },
    HideInvoiceDetail:({ commit })=>{
      commit('HIDE_INVOICE_DETAIL');
    },
    ShowImportStorage:({ commit },event)=>{
      commit('SHOW_IMPORT_STORAGE',event);
    },
    HideImportStorage:({ commit })=>{
      commit('HIDE_IMPORT_STORAGE');
    }
  }
}
export default invoice
