import { onMounted, onBeforeUnmount, Ref } from "vue";

export function useClickOutside(
  el_target: Ref<HTMLElement>,
  callback: () => void
) {
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
      return;
    }
    if (typeof callback == "function") {
      callback();
    }
  }

  onMounted(() => {
    window.addEventListener("click", onClickItem);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("click", onClickItem);
  });
}
