const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // ✅ ya SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendApplicationEmail(toEmail, jobTitle) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Thank you for applying!',
    text: `Dear applicant,\n\nThank you for applying for ${jobTitle}. Our HR team will contact you if your profile matches our requirements.\n\nBest,\nJobBoard Team`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendApplicationEmail;
