const demo={
    state:{
        detailData:{},
        showDetail:false
    },
    mutations:{
        UPDATE_DETAIL_DATA:(state, data)=>{
            state.detailData = data;
        },
        SHOW_DETAIL:(state, data)=>{
            state.detailData = data;
            state.showDetail = true;
        },
        HIDE_DETAIL:(state)=>{
            state.showDetail = false;
        }
    },
    actions:{
        UpdateDetailData:({ commit }, data)=>{
            commit('UPDATE_DETAIL_DATA', data);
        },
        ShowDetail:({ commit }, data)=>{
            commit('SHOW_DETAIL', data);
        },
        HideDetail:({ commit })=>{
            commit('HIDE_DETAIL');
        },
    }
}
export default demo