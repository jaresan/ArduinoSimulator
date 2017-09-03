export function roundWithPrecision(number, precision = 0) {
  const exp = Math.pow(10, precision);
  return Math.round(number * exp) / exp;
}

export function rotatePoint(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) + (sin * (x - cx)) + cy; // myslim ze ta znamenka maji byt takhle
  return [nx, ny];
}

export function setCookie(cookieName, value) {
  document.cookie = `${cookieName}=${encodeURIComponent(value)}`;
}

export function getCookie(cookieName) {
  const name = cookieName + "=";
  const cookieList = document.cookie.split(';');
  const decodedCookies = cookieList.map(c => decodeURIComponent(c));
  for(let i = 0; i < decodedCookies.length; i++) {
    let cookie = decodedCookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}


export function downloadTextAsFile(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}