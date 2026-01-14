<script lang="ts" setup>
    import menuItems from '@/assets/data/menu-items.json';

    function openMenu(e: any) {
        let submenu = e.target.closest('.menu').querySelectorAll('.submenu')[0];
        if (submenu.classList.contains('hidden')) {
            submenu.classList.remove('hidden');
            submenu.setAttribute('aria-expanded', 'true');
        } else {
            submenu.classList.add('hidden')
            submenu.setAttribute('aria-expanded', 'false');
        }
    }
</script>

<template>
    <div class="w-full flex bg-slate-500 text-white px-4">
        <NuxtLink to="/" class="p-8">Poké TCG Hub</NuxtLink>
        <div class="grow"></div>
        <!-- Generate menu items from the array -->
        <template v-for="menu in menuItems" :key="menu.title">
            <div class="menu p-8 relative cursor-pointer" @click="openMenu($event)" aria-haspopup="true">
                {{ menu.title }}
                <div class="submenu hidden absolute top-[100%] bg-slate-600 right-0" role="menu" aria-expanded="false">
                    <NuxtLink
                        v-for="item in menu.items"
                        :key="item.path"
                        class="block px-8 py-4"
                        :to="item.path"
                    >
                        {{ item.label }}
                    </NuxtLink>
                </div>
            </div>
        </template>
    </div>
</template>