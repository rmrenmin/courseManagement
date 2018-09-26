window.onload = function () {
    //更新验证码
    let img = document.querySelector('#coderimg');
    img.addEventListener('click', function () {
        this.src = '/coder?' + new Date();
    });
    //跳转注册
    $('#register').on('click', () => {
        window.location.href = '/students/register.html';
    });
    //login
    $('#login').on('click', function () {
        let formdata = $('.layui-form').serializeArray();
        if(formdata[0].value===''||formdata[1].value===''||formdata[2].value===''){return;}
        $.ajax({
            url: '/login',
            type: 'post',
            dataType: 'json',
            data: $('.layui-form').serialize(),
            success: function (data) {
                if (data.status === 'ok') {
                    msgSuccess(data.message);
                    setTimeout(() => {
                        window.location.href = '/info';
                    }, 2500);
                } else {
                    img.click();
                    msgError(data.message);
                }
            }
        })
    });

    $('#teacher').on('click',()=>{
        window.location.href = '/teacher';
    })
}