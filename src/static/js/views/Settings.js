import createAbstractView from "../AbstractView.js";
export default function Settings(params) {
  let view = createAbstractView(params);

  view.setTitle("Settings");

  view.getHtml = function () {
    return Promise.resolve(`
    <h1>settings view page</h1>
    `);
  };

  return view;
}
