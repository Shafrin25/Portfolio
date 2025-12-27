interact("[data-id]")
  .draggable({
    ignoreFrom: ".resize-handle, .rotate-handle",
    listeners:{
      move(e){
        if (typeof frozen !== "undefined" && frozen) return;

        const t = e.target;
        t.dataset.x = (+t.dataset.x || 0) + e.dx;
        t.dataset.y = (+t.dataset.y || 0) + e.dy;

        t.style.transform =
          `translate(${t.dataset.x}px, ${t.dataset.y}px) rotate(${t.dataset.rotate || 0}deg)`;
      }
    }
  })
  .resizable({
    edges:{ left:true, right:true, top:true, bottom:true },
    listeners:{
      move(e){
        if (typeof frozen !== "undefined" && frozen) return;

        const t = e.target;

        /* resize size */
        t.style.width  = e.rect.width  + "px";
        t.style.height = e.rect.height + "px";

        /* 🔑 critical fix: adjust translate */
        t.dataset.x = (+t.dataset.x || 0) + e.deltaRect.left;
        t.dataset.y = (+t.dataset.y || 0) + e.deltaRect.top;

        t.style.transform =
          `translate(${t.dataset.x}px, ${t.dataset.y}px) rotate(${t.dataset.rotate || 0}deg)`;
      }
    }
  });
interact(".rotate-handle").draggable({
  listeners:{
    move(e){
      if (typeof frozen !== "undefined" && frozen) return;

      const box = e.target.parentElement;
      box.dataset.rotate = (+box.dataset.rotate || 0) + e.dx;

      box.style.transform =
        `translate(${box.dataset.x || 0}px, ${box.dataset.y || 0}px) rotate(${box.dataset.rotate}deg)`;
    }
  }
});
