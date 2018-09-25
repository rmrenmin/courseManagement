
$(function (){

 $("#addtea").click(function () {
     var account = $("#t_account")
     var password = $("#t_password")
     var username = $("#t_name")
      let num=0; 
        $("input").each(function (n) { 
            if ($(this).val() == "") { 
                num++; 
                $(this).parent().children().last().attr("class","red_text")
             } else{
                $(this).parent().children().last().attr("diplay","red_text1")
            }; 
      })
      $("select").each(function (n) { 
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
        type: "post",
        url: "/admin/addtea",
        data: {username:username.val(),password:password.val(),account:account.val(),},
        dataType: "json",
        success: function (response) {
            console.log(response)
            if(response.r=="account_exit"){
                alert("账号已经存在");
            }
            if(response.r=="ok"){
                $(".red_text").attr("class","red_text1")
                 alert("添加成功");
            }
        }
    });
})
$("#tealist").click(function () {
    console.log(123)
     $.ajax({
        type: "get",
        url: "admin/tealist",
        data: "",
        dataType: "json",
        success: function (response) {  
            console.log(response)        
        } 
    });
})
$("#restea").click(function(){
    $("input").val("")
    $(".red_text").attr("class","red_text1")
})
})

