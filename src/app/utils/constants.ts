export const DEFAULT_PAGE_SIZE = 200;
import Swal from 'sweetalert2';

export const LOGIN_PATH = 'login';

export const findAndReplaceModalTitle = (title: string) => {
  if (!title) return;
  let search = setInterval(function () {
    const titleSpan = document.querySelector('span.p-dialog-title');
    if (titleSpan) {
      titleSpan.innerHTML = title;
      // const text = document.createTextNode(title);
      // titleSpan.appendChild(text);
      clearInterval(search);
    }
  }, 50);
  setTimeout(() => {
    clearInterval(search);
  }, 5000);
  // let titleNotFound = true;
  // if(!title) return;
  // let count = 0;
  // while (titleNotFound && count < 100){

  //   count++;
  //   console.log('title not found ...'+ count)

  // }
};

export const USER_KEY = 'eye_clinic_user_key';
export const ACCESS_TOKEN = 'eye_clinic_user_access_token';
export const REFRESH_TOKEN = 'eye_clinic_user_refresh_token';
export const HASH =
  '76y93#$guhaf%#&GIUYGDASF98756tfe8#32yr8of2t_b732983yheHGASUDHJASBD89';
export const enum Roles {
  DOCTOR = 'doctor',
  DIRECTOR = 'director',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SCREENER = 'screener',
  DATACLERK = 'dataclerk',
  EMPLOYEE = 'employee',
}

export const crypt = (text: string, salt = HASH) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
};

export const decrypt = (encoded: string, salt = HASH) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join('');
};

export const loginAlert = () => {
  Swal.fire({
    icon: 'success',
    text: 'Login Successful',
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 1500,
  });
};
export const logoutAlert = () => {
  Swal.fire({
    icon: 'success',
    text: 'Logged Out Successfully',
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 1500,
  });
};
export const successAlert = (text) => {
  Swal.fire({
    icon: 'success',
    text: `${text}`,
    showConfirmButton: false,
    timer: 1500,
  }).then(function () {
    window.location.reload();
  });
};

export const successGradeAlert = (text, funct) => {
  Swal.fire({
    icon: 'success',
    text: `${text}`,
    showConfirmButton: false,
    timer: 1500,
  }).then(function () {
    funct;
  });
};
export const errorAlert = (hello) => {
  Swal.fire({
    icon: 'error',
    text: `${hello}`,
    showConfirmButton: false,
    timer: 1500,
  });
};
