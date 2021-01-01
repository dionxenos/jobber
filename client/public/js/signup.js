$(document).ready( () => {

    $.validator.setDefaults({

        highlight: function(element) {
            $(element)
            .closest('.form-control')
            .addClass("is-invalid");
        },
        unhighlight: function(element) {
            $(element)
            .closest('.form-control')
            .removeClass("is-invalid")
            .addClass("is-valid");
        },
        errorPlacement: function(error, element) {
            if (element.prop('type') == 'radio') {
                error.insertAfter(element.parent().parent().parent());
            }
            else {
                error.insertAfter(element);
            }
        }
    });
    
    $('#signup').validate({
        rules: {
            fname: "required",
            lname: "required",
            tel: {
                required: true,
                maxlength: 12,
                digits: true
            },
            email: {
                required: true,
                email: true,
                remote: "/users/email_exists"
            },
            password: {
                required: true,
                minlength: 8
            },
            password2: {
                required: true,
                minlength: 8,
                equalTo: "#inputPassword"
            },
            role: "required"
        },
        messages: {
            fname: {
                required: 'First name is mandatory'
            },
            email: {
                remote: 'Email already exists'
            },
            role: {
                required: "Selecting a role is mandatory"
            }
        },
        submitHandler: function(form,e) {
            e.preventDefault();
            const email = $("#inputEmail").val();
            const password = $("#inputPassword").val();
            const name = $("#inputFname").val()+" "+$("#inputLname").val();
            const tel = $("#inputTel").val();
            const role = $("input[name=role]:checked", "#signup").val();
            $.ajax({
                type: 'POST',
                url: '/users/add',
                data: {email: email, password: password, tel: tel, role: role, name: name},
                success: res => {
                    console.log(res);
                    $.ajax({
                        type: 'POST',
                        url: '/users/login',
                        data: {email: email, password: password},
                        success: res => {
                        location.assign('users/myprofile');
                        }
                    });
                }
            })
        }
    })
});