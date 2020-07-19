import { app, h } from 'hyperapp';
import { Http, Interval } from 'hyperapp-fx';
import moment from 'moment';
import './hlnl.css';


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
  console.assert(state.mode === "running", {state}, "Should only Tick when running");

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
      return <div>En attendant config ⏱</div>
      break;
    case "running":
      return <div>
        <p class="timer">{renderDuration(state.remaining)}</p>
        <p class="quote">{state.quote}</p>
      </div>
      break;
    case "finished":
      return <div>Nous sommes arivées 🎉</div>
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
    state.mode === "running" && Interval({ every: 1000, action: Tick }),
    state.mode === "running" && Interval({ every: 1000*10*60, action: ChangeQuote }),
  ],
  view: viewFn,
  node: document.getElementById("app")
})
