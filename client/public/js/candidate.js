import {getSkills} from "./skills.js";
import {getLanguages} from "./languages.js";
import {getEducation} from "./education.js";

$(document).ready(async () => {
    $(".cv-nav").addClass("active");
    $(".faCV").removeClass("fal").addClass("fas");
    const user = await $.ajax({url:'/users/myuser'});
    $('#username').text(' '+user.fullname);
    getSkills(user);
    getLanguages(user);
    getEducation(user);

});