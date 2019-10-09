<template>
  <b-container>
    <component v-bind:is="component"></component>
  </b-container>
</template>

<script>
import Central from './Central.vue';

export default {
  name: 'Base',
  components: {
    Central,
  },
  data() {
    return {
      component: 'Central',
    };
  },
};
</script>
