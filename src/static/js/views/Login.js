import createAbstractView from "../AbstractView.js";

async function generateUUID() {
  const data = new Uint8Array(16);
  await crypto.getRandomValues(data);

  data[6] = (data[6] & 0x0f) | 0x40;
  data[8] = (data[8] & 0x3f) | 0x80;

  const hex = Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-4${hex.substr(
    13,
    3
  )}-a${hex.substr(17, 3)}-${hex.substr(20)}`;
}

export default function Login(params) {
  let view = createAbstractView(params);

  // call the function to generate a UUID

  view.setTitle("Log In");

  view.onMount = async function () {
    const jit = await generateUUID();

    console.log("JIT", jit);
    const loginForm = document.getElementById("login-submit");
    if (loginForm != null) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        let formData = new FormData(loginForm);
        let email = formData.get("email");
        let password = formData.get("userpassword");
        const errbox = document.getElementById("errorBox");
        if (email && password) {
          // TODO: add more filters to the password input
          const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
              jit: jit,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.status === 200) {
            console.log("RESPONSE", response);
            window.location.href = "/";
          }
        }
      });
    }
  };

  view.getHtml = function () {
    return Promise.resolve(`
    <form id="login-submit">

    <div class="border-b-2 border-black transition-all duration-150 ease-in-out">
      <div class="w-full py-2 text-center">
        <label class="px-4 font-bold">Log In</label>
      </div>
      <div id="errorBox" class="text-xs w-full px-4 text-red-600 text-center"></div>
    </div>
      
      <div class="w-full mb-4 border-b-2 border-black maincolor">
        
        <div class="px-4 py-2 maincolor border-b-2 border-black flex flex-row">
            <input id="email" name="email" rows="4" class="w-full px-0 text-sm text-black maincolor focus:outline-none" placeholder="Email" type="email" required />
        </div>
        <div class="px-4 py-2 maincolor flex flex-row">
            <input id="userpassword" name="userpassword" rows="4" class="w-full px-0 text-sm text-black maincolor focus:outline-none" placeholder="Password" required type="password"/>
        </div>
      </div>

      <div class="flex justify-center">
        <button class="border-2 border-black px-4 py-2 font-semibold hover:bg-[#d1c7b7]" type="submit">Log In</button>
      </div>
    </form>
    `);
  };

  return view;
}
