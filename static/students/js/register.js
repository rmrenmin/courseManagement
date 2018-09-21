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
    btn.addEventListener('click', function () {
        let account = document.querySelector('input[name=account]');
        let password = document.querySelector('input[name=password]');
        let name = document.querySelector('input[name=name]');
        let class1 = document.querySelector('select[name=class]');
        let sex = document.querySelectorAll('input[name=sex]');
        let coder = document.querySelector('input[name=coder]');
        let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('post', '/register');
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(`account=${account.value}&password=${password.value}&name=${name.value}&class=${class1.value}&sex=${sex[0].checked ? sex[0].value : sex[1].value}&coder=${coder.value}`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let re = JSON.parse(xhr.responseText);
                if (re.status === 'error') {
                    alert(re.message);
                }else{
                    window.location.href = '/students/login.html';
                }
            }
            img.click();
        }
        return false;
    });
    //更新验证码
    let img = document.querySelector('#coderimg');
    img.addEventListener('click', function () {
        this.src = '/coder?' + new Date();
    });

}