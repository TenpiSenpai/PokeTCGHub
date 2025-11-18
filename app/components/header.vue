<script lang="ts" setup>
    function openMenu(e: any) {
        console.log(e);
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
            Upcoming JP Releases
            <div class="submenu hidden absolute top-[100%] bg-slate-600 right-0 px-8 py-4">
                <NuxtLink to="/sets/megadream">MEGA Dream ex</NuxtLink>
            </div>
        </div>
    </div>
</template>