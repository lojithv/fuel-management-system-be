const nodemailer = require("nodemailer");
const mjml2html = require("mjml");
// const { getPlaceById } = require("../dao/Place");
require("dotenv").config();

const sgMail = require("@sendgrid/mail");

const sendMail = async function (email, data) {
  console.log("mail", email);
  console.log("desc", data);

  return new Promise(async (resolve, reject) => {
    const template = mjml2html(
      `
      <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px" color="#43a2f4" align="center" font-family="helvetica">FuelIn</mj-text>
            <mj-divider border-color="#43a2f4"></mj-divider>
            <mj-text font-size="15px" align="center" color="#43a2f4" font-family="helvetica">${data.description}</mj-text>
            <mj-text font-size="15px" align="center" color="#43a2f4" font-family="helvetica">${data.note}</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml> 
    `,
      {}
    );

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email, // Change to your recipient
      from: "lojith_v@cyperbits.com", // Change to your verified sender
      subject: data.subject,
      text: data.text,
      html: template.html,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

module.exports = sendMail;
