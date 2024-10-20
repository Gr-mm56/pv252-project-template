const template = document.createElement("template");
template.innerHTML = `
<style>
#list {
  height: var(--height);
  width: var(--width);  
  border: var(--border);
  padding: var(--padding);
  overflow: scroll;
  scrollbar-width: none;
}
#spacer-top {
  width: 100%;
  height: 0px;
}
#spacer-bottom {
  width: 100%;
  height: 1000px;
}
</style>
<div id="list">
  <div id="spacer-top"></div>
  <slot></slot>
  <div id="spacer-bottom"></div>
</div>
`;

export type Renderer<T> = (item: T) => HTMLElement;

export class LazyList<T> extends HTMLElement {
  // By default, the list renders the items as div-s with strings in them.
  #renderFunction: Renderer<T> = (item) => {
    const element = document.createElement("div");
    element.innerText = JSON.stringify(item);
    return element;
  };

  // These could be useful properties to consider, but not mandatory to use.
  // Similarly, feel free to edit the shadow DOM template in any way you want.

  // By default, the list is empty.
  #data: T[] = [];
  #visible_items: number = 3; // I decided to show 3 items at a time.
  #itemHeight: number = 370;
  // The index of the first visible data item.
  #visiblePosition: number = 0;

  // The amount of space that needs to be shown before the first visible item.
  #topOffset: number = 0;
  #topOffsetElement: HTMLElement;
  // The amount of space that needs to be shown after the last visible item.
  #bottomOffset: number = 0;
  #bottomOffsetElement: HTMLElement;

  // The container that stores the spacer elements and the slot where items are inserted.
  #listElement: HTMLElement;

  static register() {
    customElements.define("lazy-list", LazyList);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#topOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-top")!;
    this.#bottomOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-bottom")!;
    this.#listElement = this.shadowRoot.querySelector<HTMLElement>("#list")!;

    this.#listElement.onscroll = () => {
      this.#scrollPositionChanged(this.#listElement.scrollTop);
    };
    this.#contentChanged();
  }

  setData(data: T[]) {
    this.#data = data;
    this.#contentChanged();
  }

  setRenderer(renderer: Renderer<T>) {
    this.#renderFunction = renderer;
    this.#contentChanged();
  }

  #contentChanged() {
    this.innerHTML = "";    // Clear the list.
    const start = this.#visiblePosition; // The index of the first visible item.
    const end = Math.min(start + this.#visible_items, this.#data.length); // The index after the last visible item.
    for (let i = start; i < end; i++) {
      this.appendChild(this.#renderFunction(this.#data[i]));
    }
    this.#topOffset = start * this.#itemHeight; // The amount of space that needs to be shown before the first visible item.
    this.#bottomOffset = (this.#data.length - end) * this.#itemHeight; // The amount of space that needs to be shown after the last visible item.
    this.#updateSpacerElements();
  }

  #updateSpacerElements() {
    this.#topOffsetElement.style.height = `${this.#topOffset}px`;
    this.#bottomOffsetElement.style.height = `${this.#bottomOffset}px`;
  }

  #scrollPositionChanged(topOffset: number) {
    const newIndex = Math.floor(topOffset / this.#itemHeight); // calculate the index of the first visible item.
    if (newIndex !== this.#visiblePosition) { // check for a change.
      this.#visiblePosition = newIndex; // Update the index of the first visible item.
      this.#contentChanged();
    }
  }
}
