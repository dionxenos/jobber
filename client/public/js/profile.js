$(document).ready(async () => {
    $(".dashboard-nav").addClass("active");
    $(".faHome").removeClass("fal").addClass("fas");
    const user = await $.ajax({url:'/users/myuser'});
    const invites = await $.ajax({url: `/users/candInvs/${user.id}`});
    const searchBox = $('#example-search-input2');

    loadCV(user.id);
    $('.faEdit').click((e) => {
        e.preventDefault();
        location.assign('/users/cv')
    })

    $('#username').text(' '+user.fullname);
    $('#h2').text(user.fullname);
    $('#mail').text(user.email);
    $('#tel').text(user.telephone);
    $('#date').text(user.createdOn.split('T')[0]);

    //INVITES
    $(`#toggle-invites`).click(() => {
        $(`i.notif-arrow`).toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    });
    if(invites.length == 0) {
        $('.invites').append(`
        <li class="list-group-item font-italic text-muted">No invitations yet...</li>
        `)
    }
    let invNum = 0;
    $('.invNum').val(invNum);
    invites.forEach(i => {
        if(!i.Has_Accepted) invNum++;
        const status = i.Has_Accepted ? `<span class="text-success"><i class="fal fa-check"></i> Accepted!</span>` : `<button class="btn btn-success rounded-pill" id="accept-${i.Id}"><i class="fal fa-check"></i> Accept</button> <button class="btn btn-danger rounded-pill" id="decline-${i.Id}"><i class="fal fa-times-circle"></i> Decline</button>`;
        $('.invites').append(`
            <li class="list-group-item d-flex justify-content-around">
                <a href="/users/user/${i.EmploId}" class="col-md-4 font-weight-bold">${i.FullName}</a>
                <span class="col-md-4"><i class="fal fa-envelope"></i> ${i.Email}</span>
                <span class="col-md-4"><span class="float-right status" id="invite-${i.Id}">${status}</span></span>
            </li>
        `);
        $(`#accept-${i.Id}`).click(() => {
            $.ajax({
                type: "PUT",
                url: `/users/accept`,
                data: {id: i.Id}
            });
            $(`#invite-${i.Id}.status`).empty().html(`<span class="text-success"><i class="fal fa-check"></i> Accepted!</span>`);
            $('.invNum').text(`${invNum-1}`);
        });
        $(`#decline-${i.Id}`).click(() => {
            $.ajax({url: `/users/decline/${i.Id}`});
            $(`#invite-${i.Id}`).empty().html(`<span class="text-danger"><i class="fal fa-times"></i> Declined...</span>`);
            $('.invNum').text(`${invNum-1}`);
        });
    });
    $('.invNum').text(`${invNum}`);
});

async function loadCV(userId) {
    const skills = await $.ajax({url: `/api/userskills/${userId}`});
    const langs = await $.ajax({url: `/api/userlanguages/${userId}`});
    const education = await $.ajax({url: `/api/usereducation/${userId}`});
    showSkills(skills);
    showLangs(langs);
    showEducation(education);

}

function showSkills(skills) {
    $('.cvSkills').append(`<li class="list-inline-item"><h3>Skills: </h3></li>`);
    if(skills.length == 0) {
        $('.cvSkills').append(`<li class="list-inline-item"><span class="font-italic text-muted">No skills added...</span></li>`)
    }
    else {
        skills.forEach(skill => {
            $('.cvSkills').append(`
                <li class="list-inline-item"><span class="badge badge-info rounded-pill userSkill">${skill.name}</span></li>
            `)
        });
    }
    $('.cvSkills').append(`<hr>`);
}

function showLangs(langs) {
    $('.cvLangs').append(`<li class=""><h3>Languages: </h3></li>`);
    if(langs.length == 0) {
        $('.cvLangs').append(`<li class=""><span class="font-italic text-muted">No languages added...</span></li>`);
    }
    else {
        langs.forEach(lang => {
            $('.cvLangs').append(`
                <li class="mb-2 d-flex">
                    <h5 class="col-md-4"><i class="far fa-comments"></i> ${lang.Language.name}</h5>
                    <p class="col-md-3 border-left">Level: <strong>${lang.LanguageLevelCode}</strong> </p>
                </li>
            `)
        });
    }
    $('.cvLangs').append(`<hr>`);
}

function showEducation(degrees) {
    $('.cvEdu').append(`<li class=""><h3>Education: </h3></li>`);
    if(degrees == 0) {
        $('.cvEdu').append(`<li class=""><span class="font-italic text-muted">No degrees added...</span></li>`);
    }
    else {
        degrees.degrees.forEach(degree => {
            $('.cvEdu').append(`
                <li class="mt-3 d-flex justify-content-md-between">
                    <h5 class="col-md-7 col-sm-12"><i class="fas fa-graduation-cap"></i> ${degree.fieldName}</h5>
                    <p class="col-md-3 col-sm-12 border-left">Degree: <strong>${degree.level}</strong> or equivalent</p>
                    <p class="col-md-2 col-sm-12 border-left"><strong>${degree.from}-${degree.to}</strong></p>
                </li>
            `)
        });
    }
}

