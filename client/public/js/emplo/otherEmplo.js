$(document).ready(async () => {
    const user = await $.ajax({url:'/users/myuser'});
    const pathname = window.location.pathname;
    const thisUserId = pathname.split('/').pop();
    const thisUser = await $.ajax({url:`/users/findById/${thisUserId}`});
    document.title = thisUser.fullname;

    const jobs = await $.ajax({url: `/jobs/getByUserId/${thisUser.id}`});
    jobs.forEach(job => {
        const elem = $(`<li class="card mb-3">
            <button class="card-header btn btn-block btn-job-header" type="button" data-toggle="collapse" data-target="#reqs${job.id}" aria-expanded="false" aria-controls="collapseExample" id="btn${job.id}">
                <h5><i class="fal fa-business-time"></i> ${job.title} <i class="fas fa-angle-down float-right my-1 arrow${job.id}"></i></h5>
            </button>
            <div class="card-body collapse p-3" id="reqs${job.id}">
                <h4 class="skills${job.id}">Skills </h4>
                <ul class="list-inline pb-2 ul-skills" id="skills${job.id}"></ul>
                <h4 class="langs${job.id} border-top">Languages</h4>
                <ul class="list pl-0 pb-2 ul-langs" id="languages${job.id}"></ul>
                <h4 class="edu${job.id} border-top">Education</h4>
                <ul class="list pl-0 pb-2 ul-edu" id="education${job.id}"></ul>
            </div>
            </li>`);
        $('.jobs').append(elem);
        showReqs(job.id);

        $(`#btn${job.id}`).click(() => {
            $(`i.arrow${job.id}`).toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        })
    });
    $('#username').text(' '+user.fullname);
    $('#h2').text(thisUser.fullname);
    $('#mail').text(thisUser.email);
    $('#tel').text(thisUser.telephone);
    $('#date').text(thisUser.createdOn.split('T')[0]);
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