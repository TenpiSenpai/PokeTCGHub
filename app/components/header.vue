<script lang="ts" setup>
/**
 * Header Component - Refactored for Enterprise Architecture
 * Main navigation header with dropdown menus
 */

import { ref } from 'vue';

/**
 * Menu state management
 */
const activeMenu = ref<'en' | 'jp' | null>(null);

/**
 * Toggles menu open/closed
 */
function toggleMenu(menu: 'en' | 'jp'): void {
  activeMenu.value = activeMenu.value === menu ? null : menu;
}

/**
 * Closes menu
 */
function closeMenu(): void {
  activeMenu.value = null;
}

/**
 * Handle keyboard navigation
 */
function handleKeyDown(event: KeyboardEvent, menu: 'en' | 'jp'): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleMenu(menu);
  } else if (event.key === 'Escape') {
    closeMenu();
  }
}
</script>

<template>
  <header class="w-full bg-slate-500 text-white" role="banner">
    <nav class="flex items-center px-4" aria-label="Main navigation">
      <!-- Logo/Brand -->
      <div class="p-8">
        <NuxtLink to="/" class="text-white hover:text-gray-200 transition-colors">
          Poké TCG Hub
        </NuxtLink>
      </div>

      <!-- Spacer -->
      <div class="grow"></div>

      <!-- EN Releases Menu -->
      <div class="menu relative">
        <button
          type="button"
          class="cursor-pointer p-8 hover:bg-slate-600 transition-colors"
          :aria-expanded="activeMenu === 'en'"
          aria-haspopup="true"
          aria-controls="en-menu"
          @click="toggleMenu('en')"
          @keydown="handleKeyDown($event, 'en')"
        >
          Upcoming EN Releases
        </button>
        <div
          v-show="activeMenu === 'en'"
          id="en-menu"
          class="submenu absolute right-0 top-[100%] bg-slate-600 shadow-lg"
          role="menu"
          aria-label="English releases"
        >
          <NuxtLink
            class="block px-8 py-4 hover:bg-slate-700 transition-colors"
            to="/sets/en/perfect-order"
            role="menuitem"
            @click="closeMenu"
          >
            Perfect Order
          </NuxtLink>
          <NuxtLink
            class="block px-8 py-4 hover:bg-slate-700 transition-colors"
            to="/sets/en/ascended-heroes"
            role="menuitem"
            @click="closeMenu"
          >
            Ascended Heroes
          </NuxtLink>
        </div>
      </div>

      <!-- JP Releases Menu -->
      <div class="menu relative">
        <button
          type="button"
          class="cursor-pointer p-8 hover:bg-slate-600 transition-colors"
          :aria-expanded="activeMenu === 'jp'"
          aria-haspopup="true"
          aria-controls="jp-menu"
          @click="toggleMenu('jp')"
          @keydown="handleKeyDown($event, 'jp')"
        >
          Upcoming JP Releases
        </button>
        <div
          v-show="activeMenu === 'jp'"
          id="jp-menu"
          class="submenu absolute right-0 top-[100%] bg-slate-600 shadow-lg"
          role="menu"
          aria-label="Japanese releases"
        >
          <NuxtLink
            class="block px-8 py-4 hover:bg-slate-700 transition-colors"
            to="/sets/jp/nihil_zero"
            role="menuitem"
            @click="closeMenu"
          >
            Nihil Zero
          </NuxtLink>
          <NuxtLink
            class="block px-8 py-4 hover:bg-slate-700 transition-colors"
            to="/sets/jp/start_deck_100_2025"
            role="menuitem"
            @click="closeMenu"
          >
            Start Deck 100
          </NuxtLink>
          <NuxtLink
            class="block px-8 py-4 hover:bg-slate-700 transition-colors"
            to="/sets/jp/megadream"
            role="menuitem"
            @click="closeMenu"
          >
            MEGA Dream ex
          </NuxtLink>
          <NuxtLink
            class="block px-8 py-4 hover:bg-slate-700 transition-colors"
            to="/sets/jp/assorted_jp"
            role="menuitem"
            @click="closeMenu"
          >
            Other JP Cards
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.submenu {
  min-width: 200px;
  z-index: 50;
}
</style>
