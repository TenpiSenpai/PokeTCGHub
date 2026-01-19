<script setup>
import menuItems from '@/assets/data/menu-items.json'
</script>

<template>
    <div class="p-8">
        <NuxtRouteAnnouncer />
        <h2 class="text-2xl">Poké TCG Hub</h2>

        <div v-for="(menuGroup, index) in menuItems" :key="index">
            <h2 class="text-xl">{{ menuGroup.title }}</h2>
            <ul>
                <li v-for="(item, itemIndex) in menuGroup.items" :key="itemIndex">
                    <NuxtLink class="block px-8 py-4 underline text-blue-600" :to="item.path">{{
                        item.label
                    }}</NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>
