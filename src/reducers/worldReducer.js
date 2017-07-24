import { fromJS } from 'immutable';
import { r_setImageData } from 'actions/worldActions';

import * as Settings from 'constants/world';

export const initialState = fromJS({
  pixels: [],
  width: 0,
  height: 0
});

/**
 * Converts real world coordinates (specified in meters) to pixel world representation.
 *
 * @param x X coord in real world in metres.
 * @param y Y coord in real world in metres.
 * @param radius rotation in degrees
 */
function convertWorldCoordsToFieldCoords(x, y, radius) {
  x *= Settings.PIXELS_PER_M;
  y *= Settings.PIXELS_PER_M;
  radius *= Settings.PIXELS_PER_M;

  return {x, y, radius};
}

/**
 * Returns true if the line can be seen from specified position in the given radius.
 *
 * @param x X coordinate in real world in metres.
 * @param y Y coordinate in real world in metres.
 * @param radius Radius in which to search in metres.
 * @param field 2D array describing the track map.
 * @returns {boolean}
 */
export function canSeeLine({x, y, radius, field}) {
  let {x: newX, y: newY, radius: newRadius} = convertWorldCoordsToFieldCoords(x, y, radius);
  newX = Math.round(newX);
  newY = Math.round(newY);

  let lineSeen = false;
  for (let i = 0; i <= newRadius; i++) {
    for (let j = 0; j <= newRadius; j++) {
      if (newX + j < field.length && newY + i < field[0].length) {
        if (field[newX + j]) {
          lineSeen = field[newX + j][newY + i] || lineSeen;
        }
      }
    }
  }

  return lineSeen;
}

export default (state = initialState, action) => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case r_setImageData.type: {
      const {width, height, pixels} = payload;

      const field = [];
      for (let i = 0; i < width; i++) {
        field[i] = [];
        field[i][height - 1] = 0;
      }

      for (let i = 0; i < height; i++) {
        const indexY = Math.min(i, height - 1);
        for (let j = 0; j < width; j++) {
          const indexX = Math.min(j, width - 1);
          field[j][i] = pixels[indexX][indexY] !== 255 ? 1 : 0;
        }
      }

      return state
        .set('pixels', field)
        .set('width', width)
        .set('height', height);
    }

    default:
      return state;
  }
};