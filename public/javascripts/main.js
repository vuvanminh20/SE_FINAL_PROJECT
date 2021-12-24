$(document).ready(()=> {
    console.log('connect')
    $('#btnLogin').click(()=> {
        $('#formLogin').validate({
            rules: {
                username: {
                    email: true,
                    required: true,
                },
                password: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                username: {
                    email: "Vui lòng địa chỉ email hợp lệ !",
                    required: "Vui lòng nhập địa chỉ email !"
                },
                password: {
                    required: "Vui nhập mật khẩu !",
                    minlength: "Mật khẩu chứa ít nhất 6 kí tự !"
                }
            }
        });
    });
});