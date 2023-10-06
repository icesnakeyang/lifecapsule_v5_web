// import CryptoJS from '../node_modules/crypto-js/crypto-js.js'
import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

export function GenerateKey() {
    const uuidStr =
        (Math.random() * 10000000).toString(16).substr(0, 4) +
        new Date().getTime() +
        Math.random().toString().substr(2, 5);
    return uuidStr;
}

/**
 * AES加密
 */
export function Encrypt(word, keyStr, ivStr) {
    let key;
    let iv;

    if (keyStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
        iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    let encrypted = CryptoJS.AES.encrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    let cipherText = encrypted.ciphertext.toString();

    return cipherText;
}

export function RSAencrypt(content, publicKey) {
    let jse = new JSEncrypt();
    jse.setPublicKey(publicKey);

    const result = jse.encrypt(content);
    return result;
}
export function GenerateRandomString16() {
    let x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    let tmp = "";
    for (let i = 0; i < 16; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return tmp;
}

export function Decrypt2(word, keyStr) {
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    let ss = CryptoJS.enc.Utf8.stringify(decrypt).toString();
    return ss;
}

export function Decrypt(cipherText, keyStr, ivStr) {
    let cipherTextHexStr = CryptoJS.enc.Hex.parse(cipherText);
    let cipherTextBase64Str = CryptoJS.enc.Base64.stringify(cipherTextHexStr);
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);
    let decrypt = CryptoJS.AES.decrypt(cipherTextBase64Str, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
}
