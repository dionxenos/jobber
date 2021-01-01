export async function getJobEducation(jobId) {
    const fields = await $.ajax({url: '/education/fields'});
    const levels = await $.ajax({url: '/education/levels'});
    // console.log(fields);
    // console.log(levels);

    const jobEdu = await $.ajax({url: `/jobs/getEducation/${jobId}`});
    console.log(jobEdu);

    searchField(fields);
    searchLevel(levels);

    showDegrees(jobEdu);

    $(".eduForm").submit((e) => {
        e.preventDefault();
        addDegree(jobId);
    })
}

function searchField(fields) {
    $(".fieldInput").autocomplete({
        source: function(request, response) {
            let matchTerm = new RegExp(`${request.term}`,'gi');

            let data = fields.map(l => 
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
            $('.fieldInput').val( ui.item.label );
            return false;
        },
        select: function(event, ui) {
            const field = ui.item;
            $('.fieldInput').val( field.label );
            return false;
        },
        delay: 100,
        minLength: 0
    })
    .focus(function() {
        $(this).autocomplete("search", $(this).val());
    })
}

function searchLevel(levels) {
    $(".levelInput").autocomplete({
        source: function(request, response) {
            let matchTerm = new RegExp(`${request.term}`,'gi');

            let data = levels.map(l => 
                ({
                    label: l.level,
                    value: l.id
                })
            );
            response(data.filter(d => {
                return d.label.match(matchTerm)
            }));
        },
        focus: function ( event, ui ) {
            $('.levelInput').val( ui.item.label );
            return false;
        },
        select: function(event, ui) {
            const level = ui.item;
            $('.levelInput').val( level.label );
            return false;
        },
        delay: 100,
        minLength: 0
    })
    .focus(function() {
        $(this).autocomplete("search", $(this).val());
    })
}

async function addDegree(jobId) {
    const levelName = $('.levelInput').val();
    const fieldName = $('.fieldInput').val();

    const field = await $.ajax({url: `/education/fields/getByName/${fieldName}`});
    const level = await $.ajax({url: `/education/levels/getByName/${levelName}`});

    $.ajax({
        type: 'POST',
        url: '/jobs/education/add',
        data: {jobId: jobId, fieldId: field.id, levelId: level.id}
    })
    .then(je => {
        $('.levelInput').val("");
        $('.fieldInput').val("");
        const elem = $(`
        <li class="list-group-item d-flex justify-content-between">
            <div class="col-6"><i class="fal fa-graduation-cap"></i> <strong>${field.name}</strong></div>
            <div class="col-4"> <span class="text-muted">Required Degree:</span> ${level.level}</div>
            <span class="faClickable" id="deg${je.id}"><i class="far fa-trash-alt"></i></span>
        </li>
        `);
        $('.educationList').append(elem);
        elem.data("id", je.id);
        $(`#deg${je.id}`).click(() => {
            removeDegree(elem);
        });
    })
}

function showDegrees(degrees) {
    degrees.forEach(degree => {
        showDegree(degree);
    });
}

function showDegree(degree) {
    const elem = $(`
    <li class="list-group-item d-flex justify-content-between">
        <div class="col-6"><i class="fal fa-graduation-cap"></i> <strong>${degree.Name}</strong></div>
        <div class="col-4"> <span class="text-muted">Required Degree:</span> ${degree.Level}</div>
        <span class="faClickable" id="deg${degree.Id}"><i class="far fa-trash-alt"></i></span>
    </li>
    `);
    $('.educationList').append(elem);
    elem.data("id", degree.Id);
    $(`#deg${degree.Id}`).click(() => {
        removeDegree(elem);
    });
}

function removeDegree(elem) {
    $.ajax({
        type: 'DELETE',
        url: `/jobs/education/delete/${elem.data('id')}`
    })
    elem.remove();
}