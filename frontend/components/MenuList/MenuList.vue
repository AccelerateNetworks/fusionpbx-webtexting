<script lang="ts">
import MenuPreview from '../MenuPreview/MenuPreview.vue';
import {emitter, MenuChangePayload} from '../../lib/global';
export default {
    name:"MenuList",
    components: { MenuPreview },
    data(){
        return {selectedMenu:false,}
    },
    //mounted emitter.on for menuPreview click emits
    mounted(){
        emitter.on('menu-change',(payload:string) => {
            console.log('change menu please')
            console.log(payload)
            if(payload){
                this.activeMenu = payload;
                this.selectedMenu =true;
            }
            else{
                this.activeMenu = 'none'
                this.selectedMenu = false;
            }
        })
    },
}
</script>
<template>
    <div class="list_container" v-bind:class="(this.selectedMenu) ? 'hide-if-small': 'no-menu-selected'" id="THREADLIST">
        <div class="threadlist-header d-flex justify-content-between align-items-center">
            <div class="ml-05">
                <router-link class="fa fa-arrow-left btn btn-large " to="`/threadlist.php`" aria="Go Back to threadlist!"></router-link>

                <h6 class="m-auto">Settings</h6>
            </div>
        </div>
        <MenuPreview name="templates" link='templates.php' descriptions="Manage Message Templates" 
                   ></MenuPreview>

        <div class="threadlist-table">
            <div class="preview_list_container">
                
            </div>
        </div>
    
    </div>
</template>
<style>
.ml-05{
    margin-left:5%;
}
.mr-05{
    margin-right:5%;
}
/*body{
    cursor:pointer;
} */
.menu-icon{
    color:white;
}
.menu-icon:hover{
    color:#BB6025;
}
.float-right{
    position:absolute;
    top: 50%;
    float:right;
}

.active{
    grid-column-start: 1;
}
.preview_list_container {
    direction: ltr;
}
.list_container {
    height: 100%;
    grid-column-start: 1;
    grid-column-end: 1;
    padding-right: 0.25rem;
    border-radius: 0.5rem;
    border-color: none;
}
.hide-if-small{
}

.threadlist-header{
    box-shadow: 0 4px 4px -2px white;
    margin: 0 auto 0px auto;
    padding-top: 0.75rem;
    padding-bottom: 0.25rem;
    background-color: #5f9fd3;
    color: #fff;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    font-weight: bold;
    border: solid #5f9fd3 2px;
}

.threadlist-table {
    /*border-spacing: 1em; */
    direction: rtl;
    overflow-y: auto;
    height: 69dvh;
    width: 100%;
    table-layout: fixed;
    padding-left: 3px;
}
.link-container{
    font-size: 2rem;
    line-height: 2rem;
    height: 3rem;
    width: 3rem;
    background-color: #5f9fd3;
    border-radius: 50%;
    position:relative;
    float: center;
    margin-top: 0.5rem;
}

.dot-center{
    text-align:center;
     margin: 0;
     position: absolute;               
     top: 50%;                         
     left: 50%;
     transform: translate(-50%, -50%) ; 
}
.dot {    
     
         border-radius: 50%;
         -moz-border-radius: 50%;
         -webkit-border-radius: 50%;
         color: #ffffff;
         display: inline-block;
         font-weight: bold;
         line-height: 22px;
         margin-right: 5px;
         text-align: center;
 
 }
 .dot:hover{
     color:#BB6025;
 }

 .link-container-container{
    justify-content: center;
    display:flex;
}
.load-animation-container{
    display: flex;
    justify-content: center;
    align-items: center;
}



    @media screen and (width <=700px) {    
    div.action_bar {
        top: 0px;
    }
    .active{
        z-index:7;
    }
    .table {
        height: 79dvh;
    }
    .hide-if-small{
        display:none;
    }
    
}
</style>