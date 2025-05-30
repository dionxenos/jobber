$(async () => {
    $(".profile-nav").addClass("active")
    $(".faProfile").removeClass("fal").addClass("fas");
    const user = await $.ajax({url:'/users/myuser'});
    $('#username').text(' '+user.fullname);

    $('#fullname').val(user.fullname);
    $('#email').val(user.email);
    $('#tel').val(user.telephone);
    
    
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
                e.preventDefault()
                $.ajax({
                    type: "PUT",
                    url: "/users/myprofile/edit",
                    data: {fullname: $('#fullname').val(), email: $('#email').val(), tel: $('#tel').val(), id: user.id}
                }).then(e => {
                    $('#username').text(' '+e[1].fullname);
                    $('.updated').html(`<div class="alert alert-success alert-dismissible fade show info-success " role="alert">
                    User information updated successfully!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>`);
                })
            }
        })

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
            .removeClass("is-invalid")
            .addClass("is-valid");
        }
    });

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
            $('.updated-password').html(`<div class="alert alert-success alert-dismissible fade show info-success " role="alert">
            Password updated successfully!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`)
        }
    });
})

function updateUserInfo(userId) {
    
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