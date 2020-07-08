import moment from "https://unpkg.com/moment@2.27.0/dist/moment.js"
import { h, app } from "https://unpkg.com/hyperapp@2.0.3"
import { interval } from "https://unpkg.com/@hyperapp/time@0.0.10"

const html = hyperx(h)


const Tick = function (state, time) {
  switch(state.mode) {
    case "running":
      let r = state.deadline.diff(moment())
      if (r < 0) {
        return Finish(state)
      }
      else
      {
        return {
          ...state,
          remaining: moment.duration(r)
        }
      }
      break;
    default:
      return state;
  }
}

const Quote = function (state, time) {
  return {
    ...state,
    quote: randomQuote(),
  }
}

const Finish = function (state) {
  console.log("COUNTDOWN FINISHED")
  return {
    ...state,
    mode: "finished"
  }
}


function renderDuration(d) {
  let units = ["years", "months", "days", "hours", "minutes", "seconds"]
  return units.map(u => d.get(u) + '\xa0' + u).join(", ")
}

function viewFn(state) {
  switch (state.mode) {
    case "running":
      return html`
      <div>
        <p class="timer">${renderDuration(state.remaining)}</p>
        <p class="quote">${state.quote}</p>
      </div>`
      break;
    case "finished":
      return html`<div>Nous sommes arivées 🎉</div>`
      break;
  }
}

const quotes = [ // TODO: from a lambda?
    `How long? Not long. 'Cause what you reap, is what you sow`,
    `Sed fugit interea, fugit inreparabile tempus`,
    `Gather ye Rose-buds while ye may,
    Old Time is still a-flying:
    And this same flower that smiles to day,
    To morrow will be dying.`,
]
const randomQuote = () => quotes[Math.round(Math.random() * (quotes.length - 1))] 

const initialState =
{
  mode: "running",
  deadline: moment("2020-08-22 00:00:00+01:00"), // TODO from where??
};

app({
  init: [
    initialState,
    [ (d, p) => d(Tick), {} ],
    [ (d, p) => d(Quote), {} ],
  ],
  subscriptions: state => [
    state.mode === "running" && interval(Tick, { delay: 1000 }),
    interval(Quote, { delay: 1000 * 10 * 60 }),
  ],
  view: viewFn,
  node: document.getElementById("app")
})
