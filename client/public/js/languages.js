export async function getLanguages(user) {
    loadAllLevels();
    const languages = await $.ajax(`/api/userlanguages/${user.id}`);
    filterLangs(user.id);
    showLanguages(languages, user.id);
    // toggleSubmitBtn();

    $('.addLanguage').on('submit', async(e) => {
        e.preventDefault();
        addLanguage(user.id);
    });
}

async function loadAllLevels() {
    const levels = await $.ajax(`/languages/levels`);
    $('#levelList').append(`<option disabled selected value="">Degree Level...</option>`);
    levels.forEach(l => {
        $('#levelList').append(`<option value="${l.code}">${l.code} </option>`);
    });
}

function showLanguages(languages, userId) {
    let langs = languages.map(l => 
        ({
            name: l.Language.name,
            levelCode: l.LanguageLevelCode,
            id: l.id
        })
    );
    langs.forEach(l => {
        showLanguage(l, userId);
    });
};

function showLanguage(l, userId) {
    const elem = $(`
        <div class="row ml-md-1 col-md-8">
            <div class="p-2 col-md-3">
                <i class="fas fa-globe-americas"></i> <strong>${l.name}:</strong>
            </div> 
            <div class="p-2 col-md-2">
                <span class="badge badge-info rounded-pill px-2 levelBadge">${l.levelCode}</span>
            </div>
            <div class="p-2 col-md-1">
                <span class="faClickable" id="lang${l.id}"><i class="far fa-trash-alt ml-2"></i></span> 
            </div>
        </div>
    `);
    elem.data('id', l.id);
    $('#languages').append(elem).hide().fadeIn(200);

    $('#languages').on('click', `#lang${l.id}`, () => {
        removeLanguage(elem);
        filterLangs(userId)
    });
};

function searchLanguage(langs) {
    $('.myLanguage')
    .autocomplete({
        source: function(request, response) {
            let matchTerm = new RegExp(`^${request.term}`,'gi');

            let data = langs.map(l => 
                ({
                    label: l.name,
                    value: l.code
                })
            );
            response(data.filter(d => {
                return d.label.match(matchTerm)
            }));
        },
        select: function(event, ui) {
            $('.myLanguage').val(ui.item.label);
            $('.myLanguage').attr('id', ui.item.value);
            return false;
        },
        focus: function ( event, ui ) {
            $('.myLanguage').val( ui.item.label );
            $('.myLanguage').attr('id', ui.item.value);
            return false;
        },
        delay: 100,
        minLength: 0
    })
    // .on('input', e => {
    //     if($('.myLanguage').val() !== "") $(".clearBtn").removeClass("d-none")
    //     else $(".clearBtn").addClass("d-none")  
    // })
    .focus(function() {
        $(this).autocomplete("search", $(this).val());
    })
    .focusin(() => {
        $('.myLanguage').removeClass("rounded-pill");
    })
    .focusout(() => {
        $('.myLanguage').addClass("rounded-pill");
    })
}

function removeLanguage(elem) {
    $.ajax({
        type:'DELETE',
        url:'/api/userlanguages/delete/'+elem.data('id')
    });
    elem.remove();
};

function addLanguage(id) {
    const inputLang = $('.myLanguage').attr("id");
    const inputLevel = $('#levelList').val();
    $.ajax({
        type: 'POST',
        url: `/api/userlanguages/add`,
        data: {userid: id, languageid: inputLang, languagelevel: inputLevel}
    }).then(cl => {
        console.log(cl)
        $.ajax(`/languages/${cl.LanguageCode}`)
        .then(l => {
            let lang = {name: l.name, levelCode: cl.LanguageLevelCode, id: cl.id}
            showLanguage(lang);
        });
    });
    filterLangs(id);
    $('.myLanguage').val("")
    $('#levelList').prop("selectedIndex", 0);
};  

async function filterLangs(userId) {
    const langs = await $.ajax(`/languages`);
    const languages = await $.ajax(`/api/userlanguages/${userId}`);
    const filter = languages.map(l => {return l.Language.code})
    var filtered = [];

    filtered = langs.filter(l => {return !filter.includes(l.code)})
    console.log(filtered)
    searchLanguage(filtered);
    return filtered;
}

// function toggleSubmitBtn() {
//     $('.myLanguage').on('input', () => {
//         $('#levelList').change(() => {
//             let activeBtn = ($('.myLanguage').val !== "" && $('#levelList').prop("selectedIndex") !== 0);
//             console.log(activeBtn);
//             $('#languageSubmitBtn').prop("disabled", !activeBtn);
//         })
            
//     })
// }