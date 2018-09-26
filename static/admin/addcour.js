$("#addcourse").click(function () {
    let num = 0;

    $("input").each(function (n) {
        if ($(this).val() == "") {
            num++;
            $(this).next().attr("class", "red_text")
        } else {
            $(this).next().attr("diplay", "red_text1")
        };
    })
    $("select").each(function (n) {
        if ($(this).val() == "") {
            num++;
            $(this).parent().children().last().attr("class", "red_text")
        } else {
            $(this).parent().children().last().attr("diplay", "red_text1")
        };
    })
    if (num > 0) {
        return false;
    }
    console.log(123)
    $.ajax({
        type: "post",
        url: "/admin/course",
        data: $('#addcour').serialize(),
        dataType: "json",
        success: function (response) {
            console.log(response)
            if (response.r == "course_exit") {
                alert("该时间段已存在课程");
            }
            if (response.r == "ok") {
                $(".red_text").attr("class", "hid red_text")
                alert("添加成功");
            }
        }
    });
})
$("#rescourse").click(function () {
    $("input").val("")
    $(".red_text").attr("class", "red_text1")
})