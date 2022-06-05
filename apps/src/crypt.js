import Cryptr from "cryptr";

const decryptData = (data,pin) => {
    const cryptr = new Cryptr(pin);
    const decrypted_data = cryptr.decrypt(data);
    return decrypted_data
  };

 const encryptData = (data,pin) => {
    const cryptr = new Cryptr(pin)
    const encrypted_data = cryptr.encrypt(data)
    return encrypted_data
  }

export {decryptData}
export {encryptData}
