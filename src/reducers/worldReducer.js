import { fromJS } from 'immutable';
import { r_setImageData } from 'actions/worldActions';
import * as Settings from 'constants/WorldSettings';

export const initialState = fromJS({
  pixels: [],
  width: 0,
  height: 0
});

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case r_setImageData.type:
      const {width, height, pixels} = payload;

      const field = [];
      for (let i = 0; i < width; i++) {
        field[i] = [];
        field[i][height - 1] = 0;
      }

      for (let i = 0; i < height; i ++) {
        const indexY = Math.min(i, height - 1);
        for (let j = 0; j < width; j ++) {
          const indexX = Math.min(j, width - 1);
          field[j][i] = pixels[indexX][indexY] !== 255 ? 1 : 0;
        }
      }

      return state
        .set('pixels', field)
        .set('width', width)
        .set('height', height);

    default:
      return state;
  }
};