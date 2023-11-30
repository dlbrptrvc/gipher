body = document.body;
html = document.documentElement;

const bottomVisible = () =>
  html.clientHeight + window.scrollY >=
  (html.scrollHeight || html.clientHeight);

console.log("On load:", bottomVisible());

function fillPageWithGifs() {
  fetch(
    "https://api.giphy.com/v1/gifs/trending?api_key=wLCv5l1DHz3a3580HH8ro4cmSTD816IB&limit=25&offset=0&rating=g&bundle=messaging_non_clips"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      response.data.forEach((item) => {
        pasteImage(item.images.original.url);
      });
      console.log("After gifs:", bottomVisible());
    });
}

function pasteImage(str) {
  let img = document.createElement("img");
  img.src = str;
  images.append(img);
}

fillPageWithGifs();
