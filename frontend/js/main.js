import { app, h } from "https://unpkg.com/hyperapp@2.0.3"
import { Http, Interval } from "https://unpkg.com/hyperapp-fx@next?module"
import moment from "https://unpkg.com/moment@2.27.0/dist/moment.js"

const html = hyperx(h)


const RecvDeadline = (state, resp) => (Tick({ // confirmed that doing it like this only causes one redraw, and after all these sync function calls. Ie if Tick skips us straight to `finished`, we don't ever try to draw `running`.
    ...state,
    deadline: moment(resp.deadline),
    mode: "running",
}));

const RecvQuotes = (state, resp) => (ChangeQuote({
    ...state,
    quotes: resp.quotes, // TODO separate state machine
}));

const Tick = function (state, time) {
  switch(state.mode) {
    case "running": // TODO should be able to assert this when the timer is codictional
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
    default: // unconfigured, finished.
      return state;
  }
}

const Finish = function (state) {
  console.log("COUNTDOWN FINISHED")
  return {
    ...state,
    mode: "finished"
  }
}

const ChangeQuote = function (state, time) {
  return {
    ...state,
    quote: randomElement(state.quotes),
  }
}

function renderDuration(d) {
  let units = ["years", "months", "days", "hours", "minutes", "seconds"]
  return units.map(u => d.get(u) + '\xa0' + u).join(", ")
}

function viewFn(state) {
  switch (state.mode) {
    case "unconfigured":
      return html`<div>En attendant config ⏱</div>`
      break;
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

const randomElement = (qs) => qs[Math.round(Math.random() * (qs.length - 1))]

const initialState =
{
  mode: "unconfigured",
  deadline: null,
  quotes: null,
};

app({
  init: [
    initialState,
    Http({url: "http://localhost:3000/deadline", response: "json", action: RecvDeadline, }),
    Http({url: "http://localhost:3000/quotes", response: "json", action: RecvQuotes, }),
  ],
  subscriptions: state => [
    Interval({ every: 1000, action: Tick }),
    Interval({ every: 1000*10*60, action: ChangeQuote }),
  ],
  view: viewFn,
  node: document.getElementById("app")
})
