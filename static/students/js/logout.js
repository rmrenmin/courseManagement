const logout = $('#logout').on('click',(event)=>{
    event.preventDefault();
    $.ajax({
        url:'/logout',
        post:8081,
        type:'get',
        dataType:'json',
        success:(data)=>{
            msgSuccess(data.message);
            setTimeout(()=>{
                window.location.href = '/students/login.html';
            },2000)
        }
    })
})