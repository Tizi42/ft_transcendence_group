<template>
  <div class="chat">
    <div class="container-channels">
      <NavChat
        @selectedNav="handleSelectedNav"
        @resetReceiver="handleSelectedReceiver"
        @clearHistory="handleHistory"
      />
      <FriendsList
        v-if="isActive === 'players'"
        @selectReceiver="handleSelectedReceiver"
        @getHistory="handleHistory"
        :user="user"
      />
      <ChannelsList v-else />
    </div>
    <div class="container-chat">
      <form
        class="search-in-my-channels"
        @submit.prevent="onSubmit"
        v-if="isActive === 'channels'"
      >
        <div id="div-search-all-channels">
          <input
            class="input-search-channels"
            id="input-search-all-channels"
            type="text"
            placeholder="Search all channels..."
            v-model="inputSearch"
          />
          <button type="submit">
            <img src="@/assets/icons/search.svg" />
          </button>
        </div>
      </form>
      <HistoryMessages
        :history="history"
        :target="receiverProfile"
        :isActive="isActive"
      />
      <MessageInput :user="user" :receiver="receiver" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount, defineComponent, defineExpose } from "vue";
import { useUserStore } from "@/stores/user";
import "@/assets/styles/chat.css";
import NavChat from "@/components/chat/NavChat.vue";
import FriendsList from "@/components/chat/FriendsList.vue";
import ChannelsList from "@/components/chat/ChannelsList.vue";
import HistoryMessages from "@/components/chat/HistoryMessages.vue";
import MessageInput from "@/components/chat/MessageInput.vue";
import { getUrlOf } from "@/router";
import { User } from "@backend/users/users.entity";

const user: any = useUserStore();
const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const history: Ref<Array<any>> = ref([]);
const receiverProfile: Ref<any> = ref(null);

const handleSelectedNav = (event: string) => {
  isActive.value = event;
};

const handleSelectedReceiver = async (event: number) => {
  receiver.value = event;
  if (receiver.value != -1) {
    await fetch(getUrlOf("api/users/info/" + receiver.value))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        receiverProfile.value = data;
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  } else {
    receiverProfile.value = null;
  }
};

const handleHistory = (event: Array<any>) => {
  history.value = event;
};

onBeforeMount(async () => {
  user.doFetchFriends();
});

defineExpose(
  defineComponent({
    name: "ChatView",
  })
);
</script>
