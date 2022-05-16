
import CryptoJS  from 'crypto-js';


export const serializerUserDataEncript = data => {
  if (data === 'null') return '';
   let encode = CryptoJS.AES.encrypt(data, 'ftownpl').toString();
  return encode;
}

export const serializerUserDataDencrypt = data => {
  if (data === 'null') return '';
    let decode = CryptoJS.AES.decrypt(data, 'ftownpl');
    let originalText = decode.toString(CryptoJS.enc.Utf8);
  return originalText
}

export   const secretWordEncoding = (word) => {
  let arrChar = [
      ["a", "p"],
      ["b", "y"],
      ["c", "u"],
      ["d", "q"],
      ["e", "z"],
      ["f", "f"],
      ["g", "w"],
      ["h", "h"],
      ["i", "n"],
      ["j", "t"],
      ["k", "k"],
      ["l", "l"],
      ["m", "s"],
      ["n", "i"],
      ["o", "x"],
      ["p", "a"],
      ["q", "d"],
      ["r", "r"],
      ["s", "m"],
      ["t", "j"],
      ["u", "c"],
      ["v", "v"],
      ["w", "g"],
      ["x", "o"],
      ["y", "b"],
      ["z", "e"]
  ] 
  let res = '';
  for(let i = 0; i < word.length; i++){
    for(const key of arrChar){
      if (word[i] === key[0]){
        res = res.concat(key[1]);
      }
    }
  }
  return res;
}

export   const secretWordDecoding = (word) => {
  let arrChar = [
      ["a", "p"],
      ["b", "y"],
      ["c", "u"],
      ["d", "q"],
      ["e", "z"],
      ["f", "f"],
      ["g", "w"],
      ["h", "h"],
      ["i", "n"],
      ["j", "t"],
      ["k", "k"],
      ["l", "l"],
      ["m", "s"],
      ["n", "i"],
      ["o", "x"],
      ["p", "a"],
      ["q", "d"],
      ["r", "r"],
      ["s", "m"],
      ["t", "j"],
      ["u", "c"],
      ["v", "v"],
      ["w", "g"],
      ["x", "o"],
      ["y", "b"],
      ["z", "e"]
  ] 
  let res = '';
  for(let i = 0; i < word.length; i++){
    for(const key of arrChar){
      if (word[i] === key[1]){
        res = res.concat(key[0]);
      }
    }
  }
  return res;
}