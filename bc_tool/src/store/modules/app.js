import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      // opened: !+Cookies.get('sidebarStatus'),
      opened: 1,
      withoutAnimation: false
    },
    device: 'desktop',
    tableDatePickerEvent:{},
    productSelectEvent:{},
    approvalStreamEvent:{},
    wareHouseEvent:{}
  },
  mutations: {
    SHOW_SIDEBAR: state =>{
      state.sidebar.opened = 1;
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SHOW_TABLE_DATEPICKER:(state, event)=>{
      state.tableDatePickerEvent = event;
    },
    HIDE_TABLE_DATEPICKER:(state)=>{
       state.tableDatePickerEvent.show = false;
    },
    SHOW_PRODUCT_SELECT:(state, event)=>{
      state.productSelectEvent = event;
    },
    HIDE_PRODUCT_SELECT:(state)=>{
      state.productSelectEvent.show = false;
    },
    SHOW_APPROVAL_STREAM:(state, event)=>{
      state.approvalStreamEvent = event;
    },
    HIDE_APPROVAL_STREAM:(state)=>{
      state.approvalStreamEvent.show = false;
    },
    SHOW_WARE_HOUSE:(state, event)=>{
      state.wareHouseEvent = event;
    },
    HIDE_WARE_HOUSE:(state)=>{
      state.wareHouseEvent.show = false;
    }
  },
  actions: {
    ShowSideBar:({commit})=>{
      commit('SHOW_SIDEBAR');
    },
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ShowTableDatepicker({commit}, event){
      commit('SHOW_TABLE_DATEPICKER', event);
    },
    HideTableDatepicker({commit}){
      commit('HIDE_TABLE_DATEPICKER', event);
    },
    ShowProductSelect({commit}, event){
      commit('SHOW_PRODUCT_SELECT', event);
    },
    HideProductEvent({commit}){
      commit('HIDE_PRODUCT_SELECT', event);
    },
    ShowApprovalStream({commit}, event){
      commit('SHOW_APPROVAL_STREAM', event);
    },
    HideApprovalStream({commit}){
      commit('HIDE_APPROVAL_STREAM', event);
    },
    ShowWareHouse({commit}, event){
      console.log('ShowWareHouse event=',event)
      commit('SHOW_WARE_HOUSE', event);
    },
    HideWareHouse({commit}){
      commit('HIDE_WARE_HOUSE', event);
    }

  }
}

export default app
