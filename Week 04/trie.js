const endChar = Symbol("$");
class Trie {
  constructor() {
    this.root = Object.create(null);
  }

  insert(word) {
    let node = this.root;
    for (let c of word) {
      if (!node[c]) {
        node[c] = Object.create(null);
      }
      node = node[c];
    }
    if (!(endChar in node)) {
      node[endChar] = 0;
    }
    node[endChar]++;
  }

  most() {
    let max = 0;
    let maxWord = null;
    let visit = (node, word) => {
      if (node[endChar] && node[endChar] > max) {
        max = node[endChar];
        maxWord = word;
      }
      for (let p in node) {
        visit(node[p], word + p);
      }
    };
    visit(this.root, "");
    console.log(maxWord, max);
  }
}

function randomWord(length) {
  let randomStr = "";
  for (let i = 0; i < length; i++) {
    randomStr += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0));
  }
  return randomStr;
}

let trie = new Trie();
for (let i = 0; i < 10000; i++) {
  trie.insert(randomWord(4));
}
