console.log('Loading function');
const aws = require("aws-sdk");
const ses = new aws.SES({});
exports.handler = async function (event, context, callback) {

  let message = event.Records[0].Sns.Message;
  console.log('Message received from SNS:', message);
  let data = JSON.parse(message);
  console.log(data);
  let fromAddress = data.fromAddress;
  let toAddress = data.toAddress;
  let userName = data.userName;
  let link = data.link;
  let params = {
    Destination: 
    {
      ToAddresses: [toAddress],
    },
    Message: 
    {
      Body: 
      {
        Html: 
        {
          Data:
            ` <!DOCTYPE html>
              <html>
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <title>Account Verification</title>
                  <style>
                    body {
                      background-color: #FFFFFF;
                      padding: 10px;
                      margin: 10px;
                    }
                  </style>
                </head>
                <body style="background-color: #FFFFFF; padding: 10px; margin: 10px;">
                <article>
                  <h1>
                    Hi ${userName},
                  </h1>
                  <br>
                  <h2>
                    Welcome to ${data.domain},
                  </h2>
                  <p> Please user <a href=${link}>link</a> to verify your account.  </p>
                  <br>
                  <p> if you are unable to user the link, copy paste the below link in your browser</p>
                  <p>${link}</p>
                </article>
                </body>
              </html>`
        },
      },
      Subject: { Data: `Account Verification - ${data.toAddress}` },
    },
    Source: fromAddress,
  };

  await ses.sendEmail(params).promise();
  callback(null, "Success");

};