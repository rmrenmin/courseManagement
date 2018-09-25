
$("#seacher").on("click", function () {
    $("#tab").css("display", "none");
    console.log(123)
    var c_class = $("#c_class").val()
    console.log(c_class)
    $.ajax({
        type: "post",
        url: "/admin/cour_seach",
        data: { c_class: c_class },
        dataType: "JSON",
        success: function (response) {
            console.log(response)
            if (response.r == "c_class_not_exit") {
                alert("不存在")
            }
            if (response.r == "ok") {
                $("#tab").css("display", "block");
                let td = `<td>${response.result[0].c_id}</td><td>${response.result[0].c_name}</td><td>${response.result[0].c_class}</td><td>${response.result[0].c_account}</td><td>${response.result[0].c_time}</td><td>${response.result[0].c_start}</td><td>${response.result[0].c_end}</td><td>${response.result[0].c_addr}</td><td>
                                            <a href="###" sid="${response.result[0].c_class}" class="delcour">删除</a>
                                        </td>`
                $(".tea_tr").html(td)
            }
        }
    });
})
    $('tbody').on('click', '.delcour', function () {
        //删除是危险操作
        if (!confirm('是否确定删除')) {
            return;
        }
        let _this = $(this);
        console.log(_this.attr('sid'));
        //发起ajax请求
        $.ajax({
            url: '/admin/delcour',
            type: 'GET',
            dataType: 'json',
            data: {
                sid: _this.attr('sid')
            },
            success: function (data) {
                console.log(data);
                if (data.result == 'ok') {
                    _this.parent().parent().remove();
                }

            }
        });
    })

