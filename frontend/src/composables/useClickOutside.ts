import { onMounted, onBeforeUnmount } from "vue";

export function useClickOutside(el_target: any, callback: () => void) {
  if (!el_target) {
    return;
  }

  let dont_use_first_click = 0;

  function onClickItem(el: MouseEvent) {
    if (dont_use_first_click == 0) {
      dont_use_first_click++;
      return;
    }

    if (
      el.target == el_target.value ||
      el.composedPath().includes(el_target.value)
    ) {
      console.log("clicked inside of element");
      return;
    }
    if (typeof callback == "function") {
      console.log("clicked outside of element");
      callback();
    }
  }

  onMounted(() => {
    console.log("click listener added");
    window.addEventListener("click", onClickItem);
  });
  onBeforeUnmount(() => {
    console.log("click listener REMOVED");
    window.removeEventListener("click", onClickItem);
  });
}
