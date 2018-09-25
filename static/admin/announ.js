$("#addannoun").click(function () {
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
        url: "/admin/announ",
        data:$("#addann").serialize(),
        dataType: "json",
        success: function (response) {
            console.log(response)
            if (response.r == "ok") {
                 $(".red_text").attr("class","red_text1")
                alert("添加成功");
            }
        }
    });
})
$("#resannoun").click(function(){
     $("input").val("")
     $("#n_content").val("")
      $(".red_text").attr("class","red_text1")
})