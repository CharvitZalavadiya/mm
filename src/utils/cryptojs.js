import CryptoJS from "crypto-js";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY_ENCRYPTION || '123'
// console.log(SECRET_KEY)
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
