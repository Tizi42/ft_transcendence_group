<template>
  <div class="nav-container">
    <nav id="navbar">
      <router-link to="/">
        <div class="link-container">
          <img src="@/assets/icon-pingpong-stroke.png" alt="icon PingPong" />
        </div>
      </router-link>
      <router-link to="chat">
        <div class="link-container">
          <img src="@/assets/icon-chat-stroke.png" alt="icon Chat" />
        </div>
      </router-link>
      <router-link to="user">
        <div class="link-container">
          <img src="@/assets/icon-user-stroke.png" alt="icon User" />
        </div>
      </router-link>
    </nav>
  </div>
  <router-view />
</template>
