import CryptoJS from "crypto-js";

const SECRET_KEY = "c7ba868af8bf7c155cf9e0439a6926b1bcb5ca5adb4690ab682f38eb6992ff03";

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
