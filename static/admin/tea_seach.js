
$("#seacher").on("click", function () {
 $("#tab").css("display", "none");
    console.log(123)
    var t_account = $("#t_account").val()
    // console.log(t_account)
    $.ajax({
        type: "post",
        url: "/admin/tea_seach",
        data: { t_account: t_account },
        dataType: "JSON",
        success: function (response) {
            console.log(response)
            if (response.r == "t_account_not_exit") {
                alert("该教师账号不存在")
            }
            if (response.r == "ok") {
                $("#tab").css("display", "block");
                let td=`<td>${response.result[0].t_id}</td><td>${response.result[0].t_account}</td><td>${response.result[0].t_name}</td><td>${response.result[0].t_times}</td> <td>
                                            <a href="###" sid="${response.result[0].t_account}" class="deltea">删除</a>
                                        </td>`
                $(".tea_tr").html(td)
            }
        }
    });
})
$('tbody').on('click', '.deltea', function () {
        //删除是危险操作
        if (!confirm('是否确定删除')) {
            return;
        }
        let _this = $(this);
        console.log(_this.attr('sid'));
        //发起ajax请求
        $.ajax({
            url: '/admin/deltea',
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
