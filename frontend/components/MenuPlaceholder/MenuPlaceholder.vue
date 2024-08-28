<script lang="ts">
export default{
    name:"MenuPlaceholder",
    props:{
        selectedConvo: Boolean,
    }
}
</script>
<template>
    <div id="NO_MESSAGES" >
            <p v-if="!selectedConvo" class="center">  Click on a Menu Item to get started!</p>
        
    </div>
</template>
<style scoped>
#NO_MESSAGES {
    grid-column-start: 2;
    grid-column-end: 2;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
}
.center{
    grid-column-start: 1;
    grid-row-start: 1;
    align-self: center;
    justify-self: center;
}

@media screen and (width <=700px) {
    #NO_MESSAGES{
        display:none;
    }
}

</style>