<template>
    <h2 class="text-2xl p-8 border-b">Start Deck 100</h2>
    <div class="p-8">
        <h3 class="text-2xl">Start Deck 100 Battle Collection</h3>
        <p>Expected JP Release Date: December 19th</p>
        <p>Cards: 742 including reprints</p>
    </div>
    <card-list set="jp_mc" :excludeTypes="false" />
    <div class="p-8">
        <h3 class="text-2xl">Start Deck 100 Battle Collection - Promotional Deck</h3>
        <p>Expected JP Release Date: December 19th</p>
        <p>Cards: 23 including reprints</p>
    </div>
    <card-list set="jp_mp1" :excludeTypes="true" />
</template>