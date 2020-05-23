var express = require('express');
const cv = require('opencv4nodejs');
var path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser')
var app = express();

// for middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json({limit: "50mb"}));

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

app.get('/login', function (req, res) {
    response = {
        username:req.query.username,
        password:req.query.password
    };
    console.log(response);
    if (response.username == "wojciech" && response.password == "wojtek") {
        res.sendFile(__dirname + "/public/index2.html");
    }
    else {
        res.sendFile(__dirname + "/public/index.html")
    }
});
// set confidence values and the image label that will be
// determined by the face recognition algorithm
var confValue = 0;
var imgLabel = "";

app.post('/upload', async (req, res, next) => {
    try {
        var response = {
            fileData:req.body.fileData,
        };
        var data = response.fileData;
        var imgData = data.replace(/^data:image\/png;base64,/, "");
        console.log(imgData);

        require("fs").writeFile("images_db/subjects/output.png", imgData, "base64", function(err) {
            console.log(err);
        });

        setTimeout(checkFace, 500);
        setTimeout(function() {
            if (confValue < 90.0 && imgLabel == "wojciech") {
                return res.redirect('/final.html');
                
            }
            else {
                return res.redirect('/');
            }
        }, 500);

    } catch (e) {
        console.log(e)
        res.redirect('/');
        next(e)
    }

});

var server = app.listen(8080, function () {
    var port = server.address().port
    console.log("Server running at http://localhost:%s", port)
});


async function checkFace() {
    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    const getFaceImage = (grayImage) => {
        const faceRegion = classifier.detectMultiScale(grayImage).objects;
        if (!faceRegion.length) {
            throw new Error('No faces found in the photo');
        }
        return grayImage.getRegion(faceRegion[0]);
    };

    const basePath = './images_db';
    const subjectsPath = path.resolve(basePath, 'subjects');
    const nameMappings = ['conan', 'wojciech', 'unknwn'];
    const allFiles = fs.readdirSync(subjectsPath);    


    const images = allFiles
        .map(file => path.resolve(subjectsPath, file))
        .map(filePath => cv.imread(filePath))
        .map(image => image.bgrToGray())
        .map(getFaceImage)
        .map(faceImg => faceImg.resize(100, 100));

    const isTargetImage = (_, i) => allFiles[i].includes('output');
    const isTrainingImage = (_, i) => !isTargetImage(_, i);
    const trainImages = images.filter(isTrainingImage);
    const testImages = images.filter(isTargetImage);
    const labels = allFiles.filter(isTrainingImage)
        .map(file => nameMappings.findIndex(name => file.includes(name)));
    const lbph = new cv.LBPHFaceRecognizer();
    lbph.train(trainImages, labels);
    const runPrediction = (recognizer) => {
        testImages.forEach((image) => {
            const result = recognizer.predict(image);
            confValue = result.confidence;
            imgLabel = nameMappings[result.label]
            console.log('Predicted Individual: %s, Confidence Distance: %s', imgLabel, confValue);
        });
    };

    console.log('lbph:');
    runPrediction(lbph);
}