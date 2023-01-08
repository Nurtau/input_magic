const input = document.getElementById("input_field");
const slots = document.querySelector(".slots");

window.addEventListener("load", registerServiceWorker);

function registerServiceWorker() {
  if (!window.navigator.serviceWorker) return;

  window.navigator.serviceWorker.register("/sw.js");
}

let renderer;

input.addEventListener("input", addItems);

function addItems(event) {
  event.preventDefault();

  renderer?.destroy();
  let number = parseInt(input.value);

  if (!isNaN(number)) {
    renderer = new VirtualListRenderer(90, slots, number, 4);
    renderer.setup();
  } else if (input.value === "") {
    slots.innerHTML = "";

    let html = `
            <div class="item">
                <h1>It's me again</h1>
            </div>`;
    slots.insertAdjacentHTML("beforeend", html);
  }
}

class VirtualListRenderer {
  constructor(itemHeight, root, maxNumber, overscan) {
    this.itemHeight = itemHeight;
    this.root = root;
    this.maxNumber = maxNumber;
    this.overscan = overscan;
  }

  onWindowScroll = () => {
    const { top } = this.root.getBoundingClientRect();
    const rootVisibileHeight = window.innerHeight - Math.max(0, top);

    let visibleStartNumber = top < 0 ? Math.floor(-top / this.itemHeight) : 0;
    let visibleNumberLength = Math.ceil(rootVisibileHeight / this.itemHeight);

    const visibleEndNumber = Math.min(
      this.maxNumber,
      visibleStartNumber + visibleNumberLength + this.overscan
    );
    visibleStartNumber = Math.max(0, visibleStartNumber - this.overscan);

    const offsetTop = visibleStartNumber * this.itemHeight;
    const offsetBottom = (this.maxNumber - visibleEndNumber) * this.itemHeight;

    this.root.innerHTML = "";

    this.insertDiv({ height: offsetTop });

    for (let i = visibleStartNumber; i <= visibleEndNumber; i++) {
      this.insertDiv({ className: "item", content: `<h1>${i}</h1>` });
    }

    this.insertDiv({ height: offsetBottom });
  };

  insertDiv({ className, content, height }) {
    const div = document.createElement("div");

    if (content) {
      div.innerHTML = content;
    }

    if (className) {
      div.classList.add(className);
    }

    if (height) {
      div.style.height = `${height}px`;
    }

    this.root.appendChild(div);
  }

  setup() {
    this.onWindowScroll();
    window.addEventListener("scroll", this.onWindowScroll);
  }

  destroy() {
    window.removeEventListener("scroll", this.onWindowScroll);
  }
}
