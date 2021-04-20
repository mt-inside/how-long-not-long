import { app } from 'hyperapp';
import h from 'hyperapp-jsx-pragma';
import { Http, Interval } from 'hyperapp-fx';
import moment from 'moment';
import './hlnl.css';

// anything that's not directly rendered, and doesn't change, is stored here.
let config = null;

const Configure = function (state, resp) {
    config = resp
    config.deadline = moment(config.deadline)

    return Tick(ChangeQuote({...state, mode: "running"}))
}

const Tick = function (state, _time) {
  console.assert(state.mode === "running", {state}, "Should only Tick when running");

  let r = config.deadline.diff(moment())
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

const ChangeQuote = function (state, _time) {
  return {
    ...state,
    quote: randomElement(config.quotes),
  }
}

function renderDuration(d, shrt) {
  let units = ["years", "months", "days", "hours", "minutes", "seconds"]
  /* no zip(), hence this mess */
  let nz_vals = units
    .map(u => [u, d.get(u)])
    .filter(([u, n]) => n != 0);

  if (shrt) {
    return nz_vals
          .map(([u, n]) => n + u[0])
          .join("");
  } else {
    return nz_vals
          .map(([u, n]) => n + "\xa0" + u)
          .join(", ");
  }
}

function viewFn(state) {
  switch (state.mode) {
    case "running":
      /* This is really meant to be a pure function and not have these kinda side effects 🤷‍♀️ */
      document.title = renderDuration(state.remaining, true);

      return <div>
        <p class="target">{config.target}</p>
        <p class="timer">{renderDuration(state.remaining, false)}</p>
        <p class="quote">{state.quote}</p>
      </div>
      break;
    case "finished":
      return <div>Nous sommes arivées par {config.target} 🎉</div>
      break;
  }
}

const randomElement = (qs) => qs[Math.round(Math.random() * (qs.length - 1))]

const initialState =
{ // schema:
  mode: "unconfigured",
  remaining: null,
  quote: null,
};

app({
  init: [
    initialState,
    // Can't `import` this because it'll get bundled so can't be overridden in the container filesystem
    Http({url: `/config/config.json`, response: "json", action: Configure, }), // run this effect as a side-effect of startup
  ],
  subscriptions: state => [
    state.mode === "running" && Interval({ every: 1000, action: Tick }),
    state.mode === "running" && Interval({ every: 1000*10*60, action: ChangeQuote }),
  ],
  view: viewFn,
  node: document.getElementById("app")
})
