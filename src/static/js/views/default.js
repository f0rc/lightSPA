import createAbstractView from "../AbstractView.js";
export default function Posts(params) {
  let view = createAbstractView(params);

  view.setTitle("Posts");

  view.onMount = async function () {
    console.log("MONEY");
  };

  view.getHtml = function () {
    return Promise.resolve(`
    <h1>Posts view pagesss</h1>
    `);
  };

  return view;
}
