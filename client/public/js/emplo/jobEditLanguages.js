export async function getJobLanguages(jobId) {
    const levelList = await $.ajax({url: '/languages/levels'});
    const jobLangs = await $.ajax({url: `/jobs/getLanguages/${jobId}`});

    showLangs(jobLangs, jobId);

    filterLangs(jobId);
    searchLevel(levelList);

    $(".langForm").submit((e) => {
        e.preventDefault();
        addLang(jobId)
    })
}

function searchLevel (levelList) {
    $('.langLevelInput').autocomplete({
        source: function(request, response) {
            let matchTerm = new RegExp(`${request.term}`,'gi');

            let data = levelList.map(l => 
                ({
                    label: l.code,
                    value: l.code
                })
            );
            response(data.filter(d => {
                return d.label.match(matchTerm)
            }));
        },
        focus: function ( event, ui ) {
            $('.langLevelInput').val( ui.item.label );
            return false;
        },
        select: function(event, ui) {
            const lang = ui.item;
            $('.langLevelInput').val( lang.label );
            return false;
        },
        delay: 100,
        minLength: 0
    })
    .focus(function() {
        $(this).autocomplete("search", $(this).val());
    })
}

function searchLang (langList) {
    $('.langInput').autocomplete({
        source: function(request, response) {
            let matchTerm = new RegExp(`${request.term}`,'gi');

            let data = langList.map(l => 
                ({
                    label: l.name,
                    value: l.code
                })
            );
            response(data.filter(d => {
                return d.label.match(matchTerm)
            }));
        },
        focus: function ( event, ui ) {
            $('.langInput').val( ui.item.label );
            return false;
        },
        select: function(event, ui) {
            const lang = ui.item;
            $('.langInput').val( lang.label );
            return false;
        },
        delay: 100,
        minLength: 0
    })
    .focus(function() {
        $(this).autocomplete("search", $(this).val());
    })
}

async function addLang(jobId) {
    const langName = $('.langInput').val();
    const lang = await $.ajax({url: `/languages/getByLangName/${langName}`});
    const level = $('.langLevelInput').val();

    $.ajax({
        url: '/jobs/languages/add',
        type: 'POST',
        data: {jobId: jobId, languageCode: lang.code, languageLevelCode: level}
    })
    .then(jl => {
        filterLangs(jobId)
        $('.langInput').val("");
        $('.langLevelInput').val("");
        const elem = $(`
            <li class="list-group-item d-flex justify-content-between">
                <div class="col-3"><i class="fal fa-comments fa-lg"></i> <strong>${langName}</strong></div>
                <div class="col-4"> <span class="text-muted">Required Level:</span> ${jl.LanguageLevelCode}</div>
                <span class="faClickable" id="lang${jl.id}"><i class="far fa-trash-alt"></i></span>
            </li>`)
        $(".languageList").append(elem);
        elem.data("id", jl.id);
        $(`#lang${jl.id}`).click(() => {
            removeLang(elem);
            filterLangs(jobId);
        });
    })
}

function showLangs(langs, jobId) {
    langs.forEach(lang => {
        showLang(lang, jobId);
    });
}

function showLang(lang, jobId) {
    const elem = $(`
        <li class="list-group-item d-flex justify-content-between">
            <div class="col-3"><i class="fal fa-comments fa-lg"></i> <strong>${lang.Name}</strong></div>
            <div class="col-4"> <span class="text-muted">Required Level:</span> ${lang.LanguageLevelCode}</div>
            <span class="faClickable" id="lang${lang.Id}"><i class="far fa-trash-alt"></i></span>
        </li>`)
    $(".languageList").append(elem);
    elem.data("id", lang.Id);
    $(`#lang${lang.Id}`).click(() => {
        removeLang(elem);
        filterLangs(jobId)
    });
}

function removeLang(elem) {
    $.ajax({
        type: 'DELETE',
        url: `/jobs/languages/delete/${elem.data('id')}`
    })
    elem.remove();
}

async function filterLangs(jobId) {
    const langs = await $.ajax(`/languages`);
    const languages = await $.ajax(`/jobs/getLanguages/${jobId}`);
    const filter = languages.map(l => {return l.LanguageCode})
    var filtered = [];

    filtered = langs.filter(l => {return !filter.includes(l.code)})
    searchLang(filtered);
    return filtered;
}