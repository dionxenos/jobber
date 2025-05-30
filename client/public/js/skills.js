export async function getSkills(user) {

    loadUserSkills(user.id);
    
    $(document).on('listChanged', (e) => {
        getRecommendedSkillList(user.id);
    });

    $('.searchSkill').focusin(() => {
        $('#skillContainer').show();
        $('.searchSkill').toggleClass("rounded-pill")
    });

    $('.searchSkill').focusout(() => {
        window.setTimeout(function() { 
            $('#skillContainer').hide();
            $('.searchSkill').toggleClass("rounded-pill")
        }, 100);
    });
    
}

async function loadUserSkills(id) {
    const skills = await $.ajax('/api/userskills/'+id);
    const filteredSkills = await loadAllSkills(skills, id);
    showSkills(skills, id);

    $('.searchSkill').on('input', e => {
        $('#skillList').empty();
        $('#skillContainer').show();
        const inputText = $('.searchSkill').val();
        toggleSubmitBtn(filteredSkills.map(i => {return i.name}), inputText);
        if(inputText !== "") searchSkill(inputText, filteredSkills, id);
    });

    $('.addskill').on('submit', async (e) => {
        e.preventDefault();
        addSkill(id);
    });
}

function toggleSubmitBtn(filteredSkills, op) {
    if(op !="" && !filteredSkills.indexOf(op)) {                 
        $('#skillSubmitBtn').prop('disabled',false);
    } else {
        $('#skillSubmitBtn').prop('disabled', true);
    }   
}

async function loadAllSkills(currSkills, userid) {
    const skills = await $.ajax({url:'/skills'});
    let fCurrentSkills = currSkills.map(i => {return i.id});
    let filteredSkills = skills.filter(i => !fCurrentSkills.includes(i.id));   
    $(document).trigger('listChanged');

    $('.searchSkill').on('input', e => {
        $('#skillList').empty();
        $('#skillContainer').show();
        const inputText = $('.searchSkill').val();
        toggleSubmitBtn(filteredSkills.map(i => {return i.name}), inputText);
        if(inputText !== "") searchSkill(inputText, filteredSkills, userid);
    });

    return filteredSkills; 
}

function showSkills(skills, id) {
    if(skills.length == 0) {$('#skills').append(`<li class="list-inline-item noSkills"><p class="text-muted">No skills added yet on your CV...</p></li>`);}
    else {
        skills.forEach(skill => {
            showSkill(skill, id);
        });
    }
};

function showSkill(skill, userid) {
    let elem = $(`<li class="list-inline-item"><p class="badge badge-info userSkill rounded-pill"> ${skill.name} <span class="faClickable" id="${skill.id}"><i class="far fa-trash-alt ml-2"></i></span> </p> </li>`);
    $('#skills').append(elem).hide().fadeIn('fast');
    elem.data('id', skill.id);

    $('#skills').on('click', `#${skill.id}`, () => {
        removeSkill(elem, userid);
    });
};

function removeSkill(elem, userid) {
    $.ajax({
        type:'DELETE',
        url:'/api/userskills/'+userid+'/delete/'+elem.data('id')
    });
    elem.remove();
    resetSkillSelectList(userid);
};

async function addSkill(userid) {
    const inputId = $('.searchSkill').attr('id');
    const inputSkill = await $.ajax(`/skills/${inputId}`);
    $.ajax({
        type: 'POST',
        url: `/api/userskills/add`,
        data: {userid: userid, skillid: inputId}
    });
    showSkill(inputSkill, userid);
    // $('#inputGroupSelect04').prop('selectedIndex',0);
    // $('#skillSubmitBtn').prop('disabled', true);
    resetSkillSelectList(userid);
    $('.noSkills').remove();
};

async function resetSkillSelectList(userid) {
    $('.searchSkill').val("");
    $('.searchSkill').attr('id',"searchBox");
    $('#skillList').empty();
    const newSkills = await $.ajax('/api/userskills/'+userid);
    loadAllSkills(newSkills, userid);
}

async function getRecommendedSkillList(id) {
    const recommendedSkills = await $.ajax('/api/userskills/recommendedskills/'+id);
    if(recommendedSkills.length !== 0) {
        $('.recommendations').show();
        let elem = [];
        $('#recSkills').empty();
        for(let i=0; i<5; i++) {
            elem.push($(`<li class="list-inline-item">
                <span class="badge badge-info rounded-pill skillBadge mr-2" id=${recommendedSkills[i].Id}>
                    ${recommendedSkills[i].Name}
                    <i class="fal fa-plus-circle fa-lg float-right ml-3"></i>
                </span>
                </li>`));
            elem[i].appendTo('#recSkills').hide();
            elem[i].fadeIn(1000);
            $(`#${recommendedSkills[i].Id}`).click( () => {
                $.ajax({
                    type: 'POST',
                    url: `/api/userskills/add`,
                    data: {userid: id, skillid: recommendedSkills[i].Id}
                })
                .then(e => {
                    $.ajax(`/skills/${recommendedSkills[i].Id}`)
                    .then(inputSkill => {
                        showSkill(inputSkill, id);
                        resetSkillSelectList(id);
                    });
                });
            });
        }
    }
    else {
        console.log("no recommended skills");
        $('.recommendations').hide();
        $('.userSkills').addClass('mx-auto');
    }
    
}

// Skill Searching ----------------------------------------------
async function searchSkill(inputSkill, skills, userId) {
    const r = new RegExp(`${inputSkill}`, 'gi');
    let suggestions = skills.filter(u => {
        return u.name.startsWith(inputSkill);
    });
    let suggestions2 = skills.filter(u => {
        return u.name.includes(inputSkill) && !u.name.startsWith(inputSkill);
    });
    let s = suggestions.concat(suggestions2);
    s = s.slice(0,7);
    showSuggestions(s, userId);
}

function showSuggestions(suggestions, userId) {
    suggestions.forEach(skill => {
            const elem = $(`<li class="list-group-item py-1 d-flex justify-content-between align-items-center skill-option" id="skill${skill.id}">
                ${skill.name}
                <i class="far fa-plus-circle text-muted"></i>
                </li>`)
            $('#skillList').append(elem);
            $(`#skill${skill.id}`).click(e => {
                $('.searchSkill').val(skill.name);
                $('.searchSkill').attr('id', `${skill.id}`);
                $('#skillContainer').hide();
                addSkill(userId);
            })
        });  
}