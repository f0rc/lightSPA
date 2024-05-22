import createAbstractView from "../AbstractView.js";

export default function Home(params) {
  let view = createAbstractView(params);

  view.setTitle("Home");

  view.onMount = async function () {
    // SET TODAY'S DATE AS DEFAULT TITLE
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const titleInput = document.getElementById("title");
    if (titleInput != null) {
      titleInput.value = date;
    }

    //POST FORM SUBMMITION
    const posts = document.getElementById("post-form");
    if (posts != null) {
      posts.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(posts);
        let body = formData.get("comment");
        let title = formData.get("title");

        if (!body || !title) {
          console.log("SOMETHING WENT WRONG");
        } else {
          const post = await fetch("/api/createpost", {
            method: "POST",
            body: JSON.stringify({ title: title, body: body }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (post.status === 200) {
            window.location.reload();
          }
        }
      });
    }

    // inject posts into the page:
    const postList = await fetch("/api/posts").then((res) => res.json());
    const postDiv = document.getElementById("post-list");
    if (postDiv != null) {
      let postHTML = "";
      if (!postList.posts || postList.posts.length === 0) {
        postHTML = `<h1 class="text-center font-semibold text-2xl">No posts yet</h1>`;
      } else {
        postList.posts.forEach((element) => {
          postHTML += `<a class="w-full px-4 py-2 flex flex-col hover:bg-amber-100 cursor-pointer" href="posts/${element.id}">
          <h1 class="font-semibold border-b border-black">${element.title}</h1>
          <p class="text-ellipsis whitespace-pre-wrap  line-clamp-3">${element.body}</p>
          </a>`;
        });
      }

      postDiv.innerHTML = postHTML;
    }
  };

  view.getHtml = async function () {
    return Promise.resolve(`  
    
    
    <form id="post-form">
            <div id="errorBox" class="text-xs w-full px-4 pt-2 text-red-600"></div>
            <div class="w-full mb-4 border-b-2 border-black maincolor">
            
                <div class="px-4 py-2 maincolor border-b-2 border-black">
                    <input id="title" name="title" rows="4" class="w-full px-0 text-sm text-black maincolor focus:outline-none" placeholder="Title:" required></textarea>
                </div>
                <div class="px-4 py-2 maincolor">
                    <textarea id="comment" name="comment" rows="4" class="focus:outline-none w-full px-0 text-sm text-black maincolor" placeholder="Write a comment..." required></textarea>
                </div>
                <div class="flex items-center justify-between px-3 py-2">
                    <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                        Post comment
                    </button>
                    <div class="flex pl-0 space-x-1 sm:pl-2">
                        <button type="button" class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Attach file</span>
                        </button>
                        <button type="button" class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Set location</span>
                        </button>
                        <button type="button" class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Upload image</span>
                        </button>
                    </div>
                </div>
            </div>
          </form>

      <div id="post-list" class="w-full flex flex-col">
        
      </div>
    `);
  };

  return view;
}
