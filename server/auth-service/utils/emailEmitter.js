const EventEmitter = require("events");
const nodemailer = require("nodemailer");

class EmailEmitter extends EventEmitter {}
const emailEmitter = new EmailEmitter();

// Configure transporter
const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// Listen for email events
emailEmitter.on("sendEmail", (to, subject, text) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to,
		subject,
		text,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.error("Error sending email:", error);
		}
		console.log("Email sent:", info.response);
	});
});

// Function to emit email events
const sendEmail = (to, subject, text) => {
	emailEmitter.emit("sendEmail", to, subject, text);
};

module.exports = { sendEmail };
