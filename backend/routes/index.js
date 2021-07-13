var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary').v2;
var uniqid = require('uniqid');
const fs = require('fs');
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
cloudinary.config({
  cloud_name: 'dynf7eh8t',
  api_key: apiKey,
  api_secret: apiSecret
});
const request = require('sync-request');
const azurSubscriptionKey = process.env.AZUR_SUBSCRIPTION_KEY;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload-video', async (req, res, next) => {
  // console.log('req.files.video ----> ', req.files.video)
  var vidPath = `./tmp/${uniqid()}.mov`
  var resultCopy = await req.files.video.mv(vidPath)
  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(vidPath, options = { resource_type: "video" })
    res.json({ result: true, message: 'File uploaded !', resultCloudinary: resultCloudinary })
  } else {
    res.json({ result: false, message: resultCopy })
  }
  fs.unlinkSync(vidPath)
})

router.post('/upload-image', async (req, res, next) => {
  var imgPath = `./tmp/${uniqid()}.jpg`
  var resultCopy = await req.files.avatar.mv(imgPath)
  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imgPath)

    // console.log('ResultCloudinary.url', resultCloudinary.url)

    const subscriptionKey = azurSubscriptionKey;
    const uriBase = 'https://lacapsule.cognitiveservices.azure.com/face/v1.0/detect'

    const params = {
      returnFaceId: 'true',
      returnFaceLandmarks: 'false',
      returnFaceAttributes: 'age,gender,smile,facialHair,glasses,emotion,hair',
    };

    const options = {
      qs: params,
      body: `{"url": '${resultCloudinary.url}' }`,
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    };

    var resultVisionRaw = await request('POST', uriBase, options);
    var resultVision = await resultVisionRaw.body;
    resultVision = await JSON.parse(resultVision);

    // console.log('ResultVision -----> ', resultVision)

    var newResultCloudinary = {}
    if (resultVision !== 'undefined' && resultVision.length !== 0) {
      newResultCloudinary = { ...resultCloudinary, faceAttributes: resultVision[0].faceAttributes }
    } else {
      newResultCloudinary = { ...resultCloudinary }
    }

    //  console.log('NewResultCloudinary ----> ',newResultCloudinary.faceAttributes.hair.hairColor)

    res.json({ result: true, message: 'File uploaded !', resultCloudinary: newResultCloudinary })

  } else {
    res.json({ result: false, message: resultCopy })
  }
  fs.unlinkSync(imgPath)
})

module.exports = router;
