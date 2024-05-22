import createAbstractView from "../AbstractView.js";
export default function Signup(params) {
  let view = createAbstractView(params);

  view.setTitle("Sign Up");

  view.onMount = function () {
    const signupForm = document.getElementById("signup-submit");
    if (signupForm != null) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("SUBMIT CLIECKED");

        let formData = new FormData(signupForm);
        let email = formData.get("email");
        let password = formData.get("userpassword");
        let password2 = formData.get("userpassword2");
        const errbox = document.getElementById("errorBox");
        if (email && password && password2) {
          if (password != password2) {
            if (errbox != null) {
              errbox.innerHTML = "password does not match";
            }
          } else {
            // TODO: add more filters to the password input
            const response = await fetch("/api/signup", {
              method: "POST",
              body: JSON.stringify({
                email: email,
                password: password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              return res.json();
            });

            if (response.code === "SUCCESS") {
              console.log("RESPONSE", response);
              window.location.href = "/login";
            } else if (response.code === "EMAIL_IN_USE") {
              if (errbox != null) {
                errbox.innerHTML = "email already exists!";
              }
            } else if (response.code === "FAIL") {
              if (errbox != null) {
                errbox.innerHTML = "bad bad bad";
              }
            }
          }
        }
      });
    }
  };

  view.getHtml = function () {
    return Promise.resolve(`
    
    <form id="signup-submit">

    <div class="border-b-2 border-black transition-all duration-150 ease-in-out">
      <div class="w-full py-2 text-center">
        <label class="px-4 font-bold">Sign up</label>
      </div>
      <div id="errorBox" class="text-xs w-full px-4 text-red-600 text-center"></div>
    </div>
      
      <div class="w-full mb-4 border-b-2 border-black maincolor">
        
        <div class="px-4 py-2 maincolor border-b-2 border-black flex flex-row">
            <input id="email" name="email" rows="4" class="w-full px-0 text-sm text-black maincolor focus:outline-none" placeholder="Email" type="email" required />
        </div>
        <div class="px-4 py-2 maincolor border-b-2 border-black flex flex-row">
            <input id="userpassword" name="userpassword" rows="4" class="w-full px-0 text-sm text-black maincolor focus:outline-none" placeholder="Password" required type="password"/>
        </div>
        <div class="px-4 py-2 maincolorborder-black flex flex-row">
            <input id="userpassword2" name="userpassword2" rows="4" class="w-full px-0 text-sm text-black maincolor focus:outline-none" placeholder="Confirm Password" required type="password"/>
        </div>
      </div>

      <div class="flex justify-center">
        <button class="border-2 border-black px-4 py-2 font-semibold hover:bg-[#d1c7b7]" type="submit">Sign Up</button>
      </div>
    </form>
    `);
  };

  return view;
}
