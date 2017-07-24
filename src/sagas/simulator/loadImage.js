import { put, takeEvery } from 'redux-saga/effects';
import { s_loadImage } from 'actions/simulatorActions';
import { r_setImageData } from 'actions/worldActions'


function* loadImage({payload: {img, targetWidth, realWorldWidth, realWorldHeight}}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const width = img.width;
  canvas.width = targetWidth;
  canvas.height = (canvas.width / width) * img.height;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data.filter((p, i) => i % 4 === 0);
  let pixelArr = [];

  for (let i = 0; i < canvas.width; i++) {
    pixelArr[i] = [];
  }

  let index = 0;
  for (let i = 0; i < canvas.height; i++) {
    for (let j = 0; j < canvas.width; j++) {
      pixelArr[j][i] = pixels[index++];
    }
  }

  yield put(r_setImageData({
      pixels: pixelArr,
      width: canvas.width,
      height: canvas.height
    }));
}

export default function* loadImageSaga() {
  yield takeEvery(s_loadImage.type, loadImage);
}