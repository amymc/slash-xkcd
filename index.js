const url = require("url");
const fetch = require("isomorphic-fetch");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

const getComic = number => {
  const queryUri = `http://xkcd.com/${
    number ? number : getRandomInt(1, 2025)
  }/info.0.json`;
  return fetch(queryUri).then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  });
};

module.exports = async request => {
  const query = url.parse(request.url, true).query;
  const comicInfo = await getComic(query.text);

  return {
    parse: "full",
    response_type: "ephemeral",
    text: `${comicInfo.img}`,
    attachments: [
      {
        image_url: `${comicInfo.img}`
      }
    ],
    unfurl_media: true,
    unfurl_links: true
  };
};
