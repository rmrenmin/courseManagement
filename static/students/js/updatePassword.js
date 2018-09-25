//弹出密码修改页面
$('#update').on('click', (event) => {
    layui.layer.open({
        type: 1,
        title: false,
        content: $('#pw'),
        skin: 'define-content-success',
        anim: 3,
        end: function () {
            $('#pw').css('display', 'none');
            $('#pw input').val(function(){
                return '';
            });
        },
        success:function(){
            img.click();
        }
    })
});

//更新验证码
let img = document.querySelector('#coderimg');
img.addEventListener('click', function () {
    this.src = '/coder?' + new Date();
});

//确认修改密码
$('#updatepasswd').on('click', (event) => {
    let data = $('#pw .layui-form').serializeArray();
    if (data[0].value === '' || data[1].value === '' || data[2].value === '') {
        return
    }
    $.ajax({
        url: '/updatepassword',
        type: 'post',
        dataType: 'json',
        data: $('#pw .layui-form').serialize(),
        success: function (data) {
            msgSuccess(data.message);
            if (data.status === 304) {
                setTimeout(() => {
                    window.location.href = data.url;
                }, 2000);
                return;
            }
            //刷新验证码
            if (data.status === 'error') {
                img.click();
            }
            //关闭所有弹出层
            if (data.status === 'ok') {
                setTimeout(() => {
                    layui.layer.closeAll();
                }, 2000);
            }

        }
    })
})

//取消修改密码
$('#cancel').on('click', (event) => {
    layui.layer.closeAll();
})