<template lang="pug">
    v-carousel
        v-carousel-item(v-for="(color, i) in colors" :key="color")
          v-sheet(:color="color" height="100%" tile)
            v-row.fill-height(align="center" justify="center")
              div.text-h2
                | Slide {{ i + 1 }}
</template>

<script> 
export default {
  props: {
      colors: {
          type: Array,
          default: ['green']
      }
  },
  mounted() {
    const data = 0;
    console.log(data);
  }
}
</script>
