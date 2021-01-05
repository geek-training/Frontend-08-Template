const regexp = /([0-9\.]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
const dictionary = ["Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"];

function tokensize(source) {
  let result = null;
  while(true) {
    result = regexp.exec(source);

    if (!result) break;

    console.log("result", result);

    for (let i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        console.log(dictionary[i-1]);
      }
    }
    console.log(result);
  }
}

tokensize("1024 + 10 * 25");
