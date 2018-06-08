class MultipleChoice {
  constructor(choices, answerProvidedCallback) {
    this.answerProvidedCallback = answerProvidedCallback;
    this.choices = choices;
    this.domRoot = undefined;
    this.domElements = {};
    this.createDom();
  }
  
  createDom() {
    this.domElements.choicesList = document.createElement('div');
    this.domElements.choicesList.classList.add('choices');
    this.domRoot = this.domElements.choicesList;
    
    this.choices.forEach((choice) => {
      this.domElements.choice = document.createElement('div');
      this.domElements.choice.classList.add('choice');
      this.domElements.choice.innerText = choice.word;
      this.domElements.choicesList.appendChild(this.domElements.choice);
      this.domElements.choice.addEventListener('click', () => {
        this.answerProvidedCallback(choice.correctAnswer);
      });
    });
  }
  
  getDom() {
    return this.domRoot;
  }
  
  focus() {
    this.domRoot.focus();
  }
}