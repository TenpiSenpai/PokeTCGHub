<template>
    <div>
        <h2 class="text-2xl p-8 border-b">Ninja Spinner</h2>
        <div class="p-8">
            <p>Expected JP Release Date: March 13th 2025</p>
            <p>Cards: 83 before secret rares</p>
        </div>
        <card-list set="jp_m4" :exclude-types="false" />
    </div>
</template>
