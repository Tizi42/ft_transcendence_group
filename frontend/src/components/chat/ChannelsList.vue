<template>
  <div class="options-channel">
    <button id="create-new-channel" type="submit" @click="addNewChannel">
      <h3>create a new channel</h3>
      <img src="@/assets/icons/icon-add.png" alt="Create new channel" />
    </button>
  </div>
  <div
    id="list-all-channels"
    @click="getAllChannels"
    :class="{
      channelSelected: selectedChannel == -1,
      channelNotSelected: selectedChannel != -1,
    }"
  >
    <h3>All channels</h3>
  </div>
  <PendingChannelReq
    v-for="req in allMyInvite"
    :key="req"
    :channelToJoin="req"
  />
  <ul class="list-my-channels">
    <li
      v-for="channel in myChannels"
      :key="channel"
      @click="getChannelMessages(channel.id)"
      :class="{
        channelSelected: selectedChannel == channel.id,
        channelNotSelected: selectedChannel != channel.id,
      }"
    >
      <img class="groupe-img" src="@/assets/icons/groupe.png" />
      <h3>{{ channel.name }}</h3>
      <img
        v-if="channel.type === 'private'"
        class="hided_channel"
        src="@/assets/icons/hide_channel.svg"
      />
    </li>
  </ul>
  <Teleport to="body">
    <ChannelBoxModal v-if="addWindow" @hide="hide">
      <AddChannelBox :user="user" />
    </ChannelBoxModal>
  </Teleport>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  defineExpose,
  ref,
  Ref,
  defineEmits,
  defineProps,
  watch,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import ChannelBoxModal from "./ChannelBox/ChannelBoxModal.vue";
import AddChannelBox from "./ChannelBox/AddChannelBox.vue";
import socket from "@/socket";
import { userInfoStore, useUserStore } from "@/stores/user";
import PendingChannelReq from "@/components/chat/PendingChannelReq.vue";
import { getUrlOf } from "@/router";

interface Props {
  selectedChannel: number;
  user: userInfoStore;
  myChannels: any;
}

const user = useUserStore();
const props: Readonly<Props> = defineProps<Props>();
const selectedChannel: Ref<number> = ref(props.selectedChannel);
const addWindow: Ref<boolean> = ref(false);
const history: Ref<any> = ref([]);
const allMyInvite: Ref<Array<any>> = ref([]);
const emit = defineEmits(["getChannelSelected", "getHistory"]);

watch(
  () => props.selectedChannel,
  (newSelectedChannel) => {
    selectedChannel.value = newSelectedChannel;
  }
);

watch(
  () => user.channelInvitePending,
  async (newChannelInvitePending) => {
    console.log("newChannelInvitePending =", newChannelInvitePending);
    await fetch(getUrlOf("api/channel/getAll/privates"), {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        allMyInvite.value = [];
        console.log("data =", data);
        allMyInvite.value = data;
      })
      .catch((error) => {
        console.log("error :", error);
      });
  }
);

const getAllChannels = () => {
  selectedChannel.value = -1;
  emit("getChannelSelected", selectedChannel.value);
};

const getChannelMessages = async (channelId: number) => {
  selectedChannel.value = channelId;
  history.value = [];
  emit("getChannelSelected", selectedChannel.value);
  await fetch(getUrlOf("api/chat/channelMessages/" + channelId), {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      history.value = data;
    })
    .catch((err) => {
      console.error(err);
    });
  emit("getHistory", history.value);
};

const addNewChannel = () => {
  console.log("add new channel");
  addWindow.value = true;
};

function hide() {
  addWindow.value = false;
}

onBeforeMount(() => {
  socket.emit("get_all_my_channels");
  socket.on("update_channel_invite", () => {
    user.doFetch();
  });
  socket.on("receive_channel_created", () => {
    hide();
  });
  socket.on("exited_channel_list", () => {
    socket.emit("get_all_my_channels");
    getAllChannels();
  });
  socket.on("receive_channel_message", () => {
    getChannelMessages(selectedChannel.value);
  });
});

onBeforeUnmount(() => {
  socket.off("update_channel_invite");
  socket.off("receive_channel_created");
  socket.off("exited_channel_list");
  socket.off("receive_channel_message");
});

defineExpose(
  defineComponent({
    name: "ChannelsList",
  })
);
</script>
