<template>
  <div class="login-form">
    <input
      v-model="email"
      class="input"
      type="text"
      required="true"
      placeholder="Enter your email here"
      autofocus
    />
    <input type="button" value="log in" class="button" @click="onSubmit" />
  </div>
</template>

<script lang="ts" setup defer>
import { getUrlOf } from "@/router";
import { ref, defineComponent, defineExpose } from "vue";

let email = ref("user2@student.42.fr");

function onSubmit() {
  window.location.href =
    getUrlOf("api/auth/dev-only") + "?email=" + email.value;
}

defineExpose(
  defineComponent({
    name: "DevLogin",
  })
);
</script>

<style scoped>
.login-form {
  display: flex;
  font-size: 26px;
  position: fixed;
  width: 600px;
  z-index: 997;
  top: 30%;
  left: 50%;
  margin-left: -300px;
  font-family: "Outfit";
  font-weight: bold;
  font-size: 30px;
}
.input {
  all: unset;
  width: 80%;
  height: 42px;
  font-family: "Outfit";
  color: rgba(30, 42, 2, 1);
  background: white;
  box-shadow: inset 0px 0px 4px 3px rgb(0 0 0 / 25%);
  border-radius: 12px;
  border: none;
  line-height: 1.5em;
  margin: 10px 10px 10px 10px;
}

::placeholder {
  color: rgba(30, 42, 2, 1);
  opacity: 1;
}
.button {
  margin-left: auto;
  margin-right: 0px;
  align-self: center;
  height: 42px;
  font-family: "Outfit";
  font-weight: bold;
  font-size: 26px;
  border-radius: 12px;
  color: white;
  background-color: rgb(51, 71, 3);
}
.button:hover {
  cursor: pointer;
  transform: scale(1.1, 1.1);
}
</style>
