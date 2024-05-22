import Home from "./views/Home.js";
import Login from "./views/Login.js";
import PostView from "./views/PostView.js";
import Settings from "./views/Settings.js";
import Signup from "./views/Signup.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

export const navigateTo = (url) => {
  if (location.pathname === url) {
    console.log(url, "ROUTER NAVIGATE DONT PUSH");
    history.replaceState(null, null, url);
  } else {
    console.log(url, "ROUTER NAVIGATE PUSH");
    history.pushState(null, null, url);
  }
  router();
};

const router = async () => {
  // client routes
  const routes = [
    { path: "/", view: Home },
    { path: "/posts/:id", view: PostView },
    { path: "/settings", view: Settings },
    { path: "/signup", view: Signup },
    { path: "/login", view: Login },
  ];


  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });
  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  const params = getParams(match);
  const view = match.route.view(params);

  document.querySelector("#app").innerHTML = await view.getHtml();
  if (typeof view.onMount === "function") {
    view.onMount();
    // TEXT AREA RESIZE
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute(
        "style",
        "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
      );
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
      this.style.height = 0;
      this.style.height = this.scrollHeight + "px";
    }
  }
  // TEXT AREA REISE END
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      if (e.target.getAttribute("href") !== window.location.pathname) {
        navigateTo(e.target.href);
      }
    }
  });

  router();
});
