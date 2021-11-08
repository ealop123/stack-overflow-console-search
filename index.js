(async () => {
  const $ = (str, dom = document) => [...dom.querySelectorAll(str)];
  async function fetchDOM(url) {
    const res = await fetch(url);
    const txt = await res.text();
    const parser = new DOMParser();
    return parser.parseFromString(txt, "text/html");
  }
  for (let page = 21; page < 41; page++) {
    const dom = await fetchDOM(
      "https://stackoverflow.com" +
      "/questions/tagged/javascript" +
      `?sort=newest&filters=noanswers&page=${page}&pagesize=15`
    );
    const summaries = $(".question-summary", dom);
    const filtered = summaries.filter(el => {
      let repTxt = undefined;
      try {
        repTxt = $(".reputation-score", el)[0].innerText;
      } catch (e) {
        console.error(el);
        console.log($(".reputation-score", el)[0]);
        repTxt = "20";
      }
      const rep = +repTxt.replace(/\D/g, "");
      if (rep > 30) return false;

      const voteTxt = $(".vote-count-post", el)[0].innerText;
      if (voteTxt.includes("-")) return false;
      const vote = +voteTxt.replace(/[^\d-]/g, "");
      // if (vote < 1) return false;

      const tags = $(".post-tag", el);
      const tagsTxt = tags.map(el => el.innerText?.toLowerCase());
      const validTxt = [
        "javascript", "html", "css", "js", "flexbox", "if-statement",
        "jquery", "package.json", "onclick", "algorithm", "function",
        "truncate", "google-chrome-extension", "puppeteer", "heroku",
        "node", "asynchronous", "async-await", "fetch-api",
        "use-effect",
      ];
      const allTxtIsValid = tagsTxt.every(txt => validTxt.includes(txt));
      if (!allTxtIsValid) return false;

      //all tests passed
      return true;
    });
    filtered.forEach(el => {
      console.log(`
score: ${$(".vote-count-post", el)[0].innerText}
rep: ${$(".reputation-score", el)[0].innerText}
tags: ${$(".post-tag", el).map(e => e.innerText).join(", ")}
${$(".question-hyperlink", el)[0].innerText}
${$(".question-hyperlink", el)[0].href}
        `);
    });
    console.log("page");
  }
})();
