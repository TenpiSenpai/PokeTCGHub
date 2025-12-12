<script lang="ts" setup>
    function openMenu(e: any) {
        let submenu = e.target.closest('.menu').querySelectorAll('.submenu')[0];
        if (submenu.classList.contains('hidden')) {
            submenu.classList.remove('hidden');
        } else {
            submenu.classList.add('hidden')
        }
    }
</script>
<template>
    <div class="w-full flex bg-slate-500 text-white px-4">
        <div class="p-8">Poké TCG Hub</div>
        <div class="grow"></div>
        <div class="menu p-8 relative cursor-pointer" @click="openMenu($event)">
            Upcoming EN Releases
            <div class="submenu hidden absolute top-[100%] bg-slate-600 right-0">
                <NuxtLink class="block px-8 py-4" to="/sets/en/ascended-heroes">Ascended Heroes</NuxtLink>
            </div>
        </div>
        <div class="menu p-8 relative cursor-pointer" @click="openMenu($event)">
            Upcoming JP Releases
            <div class="submenu hidden absolute top-[100%] bg-slate-600 right-0">
                <NuxtLink class="block px-8 py-4" to="/sets/jp/megadream">MEGA Dream ex</NuxtLink>
                <NuxtLink class="block px-8 py-4" to="/sets/jp/start_deck_100_2025">Start Deck 100</NuxtLink>
                <NuxtLink class="block px-8 py-4" to="/sets/jp/assorted_jp">Other JP Cards</NuxtLink>
            </div>
        </div>
    </div>
</template>