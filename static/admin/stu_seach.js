
$("#seacher").on("click", function () {
    $("#tab").css("display", "none");
    console.log(123)
    var s_account = $("#s_account").val()
    console.log(s_account)
    $.ajax({
        type: "post",
        url: "/admin/stu_seach",
        data: { s_account: s_account },
        dataType: "JSON",
        success: function (response) {
            console.log(response)
            if (response.r == "t_account_not_exit") {
                alert("该教师账号不存在")
            }
            if (response.r == "ok") {
                $("#tab").css("display", "block");
                let td = `<td>${response.result[0].s_id}</td><td>${response.result[0].s_name}</td><td>${response.result[0].s_account}</td><td>${response.result[0].s_class}</td><td>${response.result[0].s_times}</td>
                <td><a href="###"sid="${response.result[0].s_account}" class="delstu">删除</a></td>`
                $(".tea_tr").html(td)
            }
        }
    });
})
$('tbody').on('click', '.delstu', function () {
        //删除是危险操作
        if (!confirm('是否确定删除')) {
            return;
        }
        let _this = $(this);
        console.log(_this.attr('sid'));
        //发起ajax请求
        $.ajax({
            url: '/admin/delstu',
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

