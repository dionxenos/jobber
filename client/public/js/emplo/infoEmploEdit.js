$(async () => {
    $(".profile-nav").addClass("active")
    $(".faProfile").removeClass("fal").addClass("fas");
    const user = await $.ajax({url:'/users/myuser'});
    $('#username').text(' '+user.fullname);

    $('#fullname').val(user.fullname);
    $('#email').val(user.email);
    $('#tel').val(user.telephone);
    
    // $("#save-changes").click(e => {
    //     updateUserInfo(user.id);
    // });

    $("#delete-acc").click(() => {
        deleteAcc(user.id);
    });

    $.validator.setDefaults({

        highlight: function(element) {
            $(element)
            .closest('.form-control')
            .addClass("is-invalid");
        },
        unhighlight: function(element) {
            $(element)
            .closest('.form-control')
            .removeClass("is-invalid");
        }
    });

    $(".user-info").validate({
        rules: {
            fullname: "required",
            email: {
                required: true,
                email: true
            },
            tel: {
                required: true,
                maxlength: 12,
                digits: true
            }
        },
        submitHandler: function(form,e) {
            e.preventDefault();
            alert("NICE")
            $.ajax({
                type: "PUT",
                url: "/users/myprofile/edit",
                data: {fullname: $('#fullname').val(), email: $('#email').val(), tel: $('#tel').val(), id: user.id},
                success: function() {
                    location.assign("/users/myprofile/edit");
                }
            })
        }
    })

    $(".change-password").validate({
        rules: {
            password1: {
                required: true,
                minlength: 8
            },
            password2: {
                required: true,
                minlength: 8,
                equalTo: "#password1"
            }
        },
        submitHandler: function(form,e) {
            alert("PASSWORD")
        }
    });
})

function updateUserInfo(userId) {
    $(".user-info").validate({
        rules: {
            fullname: "required",
            email: {
                required: true,
                email: true
            },
            tel: {
                required: true,
                maxlength: 12,
                digits: true
            }
        },
        submitHandler: function(form,e) {
            e.preventDefault();
            console.log("NICE")
            $.ajax({
                type: "PUT",
                url: "/users/myprofile/edit",
                data: {fullname: $('#fullname').val(), email: $('#email').val(), tel: $('#tel').val(), id: userId},
                success: function() {
                    location.assign("/users/myprofile/edit");
                }
            })
        }
    })
}

function deleteAcc(userId) {
    $.ajax({
        type: "DELETE",
        url: "/users/myprofile/delete",
        data: {id: userId},
    })
    .then(e => {
        location.assign("/signup");
    })
}