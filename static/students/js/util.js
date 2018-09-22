//因为body设置了背景色body的color变为白色，layer会继承color，导致content不能显示，所以需要自定义skin
//加载skin配置
layer.config({
    extend: 'skin/myskin/style.css', //加载您的扩展样式
    skin: 'define-content-success'
});
layer.config({
    extend: 'skin/myskin/style.css', //加载您的扩展样式
    skin: 'define-content-error'
});
var msgError = function(message){
    message =  message || 'message不存在！';
    layui.layer.open({
        type: 1,
        title: false,
        content: message,
        time:2000,
        icon:1,
        area:['150px','50px'],
        anim:3,
        skin: 'define-content-error',
    });
}
var msgSuccess = function(message){
    message =  message || 'message不存在！';
    layui.layer.open({
        type: 1,
        title: false,
        content: message,
        time:2000,
        icon:1,
        area:['150px','50px'],
        anim:3,
        skin: 'define-content-success',
    });
}