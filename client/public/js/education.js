export async function getEducation(user) {
    const userEdu = await $.ajax({url: `/api/usereducation/${user.id}`});
    loadOptions();
    showDegrees(userEdu);

    $('#educationSubmitBtn').click((e) => {
        e.preventDefault();
        addEducation(user.id);
    })
}

async function loadOptions() {
    const fields = await $.ajax({url: "/education/fields"});
    const levels = await $.ajax({url: "/education/levels"});
    const startYear = 1980;
    const endYear = (new Date()).getFullYear();

    searchFields(fields);

    $('#degreeList').append(`<option disabled selected value="">Degree Level...</option>`);
    levels.forEach(l => {
        $('#degreeList').append(`<option value="${l.id}">${l.level} </option>`);
    });

    $('#from').append(`<option disabled selected value="">From...</option>`);
    for(let i=endYear; i>=startYear; i--) {
        $('#from').append(`<option value=${i}>${i}</option>`);
    }
    $('#to').append(`<option disabled selected value="">To...</option>`);
    $('#from').change(() => {
        $('#to').empty();
        $('#to').append(`<option value="-">-</option>`);
        $('#to').attr("disabled", false);
        let selectedStart = $('#from').val();
        for(let i=endYear; i>=selectedStart; i--) {
            $('#to').append(`<option value=${i}>${i}</option>`);
        }
    })
}

function showDegrees(userEdu) {
    if(userEdu.length != 0){
        userEdu.degrees.forEach(e => {
        showDegree(e);
    })}
}

function showDegree(degree) {
    const elem = $(`
    <li class="list-group-item">
        <div class="row">
            <i class="fas fa-graduation-cap"></i>
            <strong class="col-sm-2">${degree.from}-${degree.to}:</strong>
            <div class="d-inline col-sm-7 border-right"> 
                <span class="badge badge-danger rounded-pill px-2 py-1 degreeBadge">${degree.level}</span> on <strong class="mr-2">${degree.fieldName}</strong> 
            </div>
            <span class="faClickable col-sm-1" id="degree${degree.id}"><i class="far fa-trash-alt ml-2"></i></span>
        </div>
    </li>
    `);
    $('#education').append($(elem)).hide().fadeIn(200);
    elem.data('id', degree.id);

    $('#education').on('click', `#degree${degree.id}`, () => {
        removeDegree(elem);
    });
}

function removeDegree(elem) {
    $.ajax({
        type:'DELETE',
        url:'/api/usereducation/delete/'+elem.data('id')
    });
    elem.remove();
}

function addEducation(id) {
    const inputField = $('.inputEdu').attr("id");
    const inputLevel = $('#degreeList').val();
    const from = $('#from').val();
    const to = $('#to').val();
    $.ajax({
        type: 'POST',
        url: `/api/usereducation/add`,
        data: {userId: id, fieldId: inputField, levelId: inputLevel, from: from, to: to}
    }).then(async ce => {
        const fieldName = await $.ajax({url: `/education/fields/${inputField}`});
        // console.log(fieldName)
        const levelName = await $.ajax({url: `/education/levels/${inputLevel}`});
        // console.log(levelName)
        let c = {from: from, to: to, level: levelName.level, fieldName: fieldName.name, id: ce.id};
        showDegree(c);
    });
    $('.inputEdu').val("")
    $('#degreeList').prop("selectedIndex", 0);
    $('#from').prop("selectedIndex", 0);
    $('#to').prop("selectedIndex", 0);
}

function searchFields(fields) {
    $('.inputEdu')
    .autocomplete({
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
        select: function(event, ui) {
            $('.inputEdu').val(ui.item.label);
            $('.inputEdu').attr('id', ui.item.value);
            return false;
        },
        focus: function ( event, ui ) {
            $('.inputEdu').val( ui.item.label );
            $('.inputEdu').attr('id', ui.item.value);
            return false;
        },
        delay: 100,
        minLength: 0
    })
    .focus(function() {
        $(this).autocomplete("search", $(this).val());
    })
    .focusin(() => {
        $('.inputEdu').removeClass("rounded-pill");
    })
    .focusout(() => {
        $('.inputEdu').addClass("rounded-pill");
    })
}
