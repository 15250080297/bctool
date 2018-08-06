/**
 * Created by kevin on 2017/4/11.
 */
const Noty = require('noty');
var AlertUtil = {}

export default AlertUtil.install = function (Vue, options) {

    Vue.prototype.$showInfoMessage = function (message) {
        new Noty({
            type: 'info',
            theme: 'mint',
            timeout:5000,
            text: message,
            closeWith:['click', 'button'],
            queue: 'global',
            killer: true
        }).show();
    }

    Vue.prototype.$showSuccessMessage = function (message) {
        new Noty({
            type: 'success',
            theme: 'mint',
            timeout:5000,
            text: message,
            closeWith:['click', 'button'],
            queue: 'global',
            killer: true
        }).show();
    }

    Vue.prototype.$showErrorMessage = function (message) {
        new Noty({
            type: 'error',
            theme: 'mint',
            timeout:5000,
            text: message,
            closeWith:['click', 'button'],
            queue: 'global',
            killer: true
        }).show();
    }
}
