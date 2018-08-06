import {getAccountList,getAuxiliaryList,getCashFlow} from '@/api/voucher'
const voucher ={
  state: {
    accountTreeDto: [],
    auxiliaryDto: [],
    ncCashFlowTreeDto: [],
    showAdd:false,
    showEdit:false,
    showTree:{},
    detailData:'',
    voucherNo:'',
    auxiliaryEvent:'',
    showCashFlow:false,
    cashFlowEvent:'',
    cashFlowListEvent:false
  },

  mutations: {
    SET_ACC_TREE: (state,accTree) => {
      state.accTree = accTree
    },
    SET_AUXILIARY: (state, auxiliary) => {
      state.auxiliary = auxiliary
    },
    SET_CASH_FLOW_TREE: (state, cash_tree) => {
      state.cash_tree = cash_tree
    },
    SET_TO_SHOW_ADD:(state) =>{
      state.showAdd = true
    },
    SET_TO_HIDE_ADD:(state) =>{
      state.showAdd = false
    },
    SET_TO_SHOW_EDIT:(state) =>{
      state.showEdit = true
    },
    SET_TO_HIDE_EDIT:(state) =>{
      state.showEdit = false
    },
    SET_EDIT_DETAIL:(state, data) =>{
      state.detailData = data
    },
    SET_TO_SHOW_TREE:(state, event) =>{
      state.showTree = event
    },
    SET_TO_HIDE_TREE:(state) =>{
      state.showTree.show = false
    },
    SET_VOUCHER_NO:(state,voucherNo) =>{
      state.voucherNo = voucherNo
    },
    SET_TO_SHOW_AUXILIARY: (state,event)=>{
      state.auxiliaryEvent = event
    },
    SET_TO_HIDE_AUXILIARY: (state) =>{
      state.auxiliaryEvent.show = false
    },
    SET_CASH_FLOW_EVENT:(state,event) =>{
      state.cashFlowEvent = event
    },
    SET_TO_SHOW_CASHFLOW_LIST: (state,event) =>{
      state.cashFlowListEvent = event
    },
    SET_TO_HIDE_CASHFLOW_LIST: (state) =>{
      state.cashFlowListEvent.show = false
    }
  },

  actions: {
    GetAccountTree({commit}){
      return new Promise((resolve, reject) => {
        getAccountList().then(response => {
          commit('SET_ACC_TREE',response)
        })
      })
    },
    ShowAddVoucherSwitch({commit}){
      console.log("====ShowAddVoucherSwitch")
      commit('SET_TO_SHOW_ADD')
    },
    HideAddVoucherSwitch({commit}){
      commit('SET_TO_HIDE_ADD')
    },
    ShowEDITVoucherSwitch({commit},voucherNo){
      commit('SET_TO_SHOW_EDIT')
      commit('SET_VOUCHER_NO',voucherNo)
    },
    HideVoucherSwitch({commit}){
      commit('SET_TO_HIDE_EDIT')
      commit('SET_TO_HIDE_ADD')
    },
    TreeDialogShow({commit},event){
      commit('SET_TO_SHOW_TREE',event)
    },
    TreeDialogHide({commit}){
      commit('SET_TO_HIDE_TREE')
    },
    AuxiliaryDialogShow({commit},event){
      commit('SET_TO_SHOW_AUXILIARY',event)
    },
    AuxiliaryDialogHide({commit}){
      commit('SET_TO_HIDE_AUXILIARY')
    },
    CashFlowEvent({commit},event){
      console.log('CashFlowEvent now modify cashFlow  event=')
      console.log(event)
      commit('SET_CASH_FLOW_EVENT',event)
    },
    ShowCashFlowList({commit},event){
      commit('SET_TO_SHOW_CASHFLOW_LIST',event)
    },
    HideCashFlowList({commit}){
      commit('SET_TO_HIDE_CASHFLOW_LIST')
    }
  }

}
export default voucher
