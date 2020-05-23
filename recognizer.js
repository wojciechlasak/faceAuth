const cv = require('opencv4nodejs');
const fs = require('fs');
const path = require('path');

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

const basePath = './images_db';
const subjectsPath = path.resolve(basePath, 'subjects');
const nameMappings = ['conan','wojciech','jennifer'];
const allFiles = fs.readdirSync(subjectsPath);

const getFaceImage = (grayImage) => {
  const faceRects = classifier.detectMultiScale(grayImage).objects;
  if (!faceRects.length) {
    throw new Error('No faces found in the photo');
  }
  return grayImage.getRegion(faceRects[0]);
};


const images = allFiles
  .map(file => path.resolve(subjectsPath, file))
  .map(filePath => cv.imread(filePath))
  .map(image => image.bgrToGray())
  .map(getFaceImage)
  .map(faceImg => faceImg.resize(100, 100));


const isTargetImage = (_, i) => allFiles[i].includes('test');
const isTrainingImage = (_, i) => !isTargetImage(_, i);
const trainImages = images.filter(isTrainingImage);
const testImages = images.filter(isTargetImage);
const labels = allFiles.filter(isTrainingImage)
  .map(file => nameMappings.findIndex(name => file.includes(name)));

const fisher = new cv.FisherFaceRecognizer();
fisher.train(trainImages, labels);
const eigen = new cv.EigenFaceRecognizer();
eigen.train(trainImages, labels);
const lbph = new cv.LBPHFaceRecognizer();
lbph.train(trainImages, labels);


const runPrediction = (recognizer) => {
  testImages.forEach((img) => {
    const result = recognizer.predict(img);
    confValue = result.confidence;
    console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
    cv.imshowWait('face', img);
    cv.destroyAllWindows();
  });
};

console.log('fisher:');
runPrediction(fisher);

console.log('eigen:');
runPrediction(eigen);

console.log('lbph:');
runPrediction(lbph);