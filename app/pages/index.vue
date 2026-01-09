<template>
  <div class="p-8">
    <NuxtRouteAnnouncer />
      <h2 class="text-2xl">Poké TCG Hub</h2>
      
      <h2 class="text-xl">Upcoming English Sets</h2>
      <ul>
        <li><NuxtLink class="block px-8 py-4 underline text-blue-600" to="/sets/en/perfect-order">Perfect Order</NuxtLink></li>
        <li><NuxtLink class="block px-8 py-4 underline text-blue-600" to="/sets/en/ascended-heroes">Ascended Heroes</NuxtLink></li>
      </ul>
      <h2 class="text-xl">Upcoming Japanese Sets</h2>
      <ul>
        <li><NuxtLink class="block px-8 py-4 underline text-blue-600" to="/sets/jp/nihil_zero">Nihil Zero</NuxtLink></li>
        <li><NuxtLink class="block px-8 py-4 underline text-blue-600" to="/sets/jp/start_deck_100_2025">Start Deck 100</NuxtLink></li>
        <li><NuxtLink class="block px-8 py-4 underline text-blue-600" to="/sets/jp/megadream">MEGA Dream ex</NuxtLink></li>
        <li><NuxtLink class="block px-8 py-4 underline text-blue-600" to="/sets/jp/assorted_jp">Other JP Cards</NuxtLink></li>
      </ul>
  </div>
</template>
