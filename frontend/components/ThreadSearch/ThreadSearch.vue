<script lang="ts">
import { emitter } from '../../lib/global';
export default{
    name:"ThreadSearch",
    props:{
        searchingThreads: Boolean,
    },
    methods:{
        threadSearch(searchString: String){

        }
    },
    data(){
        let searchString='';
        return {searchString}
    },
    watch:{
        searchString(newString, oldString){
            emitter.emit("update-filter-string",newString);
        }
    },
}
</script>
    <template>
        <div id="THREAD_SEARCH">
            <div class="thread-search-container">
                <!-- <span class='thread-search-message'>Enter contact name: -->
                    <input class="input" type="text" v-model="searchString" id="thread-search-number" name="thread-search-number" placeholder="Search contacts" />
                <!--  </span>
               <label for="thread-search-number">Outbound Number must include Country Code and Area Code:</label> -->
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
    padding-left:1rem;
    border:none;
}

@media screen and (width <=700px) {
    
}

</style>