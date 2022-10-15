<template>
  <div class="botChat" ref="toScrollBot">
    <TransitionGroup name="fadeEmote">
      <div v-for="item in messages" :key="item.content" class="wrapMessage">
        <span class="author">
          {{ item.author }}
        </span>
        <span class="message">
          {{ item.content }}
        </span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { getUrlOf } from "@/router";
import { messageInGame } from "@backend/chat/utils/types";
import { defineComponent, defineExpose, defineProps } from "vue";
import { Ref, ref, onUpdated } from "vue";

interface Props {
  message: messageInGame | null;
}

interface SimpleChat {
  content: string;
  author: string;
}

const props: Readonly<Props> = defineProps<Props>();
const messages: Ref<Array<SimpleChat>> = ref([]);
const toScrollBot: Ref<HTMLElement | undefined> = ref();

async function addMessage(message: messageInGame | null) {
  if (message == null) return;
  messages.value.push({
    content: message.content,
    author: await getUsername(message.author),
  });
}

function scrollBot() {
  if (toScrollBot.value != undefined) {
    toScrollBot.value.scrollTo(0, toScrollBot.value.scrollHeight);
  }
}

async function getUsername(id: string): Promise<string> {
  let response: Response;
  response = await fetch(getUrlOf("api/users/username/" + id), {
    credentials: "include",
  });
  return "@" + (await response.text());
}

function getDisplay() {
  if (messages.value.length == 0) return "none";
  return "block";
}

onUpdated(async () => {
  await addMessage(props.message);
  scrollBot();
});

defineExpose(
  defineComponent({
    name: "WatchersChat",
  })
);
</script>

<style scoped>
.botChat {
  display: v-bind(getDisplay());
  position: fixed;
  bottom: 14%;
  left: 20px;
  height: fit-content;
  max-height: 300px;
  width: 25%;
  max-width: 250px;
  overflow: scroll;
  scroll-behavior: smooth;
  word-wrap: break-word;
  text-align: left;
  scrollbar-width: none;
  background: #0c1200cc;
  padding: 1em;
  border-radius: 12px;
  box-shadow: var(--main-shadow);
}

.botChat::-webkit-scrollbar {
  display: none;
}

.wrapMessage {
  margin-bottom: 10px;
}

.wrapMessage > .message {
  word-wrap: break-all;
  color: #bebebe;
}

.wrapMessage > .author {
  float: left;
  margin-right: 5px;
  color: var(--main-color);
}
</style>
