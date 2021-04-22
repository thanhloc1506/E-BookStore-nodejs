$('#xacnhan').click(function (e) {
    a = $('.each')
    let b = []
    a.each(function (index) {
        b.push($(this).children()[0].id.split(','))
    });
    data={
        phone: $('#sodienthoai').val(),
        diachi: $('#diachi').val(),
        phuongthucthanhtoan: $("input[name='account']:checked").val(),
        thongtin: b
    }
    $.ajax({
        url: "",
        type: 'post',
        data: {
            type: "checkout",
            data: JSON.stringify(data)
        },
        success: function (response) {
            console.log(response);
            window.location.href = '/users/homepage'
        },
        error: function (data) {
            console.log('error')
        }
    })
    
});