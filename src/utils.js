function roundWithPrecision(number, precision = 0) {
  const exp = Math.pow(10, precision);
  return Math.round(number * exp) / exp;
}

function rotatePoint(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) + (sin * (x - cx)) + cy; // myslim ze ta znamenka maji byt takhle
  return [nx, ny];
}

export { roundWithPrecision, rotatePoint };