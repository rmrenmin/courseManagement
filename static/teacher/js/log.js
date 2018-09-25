$(function(){
        //重置按钮
        $('.re-btn').click(function(){
            $('.account').val('');
            $('.passwd').val('');
            $('input[name="coder"]').val('');
        });

        //验证码点击刷新
        $('#codeimg').click(function(){
            $(this).attr('src','/coder?'+new Date());
        });


        let form = layui.form;
        //登陆按钮
        form.on('submit(login)',function(data){
            $.ajax({
                url:'/teacher',
                type:'POST',
                dataType:'JSON',
                data:$('#login_form').serialize(),
                success: function(re){
                    console.log(re);
                    if(re.re=='coder_error'){
                        alert('验证码错误');
                        return false;
                    };
                    if(re.re=='name_not'){
                        alert('账号不存在');
                        return false;
                    };
                    if(re.re=='password_error'){
                        alert('密码错误');
                        return false;
                    };
                    if(re.re=='ok'){ 
                        window.location.href = '/teacher/login';
                    }
                }
            });
        });
    
    });