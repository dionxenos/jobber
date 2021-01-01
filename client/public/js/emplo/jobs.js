$(async () => {
    $(".jobs-nav").addClass("active");
    $(".faJobs").removeClass("fal").addClass("fas");
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
    const user = await $.ajax({url:'/users/myuser'});
    const jobs = await $.ajax({url: `/jobs/getByUserId/${user.id}`});
    $('#username').text(' '+user.fullname);

    showJobs(jobs);

    $('.addJob').on('input', () => {
        if($('.addJob').val() !== '') {
            $('.addBtn').removeClass("d-none");
        }
        else $('.addBtn').addClass("d-none");
    });

    $('.jobSubmit').submit( e => {
        e.preventDefault();
        addJob(user.id);
    });
});

function addJob(userid) {
    if($('.addJob').val() !== "") {
        const title = $('.addJob').val();
        $.ajax({
            type: 'POST',
            url: '/jobs/add',
            data: {
                userId: userid,
                title: title
            },
            success: function() {
                $('.alerts').html(`
                <div class="alert alert-success alert-dismissible fade show mt-2" role="alert">
                    New job successfully added!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>`)
            }
        })
        .then(job => {
            $('.addJob').val("");
            $('.addBtn').addClass("d-none");
            showJob(job);
        })
    }
    else {
        $('.alerts').html(`
                <div class="alert alert-danger alert-dismissible fade show mt-2" role="alert">
                    Job title is invalid!
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>`)
    }
}

function showJobs(jobs) {
    // if(jobs.length == 0) {
    //     $('#jobList').html(`<p class="text-muted">No active jobs yet</p>`)
    // }
    // else {
    jobs.forEach(job => {
        showJob(job);
    });
    // }
}

function showJob(job) {
    const d = Math.round((new Date()-new Date(job.createdOn))/(1000*60*60*24))
    const elem = $(`
        <li class="list-group-item text-left d-flex justify-content-around">
            <div class="col-sm-7">
                <i class="fal fa-business-time fa-lg"></i> <span class="font-weight-bold">${job.title}</span>
            </div>
            <div class="col-sm-2">
                <span class="faEdit col-1 border-right" data-toggle="tooltip" data-placement="bottom" title="Edit requirements" id="edit${job.id}"><i class="fad fa-pencil"></i></span>
                <span class="faClickable col-1" id="delete${job.id}"><i class="far fa-trash-alt"></i></span>
            </div>
            <span class="col-sm-3 text-muted text-right">Added ${d} days ago</span>
        </li>
    `)
    $('.jobList').append(elem);
    elem.data('id', job.id);

    $(`#delete${job.id}`).click(() => {
        removeJob(elem);
    });

    $(`#edit${job.id}`).click(() => {
        location.assign(`/jobs/edit/${job.id}`);
    })
}

function removeJob(elem) {
    $.ajax({
        type:'DELETE',
        url:'/jobs/'+elem.data('id')
    });
    elem.remove();
}