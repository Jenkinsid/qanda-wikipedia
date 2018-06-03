class LanguageSwitcher {
  constructor(languageChangedCallback, defaultLanguageIdentifier = 'en') {
    this.languageChangedCallback = languageChangedCallback;
    this.domRoot = undefined;
    this.defaultLanguageIdentifier = defaultLanguageIdentifier;
    this.currentLanguage = undefined;
    this.languages = [];
    this.createLanguages();
    this.createDom();
    this.insertDom();    
  }
  
  createLanguages() {
    for(var languageLabel in LanguageSwitcher.LANGUAGES) {
      let languageIdentifier = LanguageSwitcher.LANGUAGES[languageLabel];
      let language = new LanguageSwitcher.Language(languageLabel, languageIdentifier, this.languageChanged.bind(this));
      this.languages.push(language);
      
      if(languageIdentifier === this.defaultLanguageIdentifier) {
        this.currentLanguage = language;
        this.currentLanguage.activate();
      }
    }
  }
  
  languageChanged(language) {
    this.currentLanguage.deactivate();
    this.currentLanguage = language;
    this.currentLanguage.activate();
    this.languageChangedCallback();
  }
  
  currentLanguageIdentifier() {
    return this.currentLanguage.languageIdentifier;
  }
  
  createDom() {
    this.domRoot = document.createElement('p');
        
    this.languages.forEach((language) => {
      this.domRoot.appendChild(language.getDom());
    });
  }
  
  getDom() {
    return this.domRoot;
  }
  
  insertDom() {
    let target = document.getElementById('language-switcher');
    target.appendChild(this.getDom());
  }
}

LanguageSwitcher.LANGUAGES = {'English': 'en', 'Deutsch': 'de', 'Lietuvių': 'lt'};

LanguageSwitcher.Language = class {
  constructor(languageLabel, languageIdentifier, choseLanguageCallback) {
    this.languageLabel = languageLabel;
    this.languageIdentifier = languageIdentifier;
    this.choseLanguageCallback = choseLanguageCallback;
    this.createDom();
  }
  
  createDom() {
    this.domRoot = document.createElement('a');
    this.domRoot.href = '#';
    this.domRoot.innerText = this.languageLabel;
    this.bindEvents();
  }
  
  bindEvents() {
    this.domRoot.addEventListener('click', () => {
      this.choseLanguageCallback(this);
    });
  }
  
  activate() {
    this.domRoot.classList.add('active');
  }
  
  deactivate() {
    this.domRoot.classList.remove('active');
  }
  
  getDom() {
    return this.domRoot;
  }
}