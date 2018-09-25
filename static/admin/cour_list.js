$(function () {
    //应该用事件代理  删除学生信息
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
})