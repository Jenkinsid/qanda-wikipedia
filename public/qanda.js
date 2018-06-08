/* global SentenceProvider, LanguageSwitcher, MultipleChoice */

class Qanda {
  constructor() {
    this.domRoot = undefined;
    this.domElements = {};
    
    let language = window.location.pathname.slice(1, 3);
    if(!Object.values(LanguageSwitcher.LANGUAGES).includes(language)) language = undefined;
    
    this.languageSwitcher = new LanguageSwitcher(this.localeWasChanged.bind(this), language);
    this.sentenceProvider = new SentenceProvider(this);
    this.createDom();
    this.insertDom();
    
    this.translate();
    
    this.points = 0;
  }
  
  localeWasChanged() {
    this.nextQuestion();
    this.translate();
  }
  
  translate() {
    document.querySelectorAll("[data-translation]").forEach((element) => {
      element.innerText = Qanda.LOCALE[this.currentLanguageIdentifier()][element.dataset.translation];
    });
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
    this.domElements.blackedOutWordInputContainer = document.createElement('div');
    this.domElements.blackedOutWordInputContainer.classList.add('blacked-out-input-container');
    this.domElements.sentenceAfter = document.createElement('span');
        
    this.domRoot.appendChild(this.domElements.title);
    this.domElements.paragraph.appendChild(this.domElements.sentenceBefore);
    this.domElements.paragraph.appendChild(this.domElements.blackedOutWordInputContainer);
    this.domElements.paragraph.appendChild(this.domElements.sentenceAfter);
    this.domRoot.appendChild(this.domElements.paragraph);
  }
  
  submitHandler(e) {
    if(e.type === 'keydown' && e.which !== 13) return;
    this.checkAnswer();
    this.nextQuestion();
  }
  
  checkAnswer(correctAnswer) {
    if(correctAnswer) {
      this.points++;
      alert(Qanda.LOCALE[this.currentLanguageIdentifier()]['correctAnswer'](this.points));
    } else {
      this.points = 0;
      alert(Qanda.LOCALE[this.currentLanguageIdentifier()]['wrongAnswer'](this.blackedOutWord));
    }
  }
  
  nextQuestion() {
    this.domRoot.classList.add('loading')
    this.loadQuestion(()=> {
      this.domRoot.classList.remove('loading');
      this.currentMultipleChoice.focus();
    });
  }
  
  getDom() {
    return this.domRoot;
  }
  
  loadQuestion(callback) {
    this.sentenceProvider.get().then((sentence)=> {
      this.currentMultipleChoice = new MultipleChoice(sentence.choices, this.answerProvided.bind(this));
      this.replaceBlackedOutInput(this.currentMultipleChoice.getDom());
      this.domElements.title.innerText = sentence.articleTitle;
      this.domElements.sentenceBefore.innerText = sentence.sentence.before + " ";
      this.domElements.sentenceAfter.innerText = " " + sentence.sentence.after;
      this.blackedOutWord = sentence.sentence.blackedOutWord;
      callback();
    });
  }
  
  answerProvided(isCorrectAnswer) {
    this.checkAnswer(isCorrectAnswer);
    this.nextQuestion();
  }
  
  replaceBlackedOutInput(inputDom) {
    this.domElements.blackedOutWordInputContainer.innerHTML = '';
    this.domElements.blackedOutWordInputContainer.appendChild(inputDom);
  }
  
  insertDom() {
    let main = document.getElementsByTagName('main')[0];
    main.appendChild(this.getDom());
  }
}

Qanda.LOCALE = {
  en: {
    explanation: "Guess the word that is missing from the sentence.",
    correctAnswer: (points) => { return `Correct answer, ${points} points` },
    wrongAnswer: (blackedOutWord) => { return `Wrong answer, correct answer would've been ${blackedOutWord}` },
    skipHint: 'Press Enter or press "Check" to skip'
  },
  de: {
    explanation: "Errate das das fehlende Wort im Satz.",
    correctAnswer: (points) => { return `Richtige Antwort, ${points} Punkte` },
    wrongAnswer: (blackedOutWord) => { return `Falsche Antwort, die richtige Antwort wäre ${blackedOutWord} gewesen` },
    skipHint: 'Drücke Enter oder klicke/tappe auf "Überprüfen" um zu überspringen'
  }
}
Qanda.LOCALE.lt = Qanda.LOCALE.en;

let qanda = new Qanda();
qanda.nextQuestion();