$(async () => {
    $(".profile-nav").addClass("active")
    $(".faProfile").removeClass("fal").addClass("fas");
    const user = await $.ajax({url:'/users/myuser'});
    $('#username').text(' '+user.fullname);

    $('#fullname').val(user.fullname);
    $('#email').val(user.email);
    $('#tel').val(user.telephone);
    
    $("#save-changes").click(e => {
        e.preventDefault();
        updateUserInfo(user.id);
    });

    $("#delete-acc").click(() => {
        deleteAcc(user.id);
    })
})

function updateUserInfo(userId) {
    $.ajax({
        type: "PUT",
        url: "/users/myprofile/edit",
        data: {fullname: $('#fullname').val(), email: $('#email').val(), tel: $('#tel').val(), id: userId},
        success: function() {
            location.assign("/users/myprofile/edit");
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