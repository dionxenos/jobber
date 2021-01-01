export async function getJobSkills(jobId) {
    const skillList = await $.ajax({url: '/skills'});
    const s = await $.ajax({url: `/jobs/getSkills/${jobId}`});
    const skills = s.Skills;
    showSkills(skills, jobId);
    filterSkills(jobId);
 
}

function showSkills(skills, jobId) {
    skills.forEach(skill => {
        showSkill(skill, jobId);
    });
}

function showSkill(skill, thisJobId) {
    const elem = $(`
        <li class="list-inline-item"><p class="badge badge-info userSkill rounded-pill"> ${skill.name} <span class="faClickable" id="${skill.id}"><i class="far fa-trash-alt ml-2"></i></span> </p></li>
    `)
    $(".jobSkills").append(elem);
    elem.data("id", skill.id);

    $(`#${skill.id}`).click(() => {
        removeSkill(elem, thisJobId);
        filterSkills(thisJobId);
    })
}

function removeSkill(elem, thisJobId) {
    $.ajax({
        type: 'DELETE',
        url: `/jobs/skills/delete/${thisJobId}/${elem.data("id")}`
    })
    elem.remove();
}

function searchSkill(skillList, jobId) {
    $('.skillInput').autocomplete({
        source: function(request, response) {
            let matchTerm = new RegExp(`${request.term}`,'gi');

            let data = skillList.map(l => 
                ({
                    label: l.name,
                    value: l.id
                })
            );
            response(data.filter(d => {
                return d.label.match(matchTerm)
            }));
        },
        focus: function ( event, ui ) {
            $('.skillInput').val( ui.item.label );
            return false;
        },
        select: function(event, ui) {
            // $('.skillInput').val(ui.item.label);
            // $('.skillInput').attr('id', ui.item.value);
            const skill = ui.item;
            addSkill(skill, jobId);
            return false;
        },
        delay: 0,
        minLength: 1
    })
    .focus(function() {
        $(this).autocomplete("search", $(this).val());
    })
}

function addSkill(skill, jobId) {
    $.ajax({
        type: 'POST',
        url: '/jobs/skills/add',
        data: {jobId: jobId, skillId: skill.value}
    })
    .then(async s => {
        const skill = await $.ajax({url:`/skills/${s.SkillId}`});
        showSkill(skill, s.JobId);
        $('.skillInput').val("");
        filterSkills(jobId)
    })
}

async function filterSkills(jobId) {
    const skillList = await $.ajax({url: '/skills'});
    const s = await $.ajax({url: `/jobs/getSkills/${jobId}`});
    const skills = s.Skills;
    const filter = skills.map(s => {return s.id})
    
    var filtered = skillList.filter(s => {return !filter.includes(s.id)});
    searchSkill(filtered, jobId);
    return filtered;
}