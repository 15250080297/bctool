/**
 * Created by wzq on 2017/6/12.
 */
_checkisNotEmpty =function (checkVal) {
    if(!checkVal||checkVal.length==0)
        return false;
    return true;
}

_checkisNumber=function (checkVal,isCanEmpty=false) {
    var  reg
     if(isCanEmpty)
        reg = /^[-0-9]*$/;
    else
        reg = /^[-0-9]+$/;
    return reg.test(checkVal);
}

_checkCorrectUserName = function (checkVal) {
  //TODO 检查用户名正确性
  // var  reg ;
  // return reg.test(checkVal);
  return true;
}

_showSuccessMsg=function (msg) {
    this.$message(msg);
}





