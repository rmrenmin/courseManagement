
$(".content").css("height",$(window).height())
 let img = document.querySelector('#codeimg');
    img.addEventListener('click', function () {
        this.src = '/coder?' + new Date();
    });
$('#login').click(function () {
    let num=0;
    var passwd=$("#Password");
var username=$("#Username");
var coder=$("#coder");  
    $("input").each(function (n) { 
            if ($(this).val() == "") { 
                num++; 
                $(this).parent().children().last().attr("class","red_text")
             } else{
                $(this).parent().children().last().attr("diplay","red_text1")
            }; 
      })
            if (num > 0) { 
                return false;
             }
     $.ajax({
         type: "POST",
         url: "/admin/login",
         data: {coder:coder.val(),username:username.val(),password:passwd.val()},
         dataType: "json",
         success: function (response) {
             if(response.r=="coder_err"){
                
             }
             if (response.r=="u_not") {
                 alert("用户名不存在") 
             }
              if (response.r=="p_err") {
                 alert("密码错误") 
             }
             if (response.r=="ok") {
                 window.location.href="/admin/addtea"
             }
         }
     });
    })
    $("#res").click(function(){
    $("input").val();
    $(".red_text").attr("class"," red_text1")
})
   

  
