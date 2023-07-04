<script type="ts">
export default {
    props: {
        moreExists: {
            type: boolean,
            default: true,
        }
    }
}
</script>

<template>
    <div class="backfill" v-if="more">loading older messages</div>
</template>

<style scoped>
.backfill {
    max-width: 50em;
    margin: 0 auto;
    padding: 1em;
}
</style>
