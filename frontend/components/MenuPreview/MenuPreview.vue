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

                    <span class='menu-last-item' >{{
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

.menu-last-item {
    color: darkgray;
    grid-row-start: 2;
    grid-column: 1;
    justify-self: start;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.menu-name.activeMenu {
    color: white;
}

.menu-last-item.activeMenu {
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