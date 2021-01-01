$(document).ready(async () => {
    const searchBox = $('#example-search-input2');
    const users = await $.ajax({url:'/users'});
    const userNames = users.map(u => {
        return {id: u.id, fullname: u.fullname}
    });

    searchBox.focusin(() => {
        $('#suggestions-box').show();
        searchBox.toggleClass("rounded-pill")
    });

    searchBox.focusout(() => {
        window.setTimeout(function() { 
            $('#suggestions-box').hide();
            searchBox.toggleClass("rounded-pill")
        }, 100);
    });

    searchBox.on('input', e => {
        $('#suggestions-box').empty();
        $('#suggestions-box').show();
        const inputText = searchBox.val();
        if(inputText !== "") searchName(inputText, userNames);
    });
})

async function searchName(inputName, userNames) {
    const r = new RegExp(`^${inputName}`, 'gi');
    let suggestions = userNames.filter(u => {
        return u.fullname.match(r);
    });
    showSuggestions(suggestions);
}

function showSuggestions(suggestions) {
    for(let i=0; i<7 && i<suggestions.length; i++) {
        $('#suggestions-box').append(`
            <li class="list-group-item py-2 list-suggestion d-flex justify-content-between align-items-center" id="user${suggestions[i].id}">
                ${suggestions[i].fullname}
                <i class="far fa-search text-muted"></i>
            <li>
        `);
        $(`#user${suggestions[i].id}`).click(() => {
            $('#example-search-input2').val(suggestions[i].fullname);
            window.setTimeout(function() { 
                $('#suggestions-box').hide();
            }, 50);
            $.ajax({
                type: "POST",
                url: "/users/search-user",
                data: {id: suggestions[i].id},
                success: function() {
                    location.assign(`/users/user/${suggestions[i].id}`)
                }
            })
        });
    };
    
}