$(async () => {
    $(".loading").hide();
    const user = await $.ajax({url:'/users/myuser'});
    $('#username').text(' '+user.fullname);

    const pathname = window.location.pathname;
    const jobId = pathname.split('/').pop();
    const job = await $.ajax({url:`/jobs/getByJobId/${jobId}`});
    document.title = job.title;
    $(".job-title").text(job.title);
    showReqs(job.id);

    $(`.arrow`).click(() => {
        $('.fas').toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    });

    $('.reset').click(() => {
        $('.generateList').trigger('reset');
    })

    $('.generateList').submit(e => {
        e.preventDefault();
        if($('#skillWeight').val()==0 && $('#langWeight').val()==0 && $('#eduWeight').val()==0) {
            alert("Invalid factor input");
            $('.generateList').trigger('reset');
        }
        else {
            $.ajax({
                type: 'POST',
                url: `/jobs/recruit/${jobId}`,
                data: {jobId: jobId, skillW: $('#skillWeight').val(), langW: $('#langWeight').val(), eduW: $('#eduWeight').val()},
                beforeSend: function() {
                    $(".candList").empty();
                    $(".loading").show();
                },
                complete: function() {
                    $(".loading").hide();
                }
            })
            .then(res => {
                generateList(res, user.id);
            });
        }
    })
})

function showReqs(jobId) {
    getSkills(jobId);
    getLanguages(jobId);
    getEducation(jobId);
}

async function getSkills(jobId) {
    const s = await $.ajax({url: `/jobs/getSkills/${jobId}`});
    const skills = s.Skills;
    if(skills.length == 0) {
        $('.skills').hide();
        $('.skillF').children().prop('disabled',true);
    }
    skills.forEach(skill => {
        $(`#skills`).append(`
            <li class="list-inline-item"><span class="badge badge-info jobSkillBadge rounded-pill px-3">${skill.name}</span></li>
        `);
    });
}

async function getLanguages(jobId) {
    const langs = await $.ajax({url: `/jobs/getLanguages/${jobId}`});
    if(langs.length !== 0) {
        langs.forEach(lang => {
            $(`#languages`).append(`
                <li class=" d-flex">
                    <span class="pl-0 col-3 font-weight-bold"><i class="fas fa-arrow-alt-to-right"></i> ${lang.Name}</span>
                    <span class="col-3">Required Level: ${lang.LanguageLevelCode}</span>
                </li>
            `)
        });
    }
    else {
        $(`.langs`).hide();
        $('.langF').children().prop('disabled',true);
    }
    
}

async function getEducation(jobId) {
    const degrees = await $.ajax({url: `/jobs/getEducation/${jobId}`});
    if(degrees.length !==0) {
        degrees.forEach(degree => {
            $(`#education`).append(`
                <li class=" d-flex">
                    <span class="pl-0 col-6 font-weight-bold"><i class="fas fa-arrow-alt-to-right"></i> ${degree.Name}</span>
                    <span class="col-3">Required Level: ${degree.Level}</span>
                </li>
            `)
        })
    }
    else {
        $(`.edu`).hide();
        $('.eduF').children().prop('disabled',true);
    }
}

async function generateList(results, emploId) {
    $(".candList").append(`<thead class="thead-dark">
        <tr>
        <th scope="col">#</th>
        <th scope="col">User</th>
        <th scope="col">Skills (%)</th>
        <th scope="col">Languages (%)</th>
        <th scope="col">Education (%)</th>
        <th scope="col">Total (%)</th>
        </tr>
    </thead>
    <tbody>`);
    results.forEach(score => {
        $(".candList").append(`
        <tr>
            <th scope="row">${score.RowNum}</th>
            <td scope="col"><a href="#userModal${score.Id}" class="text-primary" data-toggle="modal" data-target="#userModal${score.Id}">${score.FullName}</a><span id="checked${score.Id}"></span></td>
            <td scope="col">${score.SkillScore}</td>
            <td scope="col">${score.LangScore}</td>
            <td scope="col">${score.EduScore}</td>
            <td scope="col"><span class="font-weight-bold">${score.TotalScore}</span></td>
        </tr>`);

        $(`a[href$="#userModal${score.Id}"]`).on( "click", async function() {

            elem = $(`<div class="modal fade" id="userModal${score.Id}" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Candidate Information</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body border-bottom">
                                    <h3 class="text-center"><i class="fad fa-user"></i> ${score.FullName}</h3>
                                    <h4 class="border-bottom">Skills </h4>
                                    <ul class="list-inline userSkills"></ul>
                                    <h4 class="border-bottom">Languages </h4>
                                    <ul class="list-unstyled userLangs"></ul>
                                    <h4 class="border-bottom">Education </h4>
                                    <ul class="list-unstyled userEdu"></ul>
                                </div>
                                <div class="bg-dark text-white">
                                    <h3 class="text-center mt-2">Contact</h3>
                                    <p class="text-center text-muted">Invite this user for an interview!</p>
                                    <div class="container col-md-8 col-sm-12 text-center">
                                        <form class="message-user">
                                            <div class="form-group">
                                                    <button type="submit" class="btn btn-block btn-outline-light rounded-pill"><i class="fal fa-user-plus"></i> Invite</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`);
            $(".user-modals").html(elem);
            const userInfo = await $.ajax(`/users/findById/${score.Id}`);
            $('.tel').text(`${userInfo.telephone}`);
            $('#recipient-name').val(`${userInfo.email}`);
            //CV FILL
            const skillInfo = await $.ajax(`/api/userskills/${score.Id}`);
            const langInfo = await $.ajax(`/api/userlanguages/${score.Id}`);
            const eduInfo = await $.ajax(`/api/usereducation/${score.Id}`);
            skillInfo.forEach(s => {
                $(".userSkills").append(`<li class="list-inline-item"><span class="badge badge-info jobSkillBadge rounded-pill px-3 mb-1">${s.name}</span></li>`)
            });
            langInfo.forEach(l => {
                $(".userLangs").append(`<li class=" d-flex">
                <span class="pl-0 col-3 font-weight-bold"><i class="fal fa-comments"></i> ${l.Language.name}</span>
                <span class="col-3">Level: ${l.LanguageLevelCode}</span>
            </li>`)
            });
            eduInfo.degrees.forEach(e => {
                $(".userEdu").append(`<li class=" d-flex">
                <span class="pl-0 col-6 font-weight-bold"><i class="fal fa-university"></i> ${e.fieldName}</span>
                <span class="col-6">Degree Level: ${e.level}</span>
            </li>`)
            });
            
            $(".message-user").submit(e => {
                e.preventDefault();
                $(`#userModal${score.Id}`).modal("hide");
                $.ajax({
                    type: "POST",
                    url: '/users/inv',
                    data: {from: emploId, to: score.Id}
                });
                $(`#checked${score.Id}`).html(`<i class="fas fa-comment-check text-success ml-1"></i>`)
                console.log("MESSAGE SENT");
            })
            
        });
    })
    $(".candList").append(`</tbody>
        </table>`);
}