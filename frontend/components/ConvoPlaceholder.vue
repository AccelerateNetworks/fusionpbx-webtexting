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

/* these are for conversation which we are sidestepping for now */


.thread {
    height:80vh;
    margin: 0 auto;
    border-left: solid #3178b1 2px;
    border-right: solid #3178b1 2px;
    border-bottom: solid #3178b1 2px;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    padding-left: 0.5em;
    padding-right: 0.5em;

    /* stupid hack to get the text entry box to display inside the bounds of the thread */
    display: flex;
    flex-direction: column;
}

.thread-header {
    margin: 0 auto;
    padding: 1em;
    background-color: #3178b1;
    color: #fff;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    font-weight: bold;
}

.message-container {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    margin-bottom: 0.5em;
}

.backfill {
    max-width: 50em;
    margin: 0 auto;
    padding: 1em;
}

.white {
    color: white;
}

td:active{
    background-color:#3178B1;
    color:white;
}
td:hover{
    background-color: aliceblue;
}
table {
    width: 100%;
    table-layout: fixed;
}
    
.timestamp {
    color: #999;
    font-size: 8pt;
    padding-left: 0.5em;
}
.thread-name {
    font-size: 12pt;
    color: #000;
}
.thread-name:active{
    color:white;
}
.thread-last-message {
    color: #000;
}
.thread-last-message:active {
    color: #fff;
}
td {
    border: solid #3178b1;
    border-radius: 1em;
    padding: 0.25em;
    margin-bottom: 0.5em;
    min-height: calc(50px + 1em);
}
table {
    width: 100%;
    table-layout: fixed;
}
@media screen and (width <=700px){
    #conversation{ 
        display: none;
    }

}
</style>