const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6c4cb9bce0cf60",
        pass: "545d69e13f3a0c"
    }
});

const options = {
    from: "",
}