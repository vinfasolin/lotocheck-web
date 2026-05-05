<script setup>defineProps({variant:{type:String,default:'neutral'}})</script><template><span class="base-badge" :class="`base-badge--${variant}`"><slot /></span></template>
