function sendmail(message, callback) {
  const {key, secret, from, to, summary, body, Attachments} = message;

  const mailjet = require("node-mailjet").connect(key, secret);
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: from,
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: summary,
        TextPart: body,
        Attachments
      },
    ],
  });

  request
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      callback(err, null);
    });
}

module.exports = (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // not sure about these two headers
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  
  const {key, secret, from, to, summary, body} = req.body;
  if (!(key && secret && from && to && summary && body)) {
    res.statusCode = 400;
    res.end(JSON.stringify({error: "Missing argument"}, null, 2));
  }

  sendmail(req.body, (err, result) => {
    if (err) {
      res.statusCode = err.statusCode;
      res.end(JSON.stringify({error: err.message}, null, 2));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(JSON.parse(result.response.text || `"something is wrong"`), null, 2));
  });
};
