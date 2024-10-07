<script lang='ts'>
import {emitter} from '../../lib/global';

export default {
    name:'MenuPreview',
    props:{
        link:{
            type:String
        },
        description:{
            type: String
        },
        name:{
            type:String
        }
    },
    methods:{
        menuLinkClickHandler(){
            console.log(this.name)
            emitter.emit("menu-change",this.name)
        }
    }
    //mounted click event emitter
}

</script>
<template>
    <div class='tr_replace' :data-displayName="this.name"  >
        <div class='td_preview' >
            <router-link :to="this.link" class="menu-link" @click="menuLinkClickHandler">
                <div class="menu-preview-container" >
                    <span class='menu-name' >{{
                        this.name }}</span>

                    <span class='menu-last-message' >{{
                        this.description }}</span>
                </div>


            </router-link>
        </div>
    </div>
</template>

<style>
.menu-name {
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row: 1;
    justify-self: start;
    color: black;
}

.timestamp {
    grid-column-start: 3;
    grid-column-end: 3;
    grid-row: 1;
    justify-self: end;
}

.menu-last-message {
    color: darkgray;
    grid-row-start: 2;
    grid-column: 1;
    justify-self: start;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.new-messages{
    grid-row:2;
    grid-column: 3;
    display: inline-block;
    justify-content: right;
    justify-self: right;
}
.new-message-alert-dot {    
         border-radius: 50%;
         -moz-border-radius: 50%;
         -webkit-border-radius: 50%;
         color: #ffffff;
         display: inline-block;
         font-weight: bold;
         line-height: 22px;
         margin-right: 1.5rem;
         text-align: center;
         width: 22px;
 
 }
 .dot:hover{
     color:#fff;
 }

.timestamp.activeMenu {
    color: white;
}

.menu-name.activeMenu {
    color: white;
}

.menu-last-message.activeMenu {
    color: white;
}



.activeMenu {
    color: white;
}

.menu-preview-container {
    border-radius: 1em;
    padding: 0.5625em;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 0 auto auto;
}
.tr_replace{
    max-height: 6rem;

}

.tr_replace:hover span {
    color: black;
}
.tr_replace:hover {
    background-color: #aaaaaa;
}

.tr_replace.activeMenu:hover span {
    color: white;
}
.tr_replace.activeMenu:hover {
    background-color: #aaaaaa;
}

.tr_replace.activeMenu {
    background-color: #3178B1;
}

.tr_replace.activeMenu:hover {
    background-color: #aaaaaa;
}

/*
.tr_replace:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}
*/
.tr_replace:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}
</style>