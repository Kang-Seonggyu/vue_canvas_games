<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="80">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="/game.png" />
          </q-avatar>
          <span style="margin-left: 10px">Canvas Games</span>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="justify">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-route-tab to="/" label="Home" />
        <q-route-tab to="/DinoGame" label="Dino-Game" />
        <q-route-tab to="/BreakOutGame" label="BreakOut-Game" />
        <q-route-tab to="/MarioGame" label="Mario-Game" />
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay elevated>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      behavior="desktop"
      elevated
    >
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
</script>

<style scoped>
section {
  flex: 1;
}
</style>
