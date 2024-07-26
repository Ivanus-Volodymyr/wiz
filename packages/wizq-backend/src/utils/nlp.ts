import { LancasterStemmer, TfIdf, WordTokenizer } from 'natural';

export const nlp = (
  data: { name: string }[],
  description: string,
  match: 'exact' | 'partial',
) => {
  const stemmer = LancasterStemmer;

  const tokenizer = new WordTokenizer();
  let names;

  if (match === 'exact') {
    names = data.map((item) => stemmer.stem(item.name.split(' ')[0]));
  } else {
    names = data.map((item) => stemmer.stem(item.name));
  }

  const tfidf = new TfIdf();
  names.forEach((name, index) => {
    tfidf.addDocument(tokenizer.tokenize(name.toLowerCase()), String(index));
  });

  const tokens = tokenizer
    .tokenize(stemmer.stem(description.toLowerCase()))
    .map((token) => stemmer.stem(token));

  const matches = [];

  tfidf.tfidfs(tokens, function (i, measure) {
    if (measure > 0) {
      matches.push({
        name: data[i].name,
        relevance: measure,
      });
    }
  });

  matches.sort((a, b) => b.relevance - a.relevance);

  return data.filter((dataItem) =>
    matches.map((item) => item.name).includes(dataItem.name),
  );
};
