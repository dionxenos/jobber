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
            .removeClass("is-invalid");
        },
    });

    $("#lol").validate({
        rules: {
          email: "required",
          password: "required"
        },
        messages: {
          email: `Please insert your email`,
          password: {
            required: `Please insert your password`
          }
        },
        success: function() {
          $('#lol').unbind('submit').submit((e) => {
            e.preventDefault();
            const email = $("#email").val();
            const password = $("#password").val();
            $.ajax({
              type: 'POST',
              url: '/users/login',
              data: {email: email, password: password},
              success: res => {
                if(!res) {
                  
                  $('.login-error').html(` <div class="alert alert-danger alert-dismissible fade show rounded-pill" role="alert">
                  Incorrect e-mail or password
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
                  </div>`);
                }
                else location.assign('/users/myprofile');
              }
            });
          });
        }
      });
    
      
    


});
