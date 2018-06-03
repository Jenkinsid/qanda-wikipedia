/* global axios */
const randWikipediaEndP = "https://koma.lib.id/qanda-api@dev/random-wikipedia-page/";
const randSentenceEndP = "https://koma.lib.id/qanda-api@dev/random-sentence/";
const blackOutWordEndP = "https://koma.lib.id/qanda-api@dev/black-out-random-word/";

class SentenceProvider {
  constructor(qanda) {
    this.qanda = qanda;
  }
  
  async get() {
    var randSentence = await this.randSentence();
    while(randSentence.status === 500 || randSentence.status === 404) {
      randSentence = await this.randSentence();
    }
    
    let blackOutWordParams = {sentence: randSentence.data};
    
    let blackedOutWord = (await axios.get(blackOutWordEndP, {params: blackOutWordParams})).data;
                                 
    return {sentence: blackedOutWord, articleTitle: this.randWikipedia.title};
  }
  
  async randSentence() {
    let languageIdentifier = this.qanda.currentLanguageIdentifier();
    
    let randWikipediaParams = {language: languageIdentifier};
    
    this.randWikipedia = (await axios.get(randWikipediaEndP, {params: randWikipediaParams})).data;
    
    let randSentenceParams = {text: this.randWikipedia['text']};

    let randSentence = await axios.get(randSentenceEndP, {params: randSentenceParams});
    
    return randSentence;
  }
}