const AWS = require("aws-sdk")

const ses = new AWS.SES({ 
    region: "ap-south-1", 
    accessKeyId: "AKIAYLV3HVFSD5APUZOG", 
    secretAccessKey: "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"
});


function sendEmail() {
    // const params = 

    const emailParams = {
        Source: "jaypatel45677@gmail.com",
        Destination: {
            ToAddresses: ["jaypatel15082@gmail.com"]
        },
        Message: {
            Subject: {
                Data: "hello"
            },
            Body: {
                Text: {
                    Data: "From Constact"
                }               
            },
            Subject: {
                Data: "Name"
            }
        }
    }

    return ses.sendEmail(emailParams).promise();
}

exports.sendEmail = sendEmail

// sendEmail()
// .then(data => {
//     console.log("success")
//     console.log(data)
// })
// .catch(err => {
//     console.log(err)
// })