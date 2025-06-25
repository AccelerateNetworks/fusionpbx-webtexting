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
    <div class="alert alert-dismissible fade show z-3 {{this.status>300 ? alert-warning : alert-warning }}" role="alert">
        {{"Status Code: " + this.status + "\n" + (this.message ? this.message : "Success!") }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>
