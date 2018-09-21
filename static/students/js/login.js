window.onload = function(){
    //更新验证码
    let img = document.querySelector('#coderimg');
    img.addEventListener('click', function () {
        this.src = '/coder?' + new Date();
    });
    //跳转注册
    $('#register').on('click',()=>{
        window.location.href = '/students/register.html';
    });
    //login
    $('#login').on('click', function(){
        $.ajax({
            url:'/login',
            type:'post',
            dataType:'json',
            data:$('.layui-form').serialize(),
            success:function(data){
                if(data.status === 'success'){
                    window.location.href = '/info';
                }else{
                    alert(data.message);
                }
            }
        })
      });
}