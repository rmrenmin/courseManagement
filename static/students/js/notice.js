$('#save').on('click', function (event) {
    let title = $('input[type="text"]').val();
    let content = $('textarea[name="desc"]').val();
    if (!title || !content) {
        msgError('标题或内容为空');
        return;
    }
    $.ajax({
        url: '/notice',
        type: 'post',
        dataType: 'json',
        data: {
            title: title,
            content: content
        },
        success: function (data) {
            if (data.status === 304) {
                msgError(data.message);
                setTimeout(() => {
                    window.location.href = data.url;
                }, 2000);
                return;
            }
            if (data.status === 'ok') {
                msgSuccess(data.message);
            } else {
                msgError(data.message);
            }
        }
    })
})

$('#rm').on('click', '#load', function (event) {
    let self = $(this);
    let num = self.attr('data-num');
    let sum = self.attr('data-sum');
    console.log(num, sum)
    $.ajax({
        url: '/load',
        type: 'post',
        dataType: 'json',
        data: {
            num: num,
            sum: sum
        },
        success: function (data) {
            if(data.status||data.status==='error'){
                msgError(data.message);
                return;
            }
            let html = '';
            for (let el of data.re) {
                let t = new Date(el.n_time);
                console.log(typeof t)
                let temp = `<li class="layui-timeline-item cursor" data-id="${el.n_id}">
            <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
            <div class="layui-timeline-content layui-text">
                <h3 class="layui-timeline-title">
                    ${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日${t.getHours()}时
                </h3>
                <p>
                    ${el.n_title}
                </p>
            </div>
        </li>`;
                html += temp;
            }
            let rm = $('#rm');
            $('.layui-timeline').append(html);
            rm.empty();
            rm.append(`<div class="layui-row" id="re">
            <div id="load" class="load layui-col-md4 layui-col-md-offset4" data-num = "${data.num}" data-sum="${sum}">单击加载更多</div>
    </div>`);
        }
    })
})

//notice内容获取
let content = $('#content');
$('.layui-timeline').on('click','.layui-timeline-item',function(){
    let self = $(this);
    $.ajax({
        url:'/content',
        type:'post',
        dataType:'html',
        data:{id:$(this).attr('data-id')},
        success:function(data){
            content.empty();
            content.append(data);
            $('.layui-timeline-item').find('p').removeClass('bg');
            $(self).find('p').addClass('bg');
        }
    })
})