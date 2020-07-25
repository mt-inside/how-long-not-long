import { app, h } from 'hyperapp';
import { Http, Interval } from 'hyperapp-fx';
import moment from 'moment';
import './hlnl.css';

const backend = "https://hlnl-be.frogstar-a.empty.org.uk"


const RecvDeadline = (state, resp) => Tick({ // confirmed that doing it like this only causes one redraw, and after all these sync function calls. Ie if Tick skips us straight to `finished`, we don't ever try to draw `running`.
    ...state,
    deadline: moment(resp.deadline),
    mode: "running",
});

const RecvQuotes = (state, resp) => ChangeQuote({
    ...state,
    quotes: resp, // TODO separate state machine
});

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
    quote: randomElement(state.quotes).quote,
  }
}

function renderDuration(d, shrt) {
  let units = ["years", "months", "days", "hours", "minutes", "seconds"]

  if (shrt) {
    return units.map(u => d.get(u) + u[0]).join("")
  } else {
    return units.map(u => d.get(u) + '\xa0' + u).join(", ")
  }
}

function viewFn(state) {
  switch (state.mode) {
    case "unconfigured":
      return <div>En attendant config ⏱</div>
      break;
    case "running":
      /* This is really meant to be a pure function and not have these kinda side effects 🤷‍♀️ */
      document.title = renderDuration(state.remaining, true);

      return <div>
        <p class="timer">{renderDuration(state.remaining, false)}</p>
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
    Http({url: `${backend}/deadline`, response: "json", action: RecvDeadline, }),
    Http({url: `${backend}/quotes`, response: "json", action: RecvQuotes, }),
  ],
  subscriptions: state => [
    state.mode === "running" && Interval({ every: 1000, action: Tick }),
    state.mode === "running" && Interval({ every: 1000*10*60, action: ChangeQuote }),
  ],
  view: viewFn,
  node: document.getElementById("app")
})
