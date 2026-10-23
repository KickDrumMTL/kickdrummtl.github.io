// Lightbox for posters, merch and photos. A link with data-lightbox opens its href in a
// dialog; links sharing the same data-lightbox value form one set (buttons, arrow keys, swipe).
// Without JS the link just opens the image.
(() => {
  let dialog, img, caption, count, prev, next;
  let set = [];
  let index = 0;
  let opener = null;

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", "Image viewer");
    dialog.innerHTML = `
      <figure>
        <img alt="">
        <figcaption><span class="lb-caption"></span><span class="lb-count"></span></figcaption>
      </figure>
      <button class="button lb-close" type="button" aria-label="Close">×</button>
      <button class="button lb-prev" type="button" aria-label="Previous image">‹</button>
      <button class="button lb-next" type="button" aria-label="Next image">›</button>`;
    document.body.append(dialog);

    img = dialog.querySelector("img");
    caption = dialog.querySelector(".lb-caption");
    count = dialog.querySelector(".lb-count");
    prev = dialog.querySelector(".lb-prev");
    next = dialog.querySelector(".lb-next");

    dialog.querySelector(".lb-close").addEventListener("click", () => dialog.close());
    prev.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));

    // a click on the dark area around the picture closes it
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });

    let startX = null;
    let startY = 0;
    dialog.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse") return;
      startX = e.clientX;
      startY = e.clientY;
    });
    dialog.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    });

    dialog.addEventListener("close", () => {
      img.removeAttribute("src");
      if (opener) opener.focus();
    });
  }

  function show(i) {
    index = (i + set.length) % set.length;
    const link = set[index];
    const thumb = link.querySelector("img");
    img.src = link.href;
    img.alt = thumb ? thumb.alt : "";
    caption.textContent = link.dataset.caption || "";
    count.textContent = set.length > 1 ? `${index + 1} / ${set.length}` : "";
    prev.hidden = next.hidden = set.length < 2;

    // load the neighbours so stepping through feels instant
    if (set.length > 1) {
      for (const d of [-1, 1]) new Image().src = set[(index + d + set.length) % set.length].href;
    }
  }

  function step(d) {
    if (set.length > 1) show(index + d);
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-lightbox]");
    if (!link || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (!dialog) build();
    const name = link.dataset.lightbox;
    set = [...document.querySelectorAll("a[data-lightbox]")].filter((a) => a.dataset.lightbox === name);
    opener = link;
    show(set.indexOf(link));
    dialog.showModal();
  });
})();
