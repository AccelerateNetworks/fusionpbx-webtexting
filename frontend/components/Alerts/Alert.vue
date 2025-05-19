<script lang="ts">
import { emitter } from '../../lib/global';
export type AlertData= {
        error: String,
        message: String,
        status: Number,
        type: String,
}
export default {
    name: 'WTAlert',
    props:{
        error: String,
        message: String,
        status: Number,
        type: String,
    },
    emits: {
        'Close-Alert': String
    },
}
//TODO Status switch to change class depending on status code (warning vs danger vs success)
</script>
<template>
    <div class="alert alert-warning alert-dismissible fade show z-3" role="alert">
        {{"Error Code: " + this.status + "\n" + this.message }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>