let counter = 0;

let observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      counter++;
      if (counter >= 2) {
        if (textinput.value !== "") {
          searchGifs(convert(textinput.value));
        } else {
          addGifs();
        }
      }
    }
  });
});

let offset = 0;
const limit = 15;
let controller = new AbortController();
let signal = controller.signal;

function addGifs() {
  fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=wLCv5l1DHz3a3580HH8ro4cmSTD816IB&limit=${limit}&offset=${offset}&rating=g&bundle=messaging_non_clips`,
    { signal },
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      offset += limit;
      if (images.lastChild) {
        observer.unobserve(images.lastChild);
      }
      response.data.forEach((item) => {
        pasteImage(item.images.original.url);
      });
      observer.observe(images.lastChild);
    });
}

let timeout = {};

function pasteImage(src) {
  let img = document.createElement("img");
  img.src = src;
  // COPY URL
  img.addEventListener("click", (event) => {
    clearTimeout(timeout);
    navigator.clipboard.writeText(event.target.src);
    msg.style.display = "inline";
    msg.style.top = event.clientY + "px";
    msg.style.left = event.clientX + "px";
    timeout = setTimeout(() => {
      msg.style.display = "none";
    }, 1500);
  });
  images.append(img);
}

addGifs();

textinput.addEventListener("input", (event) => {
  clearScreen();
  controller.abort();
  controller = new AbortController();
  signal = controller.signal;
  counter = 0;
  offset = 0;
  let str = convert(event.target.value);
  if (str !== "") {
    searchGifs(str);
  } else {
    addGifs();
  }
});

function searchGifs(str) {
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=wLCv5l1DHz3a3580HH8ro4cmSTD816IB&q=${str}&limit=${limit}&offset=${offset}&rating=g&lang=en&bundle=messaging_non_clips`,
    { signal },
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })

    .then(function (response) {
      offset += limit;
      if (images.lastChild) {
        observer.unobserve(images.lastChild);
      }
      response.data.forEach((item) => {
        pasteImage(item.images.original.url);
      });
      observer.observe(images.lastChild);
    })
    .catch(function (response) {});
}

function convert(str) {
  return str.replace(" ", "+");
}

function clearScreen() {
  images.querySelectorAll("*").forEach((item) => {
    item.removeAttribute("src");
    item.remove();
  });
}
