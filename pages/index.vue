<template lang="pug">
  v-row(justify="center" align="center")
    v-col(cols=12 sm=12)
      Carousel(v-bind:colors="colors")
  </v-row>
</template>

<script>
import Carousel from '~/components/Carousel/index.vue'

  export default {
    data: () => ({
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
    }),
    components: {
      Carousel
    }
  }
</script>