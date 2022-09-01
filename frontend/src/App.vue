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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav-container {
  position: absolute;
  width: 102px;
  height: 100%;
  left: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
}

#navbar {
  background-color: rgba(0, 95, 62, 1);
  border-radius: 0 8px 8px 0;
  transform: translateX(calc(-100% + 10px));
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  justify-content: center;
}

.nav-container:hover #navbar {
  transform: translateX(0);
  transition-delay: 0s;
}

.link-container {
  font-size: 18px;
  width: 100%;
  height: 200px;
  margin: auto;
  display: flex;
}

.link-container img {
  margin: auto;
}

nav a.router-link-exact-active {
  background-color: rgba(1, 71, 47, 1);
  height: 200px;
}

body {
  margin: 0;
}

.nav-container,
.nav-container * {
  box-sizing: border-box;
}
</style>
