var clas = $("#c_class");
var specialty = $("#c_specialty");
$("#addclass").click(function () {
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
        url: "/admin/class",
        data: { clas: clas.val(), specialty: specialty.val() },
        dataType: "json",
        success: function (response) {
            console.log(response)
            if (response.r == "class_exit") {
                alert("班级已经存在");
            }
            if (response.r == "ok") {
                  $(".red_text").attr("class","red_text1")
                alert("添加成功");
            }
        }
    });
})
$("#rescla").click(function(){
    clas.val("");
    specialty.val("")
      $(".red_text").attr("class","red_text1")
})