$("#addstu").click(function () {
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
        url: "/admin/addstu",
        data:$('#add_stu').serialize(),
        dataType: "json",
        success: function (response) {
            console.log(response)
            if(response.r=="stu_exit"){
                alert("学号已存在");
            }
            if(response.r=="ok"){
                 $(".red_text").attr("class","red_text1")
                 alert("添加成功");
            }
        }
    });
})
$("#resstu").click(function(){
   $("input").val("")
   $(".danyuan").attr("checked","true")
    $(".red_text").attr("class","red_text1")
})