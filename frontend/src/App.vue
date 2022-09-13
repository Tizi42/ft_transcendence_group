<template>
  <div class="nav-container">
    <nav id="navbar">
      <router-link to="/">
        <div class="barTag">
          <img src="@/assets/icons/barTag.svg" alt="icon Bar Tag" />
        </div>
        <div class="link-container">
          <img src="@/assets/icons/pingpong.svg" alt="icon PingPong" />
        </div>
      </router-link>
      <router-link to="chat">
        <div class="link-container">
          <img src="@/assets/icons/chat.svg" alt="icon Chat" />
        </div>
      </router-link>
      <router-link to="user">
        <div class="link-container">
          <img src="@/assets/icons/profile.svg" alt="icon User" />
        </div>
      </router-link>
    </nav>
  </div>
  <router-view />
</template>
