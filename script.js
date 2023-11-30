let counter = 0;

let observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      counter++;
      if (counter >= 2) {
        observer.unobserve(entry.target);
        fillPageWithGifs();
      }
    }
  });
});

let offset = 0;
let limit = 10;

function fillPageWithGifs() {
  fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=wLCv5l1DHz3a3580HH8ro4cmSTD816IB&limit=${limit}&offset=${offset}&rating=g&bundle=messaging_non_clips`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      offset += limit;
      response.data.forEach((item, index) => {
        let img = pasteImage(item.images.original.url);
        if (index == limit - 1) {
          observer.observe(img);
        }
      });
    });
}

function pasteImage(src) {
  let img = document.createElement("img");
  img.src = src;
  img.addEventListener("click", (event) => {
    navigator.clipboard.writeText(event.target.src);
    msg.style.display = "inline";
    msg.style.top = event.clientY + "px";
    msg.style.left = event.clientX + "px";
    setTimeout(() => {
      msg.style.display = "none";
    }, 1500);
  });
  images.append(img);
  return img;
}

fillPageWithGifs();
