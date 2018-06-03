/* global SentenceProvider, LanguageSwitcher */

class Qanda {
  constructor() {
    this.domRoot = undefined;
    this.domElements = {};
    this.languageSwitcher = new LanguageSwitcher(this.nextQuestion.bind(this));
    this.sentenceProvider = new SentenceProvider(this);
    this.createDom();
    this.insertDom();
    
    this.points = 0;
  }
  
  currentLanguageIdentifier() {
    return this.languageSwitcher.currentLanguageIdentifier();
  }
  
  createDom() {
    this.domRoot = document.createElement('div');
    this.domRoot.classList.add('blacked-out-sentence');
    this.domElements.title = document.createElement('h4');
    this.domElements.paragraph = document.createElement('p');
    this.domElements.sentenceBefore = document.createElement('span');
    this.domElements.blackedOutWordInput = document.createElement('input');
    this.domElements.blackedOutWordInput.classList.add('blacked-out-input');
    this.domElements.sentenceAfter = document.createElement('span');
    this.domElements.submitButton = document.createElement('button');
    this.domElements.submitButton.innerText = 'Check';
    
    this.bindEvents();
    
    this.domRoot.appendChild(this.domElements.title);
    this.domElements.paragraph.appendChild(this.domElements.sentenceBefore);
    this.domElements.paragraph.appendChild(this.domElements.blackedOutWordInput);
    this.domElements.paragraph.appendChild(this.domElements.sentenceAfter);
    this.domRoot.appendChild(this.domElements.paragraph);
    this.domRoot.appendChild(this.domElements.submitButton);
  }
  
  bindEvents() {
    let submitHandler = this.submitHandler.bind(this);
    this.domElements.submitButton.addEventListener('click', submitHandler);
    this.domElements.blackedOutWordInput.addEventListener('keydown', submitHandler);
  }
  
  submitHandler(e) {
    if(e.type === 'keydown' && e.which !== 13) return;
    this.checkAnswer();
    this.nextQuestion();
  }
  
  checkAnswer() {
    if(this.domElements.blackedOutWordInput.value === this.blackedOutWord) {
      this.points++;
      alert(`Correct answer, ${this.points} points`);
    } else {
      this.points = 0;
      alert(`Wrong answer, correct answer would've been ${this.blackedOutWord}`);
    }
  }
  
  nextQuestion() {
    this.domRoot.classList.add('loading')
    this.domElements.blackedOutWordInput.value = "";
    this.loadQuestion(()=> {
      this.domRoot.classList.remove('loading');
      this.domElements.blackedOutWordInput.focus();
    });
  }
  
  getDom() {
    return this.domRoot;
  }
  
  loadQuestion(callback) {
    this.sentenceProvider.get().then((sentence)=> {
      this.domElements.title.innerText = sentence.articleTitle;
      this.domElements.sentenceBefore.innerText = sentence.sentence.before + " ";
      this.domElements.sentenceAfter.innerText = " " + sentence.sentence.after;
      this.blackedOutWord = sentence.sentence.blackedOutWord;
      callback();
    });
  }
  
  insertDom() {
    let main = document.getElementsByTagName('main')[0];
    main.appendChild(this.getDom());
  }
}

Qanda.LOCALE = {
  en: {
    explanation: "Guess the word that is missing from the sentence.",
    check: "Check"
  },
  de: {
    explanation: "Errate das das fehlende Wort im Satz.",
    check: "Überprüfen"
  }
}

let qanda = new Qanda();
qanda.nextQuestion();