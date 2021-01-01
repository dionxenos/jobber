import {getJobSkills} from "./jobEditSkills.js";
import {getJobLanguages} from "./jobEditLanguages.js";
import {getJobEducation} from "./jobEditEducation.js";

$(async () => {
    const user = await $.ajax({url:'/users/myuser'});
    $('#username').text(' '+user.fullname);
    const pathname = window.location.pathname;
    const jobId = pathname.split('/').pop();

    const job = await $.ajax({url:`/jobs/getByJobId/${jobId}`});
    $("#jobTitle").text(job.title);

    getJobSkills(job.id);
    getJobLanguages(job.id);
    getJobEducation(job.id);
})