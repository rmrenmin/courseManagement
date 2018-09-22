window.onload = function () {
    let data = {};
    let spe = document.querySelector('#specialty');
    let cl = document.querySelector('#class');
    let btn = document.querySelector('#btn');
    let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', '/register');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let temp = JSON.parse(xhr.responseText);
            //将同一专业的班级归并到一个数组中
            for (let obj of temp) {
                if (obj.c_specialty in data) {
                    data[obj.c_specialty].push(obj.c_class);
                } else {
                    data[obj.c_specialty] = [obj.c_class];
                }
            }
            // console.log(data)
            //初始化specialty
            for (let obj in data) {
                let child = document.createElement('option');
                child.setAttribute('value', obj);
                child.innerText = obj;
                spe.appendChild(child);
                layui.form.render();
            }
            //初始化class
            for (let obj in data) {
                for (let e of data[obj]) {
                    let child = document.createElement('option');
                    child.setAttribute('value', e);
                    child.innerText = e;
                    cl.appendChild(child);
                    layui.form.render();
                }
                break;
            }
        }
    }
    //根据专业更新班级
    layui.form.on('select(specialty)', function (val) {
        cl.innerHTML = '';
        for (let e of data[val.value]) {
            let child = document.createElement('option');
            child.setAttribute('value', e);
            child.innerText = e;
            cl.appendChild(child);
            layui.form.render()
        }

    })
    //更新验证码
    let img = document.querySelector('#coderimg');
    img.addEventListener('click', function () {
        this.src = '/coder?' + new Date();
    });
    //操作进度条
    let pro = $('.layui-progress');
    $('input').on('blur', function () {
        let el = $(this);
        if (el.val()) {
            pro.data(el.attr('name'), el.val());
        } else {
            pro.removeData(el.attr('name'));
        }
        layui.element.progress('progress', Math.round((Object.keys(pro.data()).length / 7 + 3 / 7) * 100).toString() + '%');
    });
    //登录跳转
    $('#login').click(() => {
        window.location.href = '/students/login.html';
    })
    //注册提交
    $('#btn').click(() => {
        //不等于4表示还有未填项
        if (Object.keys(pro.data()).length === 4) {
            $.ajax({
                url: '/register',
                type: 'post',
                dataType: 'json',
                data: $('.layui-form').serialize(),
                success: function (data) {
                    if (data.status === 'ok') {
                        msgSuccess(data.message);
                        setTimeout(()=>{
                            window.location.href = '/students/login.html';
                        },2500);
                    } else {
                        img.click();
                        msgError(data.message);
                    }
                }
            })
        }
    });
    
}