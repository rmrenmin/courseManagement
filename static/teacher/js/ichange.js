$(function(){
    $('#change').on('click',function(){
        if(!$('#newpasswd').val()){
            alert('请填写新密码');
            return;
        };

        if($('#oldpasswd').val()!=$('#oldpasswd2').val()){
            alert('原密码错误');
            return;
        };

        if($('#newpasswd').val()==$('#oldpasswd2').val()){
            alert('新密码不能与原密码相同');
            return;
        };

        $.ajax({
            url:'/teacher/login/ipasswd',
            type:'post',
            dataType:'json',
            data:{password:$('#newpasswd').val()},
            success:function(data){
                if(data.re=='ok'){
                    alert('密码修改成功');
                    window.location.href = '/teacher/login';
                }
            }
        })
    })










});