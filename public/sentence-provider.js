/* global axios */
const qandaEndpoint = "https://koma.lib.id/qanda-api@dev/";

class SentenceProvider {
  constructor(qanda) {
    this.qanda = qanda;
  }
  
  async get() {
    let languageIdentifier = this.qanda.currentLanguageIdentifier();
    
    let params = {language: languageIdentifier};
    
    return (await axios.get(qandaEndpoint, {params: params})).data;
  }
}