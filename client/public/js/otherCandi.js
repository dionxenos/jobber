$(async () => {
    const user = await $.ajax({url:'/users/myuser'});
    const pathname = window.location.pathname;
    const thisUserId = pathname.split('/').pop();
    const thisUser = await $.ajax({url:`/users/findById/${thisUserId}`});
    document.title = thisUser.fullname;

    loadCV(thisUser.id);

    $('#username').text(' '+user.fullname);
    $('#h2').text(thisUser.fullname);
    $('#mail').text(thisUser.email);
    $('#tel').text(thisUser.telephone);
    $('#date').text(thisUser.createdOn.split('T')[0]);

    
});

async function loadCV(userId) {
    const skills = await $.ajax({url: `/api/userskills/${userId}`});
    const langs = await $.ajax({url: `/api/userlanguages/${userId}`});
    const education = await $.ajax({url: `/api/usereducation/${userId}`});
    
    if(skills.length !== 0 ) {
        showSkills(skills);
    }
    if(langs.length !== 0) {
        showLangs(langs);
    }
    if(education.degrees.length !== 0) {
        showEducation(education.degrees);
    }
}

function showSkills(skills) {
    $('.cvSkills').append(`<li class="list-inline-item"><h3>Skills: </h3></li>`);
    skills.forEach(skill => {
        $('.cvSkills').append(`
            <li class="list-inline-item"><span class="badge badge-info rounded-pill userSkill">${skill.name}</span></li>
        `)
    });
    $('.cvSkills').append(`<hr>`);
}

function showLangs(langs) {
    $('.cvLangs').append(`<li class=""><h3>Languages: </h3></li>`);
    langs.forEach(lang => {
        $('.cvLangs').append(`
            <li class="mb-2 d-flex">
                <h5 class="col-md-4"><i class="far fa-dot-circle"></i> ${lang.Language.name}</h5>
                <p class="col-md-3 border-left">Level: <strong>${lang.LanguageLevelCode}</strong> </p>
            </li>
        `)
    });
    $('.cvLangs').append(`<hr>`);
}

function showEducation(degrees) {
    $('.cvEdu').append(`<li class=""><h3>Education: </h3></li>`);
    degrees.forEach(degree => {
        $('.cvEdu').append(`
            <li class="mt-3 d-flex justify-content-md-between">
                <h5 class="col-md-7 col-sm-12"><i class="fas fa-graduation-cap"></i> ${degree.fieldName}</h5>
                <p class="col-md-3 col-sm-12 border-left">Degree: <strong>${degree.level}</strong> or equivalent</p>
                <p class="col-md-2 col-sm-12 border-left"><strong>${degree.from}-${degree.to}</strong></p>
            </li>
        `)
    });
}