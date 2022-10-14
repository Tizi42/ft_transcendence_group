<template>
  <div class="botChat" ref="toScrollBot">
    <TransitionGroup name="fadeEmote">
      <div v-for="item in messages" :key="item.content">
        <div class="author">
          {{ item.author }}
        </div>
        <div class="message">
          {{ item.content }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { getUrlOf } from "@/router";
import { Chat } from "@backend/chat/entities/chat.entity";
import { defineComponent, defineExpose, defineProps, onBeforeMount } from "vue";
import { Ref, ref, onUpdated } from "vue";

interface Props {
  message: Chat | null;
}

interface SimpleChat {
  content: string;
  author: string;
}

const props: Readonly<Props> = defineProps<Props>();
const messages: Ref<Array<SimpleChat>> = ref([]);
const toScrollBot: Ref<HTMLElement | undefined> = ref();

onBeforeMount(() => {
  if (props.message == null) return;
  addItem(props.message.content, props.message.author.username);
});

function addItem(content: string, author: string) {
  console.log(author, ":", content);
  messages.value.push({ content: content, author: author });
}

function scrollBot() {
  if (toScrollBot.value != undefined) {
    toScrollBot.value.scrollTo(0, toScrollBot.value.scrollHeight);
  }
}

async function getUsername(id: number): Promise<string> {
  let response: Response;
  response = await fetch(getUrlOf("api/users/username/" + id), {
    credentials: "include",
  });
  return "@" + (await response.text());
}

onUpdated(async () => {
  if (props.message == null) return;
  let content = props.message.content;
  let author = await getUsername(props.message.author);
  addItem(content, author);
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
  display: block;
  position: fixed;
  bottom: 110px;
  left: 10px;
  height: 300px;
  width: 300px;
  background-color: blue;
  overflow: scroll;
  scroll-behavior: smooth;
}
</style>
