window.onload = function () {
    //图片上传
    let imginput = document.querySelector('#myimg');
    imginput.onchange = function () {
        let _this = this;
        // 使用ajax发送图片到服务器
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/uploads');
        //创建一个表单数据对象
        let formdata = new FormData();  
        for (const top of _this.files) {
            formdata.append("images", top);
        }
        //不用设置请求头
        xhr.send(formdata);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let data = JSON.parse(xhr.responseText);
                console.log(data.data);
                let str = '';
                for (const top of data.data) {
                    str += `<li><img src="${top}"></li>`;
                }
                document.querySelector('#toppic').value = JSON.stringify(data);
                document.querySelector('.toppic ul').innerHTML = str;
            }
        }
    }
}