export default function createAbstractView(params) {
  let self = {
    params: params,
    setTitle: function (title) {
      document.title = title;
    },
    getHtml: function () {
      return Promise.resolve("");
    },
  };
  return self;
}
