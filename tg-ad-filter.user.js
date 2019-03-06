// ==UserScript==
// @name        Telegram Ad Filter
// @version     0.1.0
// @description Minimizes messages that contain words from the filter
// @license     MIT
// @author      VChet
// @namespace   Telegram-Ad-Filter
// @include     https://web.telegram.org/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==
"use strict";

const startScript = () => {
  let messages = document.querySelectorAll(".im_history_message_wrap");
  if (messages.length === messagesLength || messages.length === 0) return;
  messagesLength = messages.length;
  console.log({ messagesLength });
  messages.forEach(message => {
    if (adWords.some(v => message.innerText.indexOf(v) >= 0 )) {
      message = message.querySelector(".im_message_body");
      message.classList.add("advertisementMessage");
      message.onclick = () => message.classList.toggle("advertisementMessage");
    }
  });
}

const eventThrottler = delay => {
  if (!eventTimeout) {
    eventTimeout = setTimeout(() => {
      eventTimeout = null;
      startScript();
    }, delay);
  }
};

GM_addStyle(`
  .advertisementMessage {
    max-height: 40px;
  }
  .advertisementMessage > div:before {
    color: dodgerblue;
    font-weight: bold;
    text-decoration: underline dotted;
    content: "Advertisement";
  }
`);

const defaultList = [
  "#взаимопиар",
  "#партнерский",
  "#постпроплачен",
  "#реклама",
  "#рекламныйпост",
  "#текстприслан",
];

let adWords = GM_getValue("ad-words", defaultList);

GM_registerMenuCommand("Filter list", () => {
  const wordList = GM_getValue("ad-words", adWords);
  const val = prompt("Enter words to filter, separated by comma:", wordList);
  if (val !== null && typeof val === "string") {
    adWords = val.split(",");
    GM_setValue("ad-words", val.split(","));
  }
});

let messagesLength;
let eventTimeout;
let delay = 3000;
// Run the script when an API message is received, throttled with delay
window.addEventListener("message", () => eventThrottler(delay), false);