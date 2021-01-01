$(document).ready(async () => {
    $(".dashboard-nav").addClass("active");
    $(".faHome").removeClass("fal").addClass("fas");
    const user = await $.ajax({url:'/users/myuser'});
    const invites = await $.ajax({url: `/users/emploInvs/${user.id}`});
    const searchBox = $('#example-search-input2');

    const jobs = await $.ajax({url: `/jobs/getByUserId/${user.id}`});
    if(jobs.length == 0) {
        $('.jobs').append(`<li><p class="font-italic text-muted text-center">No jobs added yet. <a href="/users/e/jobs" class="text-info font-weight-bold">Start creating and recruiting!</a></p></li>`);
    }
    jobs.forEach(job => {
        const elem = $(`<li class="card mb-3">
            <button class="card-header btn btn-block btn-job-header" type="button" data-toggle="collapse" data-target="#reqs${job.id}" aria-expanded="false" aria-controls="collapseExample" id="btn${job.id}">
                <h5><i class="fal fa-business-time"></i> ${job.title} <i class="fas fa-angle-down float-right my-1 arrow${job.id}"></i></h5>
            </button>
            <div class="collapse" id="reqs${job.id}">
                <div class="card-body p-3">
                    <h4 class="skills${job.id}">Skills </h4>
                    <ul class="list-inline pb-2 ul-skills" id="skills${job.id}"></ul>
                    <h4 class="langs${job.id} border-top">Languages</h4>
                    <ul class="list pl-0 pb-2 ul-langs" id="languages${job.id}"></ul>
                    <h4 class="edu${job.id} border-top">Education</h4>
                    <ul class="list pl-0 pb-2 ul-edu" id="education${job.id}"></ul>
                    <div class="border-top py-2">
                        <button class="btn btn-primary px-4 rounded-pill" onClick=recruit(${job.id}) id=recruit-${job.id}><i class="fal fa-user-plus"></i> Recruit</button>
                        <button class="btn btn-info px-4 rounded-pill" onClick="editJob(${job.id})"><i class="fal fa-pencil"></i> Edit</button>
                    </div>
                </div>
            </div>
            </li>`);
        $('.jobs').append(elem);
        showReqs(job.id);

        $(`#btn${job.id}`).click(() => {
            $(`i.arrow${job.id}`).toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        });
    });
    document.title = user.fullname;
    $('#username').text(' '+user.fullname);
    $('#h2').text(user.fullname);
    $('#mail').text(user.email);
    $('#tel').text(user.telephone);
    $('#date').text(user.createdOn.split('T')[0]);

    // Invites
    $(`#toggle-invites`).click(() => {
        $(`i.notif-arrow`).toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    });
    if(invites.length == 0) {
        $('.invites').append(`<li class="list-group-item d-flex justify-content-around"><span class="font-italic text-muted">You have not invited any candidates for an interview.</li>`)
    }
    invites.forEach(i => {
        console.log(i)
        const status = i.Has_Accepted ? `<span class="text-success">Accepted!</span>` : `<span class="text-secondary">Pending...</span>`;
        $('.invites').append(`
            <li class="list-group-item d-flex justify-content-around">
                <a href="/users/user/${i.CandId}" class="col-md-4 font-weight-bold">${i.FullName}</a>
                <span class="col-md-4"><i class="fal fa-envelope"></i> ${i.Email}</span>
                <span class="col-md-4 font-weight-bold"><span class="float-right">${status}</span></span>
            </li>
        `)
    })
});

async function showReqs(jobId) {
    const s = await getSkills(jobId);
    const l = await getLanguages(jobId);
    const e = await getEducation(jobId);
    if(s.length ==0 && l.length==0 && e.length ==0) {
        $(`#recruit-${jobId}`).prop("disabled", true);
    }
}

async function getSkills(jobId) {
    const s = await $.ajax({url: `/jobs/getSkills/${jobId}`});
    const skills = s.Skills;
    if(skills.length !== 0) {
        skills.forEach(skill => {
            $(`#skills${jobId}`).append(`
                <li class="list-inline-item"><span class="badge badge-info jobSkillBadge rounded-pill px-3">${skill.name}</span></li>
            `);
        });
    }
    else $(`#skills${jobId}`).append(`
        <li class=""><span class="font-italic text-muted">No skill requirements added.</span></li>
    `)
    return skills;
}

async function getLanguages(jobId) {
    const langs = await $.ajax({url: `/jobs/getLanguages/${jobId}`});
    if(langs.length !== 0) {
        langs.forEach(lang => {
            $(`#languages${jobId}`).append(`
                <li class=" d-flex">
                    <span class="pl-0 col-3 font-weight-bold"><i class="fas fa-arrow-alt-to-right"></i> ${lang.Name}</span>
                    <span class="col-3">Required Level: ${lang.LanguageLevelCode}</span>
                </li>
            `)
        });
    }
    else $(`#languages${jobId}`).append(`
        <li class=""><span class="font-italic text-muted">No language requirements added.</span></li>
    `)
    return langs;
}

async function getEducation(jobId) {
    const degrees = await $.ajax({url: `/jobs/getEducation/${jobId}`});
    if(degrees.length !==0) {
        degrees.forEach(degree => {
            $(`#education${jobId}`).append(`
                <li class=" d-flex">
                    <span class="pl-0 col-6 font-weight-bold"><i class="fas fa-arrow-alt-to-right"></i> ${degree.Name}</span>
                    <span class="col-3">Required Level: ${degree.Level}</span>
                </li>
            `)
        })
    }
    else $(`#education${jobId}`).append(`
        <li class=""><span class="font-italic text-muted">No education requirements added.</span></li>
    `)
    return degrees;
}

function editJob(jobId) {
    location.assign(`/jobs/edit/${jobId}`);
}

function recruit(jobId) {
    location.assign(`/jobs/recruit/${jobId}`);
}