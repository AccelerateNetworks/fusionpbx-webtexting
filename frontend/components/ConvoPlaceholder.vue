<script lang="js">
export default{
    name:'ConvoPlaceholder',
}

</script>
<template>
    <div id="CONVERSATION_PLACEHOLDER" >
        
    </div>
</template>

<style>
#CONVERSATION_PLACEHOLDER{
    grid-column-start: 2;
grid-column-end: 2;
height: 83vh;
}

#conversation{
    grid-column-start: 2;
    grid-column-end: 2;
}

@media screen and (width <=700px){
    #conversation{ 
        display: none;
    }

}
</style>