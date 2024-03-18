<script lang="ts">
import { emitter } from '../../lib/global';
//TODO: add an Unsearch button to 

export default{
    name:"ThreadSearch",
    props:{
        searchingThreads: Boolean,
    },
    methods:{
        threadSearch(searchString: String){
            //this is where we fire off the search function flow
            //sanitize input
            //call to backfillPreviews.ts
            //backfillPreviews should return it's data to ThreadList tho.
            if(searchString.length >2){
               emitter.emit("thread-search-request",searchString),500;
            }
            else{
                console.log("ThreadSearch PDL emergency release valve");
                emitter.emit("previews-done-loading");
            }
        }
    },
    data(){
        let searchString='';
        return {searchString}
    },
    watch:{
        searchString(newString, oldString){
            newString = newString.trim();
            this.threadSearch(newString);
            emitter.emit("update-filter-string",newString);
        }
    },
}
</script>
    <template>
        <div id="THREAD_SEARCH">
            <div class="thread-search-container ">
                <div class="input-icons">
                <!-- <span class='thread-search-message'>Enter contact name: -->
                    <i class="fa fa-search icon"></i>
                    <input class="input" type="text" v-model="searchString" id="thread-search-number" name="thread-search-number" placeholder="Search contacts" />
                    <!--  </span>
               <label for="thread-search-number">Outbound Number must include Country Code and Area Code:</label> -->
            </div>
            </div>
        </div>
</template>
<style scoped>
#THREAD_SEARCH{
    background-color:#5f9fd3;
    padding-bottom: 0.5rem;
}
.thread-search-container{
    width:90%;
    margin: 0 auto;
    
}
.input{
    border-width:2px;
    border-radius:0.5rem;
    width:100%;
    margin-right:0;
    padding-left:1.5rem; 
    border:none;
}
.input-icons {
    width: 100%;
    margin-bottom: 5px;
}

.input-icons i {
    position: absolute;
}

.icon {
    padding: 5px;
    color: grey;
    min-width: 25px;
    /*text-align: center;*/
}
@media screen and (width <=700px) {
    
}
</style>