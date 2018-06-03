const _ = require('underscore');
const nlp = require('compromise');

/**
* Black out a random word from a sentence. 
* @returns {object}
*/
module.exports = async (sentence = "") => {
  let sentenceTerms = nlp(sentence).out('terms');

  let sentenceDict = {
    before: "",
    blackedOutWord: undefined,
    after: ""
  };
  
  sentenceTerms = _.filter(sentenceTerms, (term) => {
    return term.normal !== "";
  });
    
  let blackedOutIndex = getRandomInt(0, sentenceTerms.length - 1); 
  
  _.each(sentenceTerms, (term, index)=> {    
    if(index < blackedOutIndex) {
      sentenceDict.before += term.text;
      
      if(index !== (blackedOutIndex - 1)) {
        sentenceDict.before += " ";
      }
    } else if(index > blackedOutIndex) {
      sentenceDict.after += term.text;
      
      if((sentenceTerms.length - 1) !== index) {
        sentenceDict.after += " ";
      }
    } else if(index === blackedOutIndex) {
      var termText = term.text;
      
      let nonWordCharsRegex = /^(\W*)([^\W]+)(\W*)$/u;
      let matchResult = nonWordCharsRegex.exec(termText);
      
      sentenceDict.before += matchResult[1];
      sentenceDict.blackedOutWord = matchResult[2];
      sentenceDict.after += matchResult[3];
    }
  });
  
  return sentenceDict;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//const tokenizer = require('sbd');
const nlp = require('compromise');
const _ = require('underscore');
var sanitizeHtml = require('sanitize-html');
var decodeHtml = require('decode-html');

/**
* Get a random sentence from provided text. 
* @returns {object.http}
*/
module.exports = async (text = "") => {  

  //var sentences = tokenizer.sentences(text, {'sanitize': true});
  var sentencesDoc = nlp(sanitizeHtml(text, {allowedTags: []})).sentences();
  
  sentences = sentencesDoc.list.map(ts => {
    return ts.terms.map(t =>{
      return t.text
    });
  });
  
  if(sentences.length === 0) {
    return {
      headers: {status: 500},
      body: "No sentences found in the provided text."
    };
  }

  
  let sentence = _.sample(sentences);
  let tries = 0;
  while(sentence.length < 5 && tries < 5) {
    sentence = _.sample(sentences);
    tries++;
  }
  
  if(sentence.length < 5) {
    return {
      headers: {status: 500},
      body: "No sentence with more than 5 terms found."
    };
  }
  
  joinedAndDecodedSentence = decodeHtml(sentence.join(' '));
   return {
    headers: {'Content-Type': 'application/json'},
    body: joinedAndDecodedSentence
  };
};

const axios = require('axios');
const _ = require('underscore');

const randomWikipediaArticleApiEndpoint = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=extracts&grnlimit=1";

/**
* Random wikipedia article contents
* @returns {object}
*/
module.exports = async () => {  
  var apiResponse = await axios.get(randomWikipediaArticleApiEndpoint);
  var page = _.values(apiResponse.data['query']['pages'])[0];
  var response = {};
  
  response['text'] = page['extract'];
  response['title'] = page['title'];
  response['wikipediaId'] = page['pageid'];

  return response;
};