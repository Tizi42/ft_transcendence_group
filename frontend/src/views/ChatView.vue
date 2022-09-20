<template>
  <div class="chatPage">
    <h1>This is the CHAT page</h1>
    <div class="chatroom">
      <div class="box list">
        <div
          class="block"
          v-for="(prof, index) in profileFrom"
          :key="index"
          @click="renderCorresponding(prof)"
        >
          <img :src="prof.picture" class="photo select" />
          <div class="infos">
            <p id="userinfos">
              {{ prof.username }}
            </p>
            <p id="messagelist">
              {{ lastMessage[index] }}
            </p>
          </div>
        </div>
      </div>
      <MessagesView :chosenProfile="chosenProfile"></MessagesView>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref, defineComponent } from "vue";
import socket from "../socket";
import MessagesView from "../components/MessagesView.vue";

const lastMessage: Ref<any> = ref([]);
const profile: Ref<any> = ref("");
const profileFrom: Ref<Array<any>> = ref([]);
const chosenProfile: Ref<any> = ref("");

export default defineComponent({
  async created() {
    await fetch("http://localhost:3000/api/private", {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((user) => {
        profile.value = user;
      })
      .catch((error) => {
        console.log(error);
      });
    socket.emit("all_dest", (response: any[]) => {
      this.getAllDest(response);
    });
  },
  methods: {
    getAllDest(response: any[]) {
      let dest: any[];
      dest = response;
      for (let i = 0; i < dest.length; i++) {
        if (dest[i].dest.id !== 1) {
          profileFrom.value.push(dest[i].dest);
          this.getLastMessage(dest[i].dest.id);
        }
      }
      chosenProfile.value = profileFrom.value[profileFrom.value.length - 1];
    },
    getLastMessage(id: number) {
      socket.emit("last_message", id, (response: any) => {
        lastMessage.value.push(response.content);
      });
    },
    renderCorresponding(prof: any) {
      console.log("before = ", chosenProfile.value);
      chosenProfile.value = prof;
      console.log("after = ", chosenProfile.value);
    },
  },
});
</script>

<script lang="ts" setup></script>

<style>
.chatPage {
  background: linear-gradient(
    116.6deg,
    #005f3e -20.9%,
    #feca00 99.99%,
    #ffda00 100%
  );
  height: 100vh;
  width: 100vw;
  padding-top: 2em;
  padding-bottom: 5em;
  display: flex;
  flex-direction: column;
}
.chatroom {
  display: flex;
  flex-direction: row;
  height: 80%;
  width: 100%;
}
.box {
  overflow-y: scroll;
  scroll-behavior: smooth;
  background: #1e2b02;
  border-radius: 22px;
  overflow: auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
  height: 100%;
  margin-right: 1%;
}
.list {
  width: 15%;
  margin-left: 5%;
}
.photo {
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 80px;
  margin-top: 2%;
  margin-left: 2%;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
}
.block {
  cursor: pointer;
  background: #005f3e;
  box-shadow: 2px 2px 2px 2px rgba(1, 53, 28, 0.527);
  display: flex;
  flex-direction: row;
}
.block:active {
  background-color: #feca00;
}
#messagelist {
  margin-left: 5%;
  font-size: 10px;
}
.infos {
  width: 50%;
}
#userinfos {
  font-family: "Outfit SemiBold";
  font-size: 10px;
  color: white;
  padding-right: 40%;
}
</style>
