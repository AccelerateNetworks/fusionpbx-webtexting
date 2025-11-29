<script lang="ts">
import { emitter } from '../../lib/global';
export type AlertData= {
        error: String,
        ReasonPhrase: String,
        statusCode: String,
        type: String,
}
export default {
    name: 'WTAlert',
    props:{
        error: String,
        ReasonPhrase: String,
        statusCode: String,
        type: String,
        sourceURL: String,
    },
    emits: {
        'Close-Alert': String
    },
}
//TODO Status switch to change class depending on status code (warning vs danger vs success)
</script>
<template>
    <div class="position-absolute top-0 start-50 alert alert-dismissible alert-danger fade show z-6 mb-3 w-100 translate-middle-x" role="alert">
        {{"Status Code: " + statusCode + "\n" + ReasonPhrase + "."}}
        <p> Please contact support for assistance.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" >
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>

<style scoped>
.z-6{
    z-index: 6;
}
</style>