<template lang="pug">
    v-carousel
        v-carousel-item(v-for="(image, i) in images" :key="image")
          v-img(:src="image" height="100%" tile)
            v-row.fill-height(align="center" justify="center")
              div.text-h2
                | Slide {{ i + 1 }}
</template>

<script> 
export default {
  props: {
      images: {
          type: Array,
          default: ['https://images-ext-2.discordapp.net/external/NbU-dnGO_XCNjmfWyLFtLF_q1k9DarWh5k37qnQw_bc/%3Fauto%3Dcompress%26cs%3Dtinysrgb%26dpr%3D2%26h%3D650%26w%3D940/https/images.pexels.com/photos/950835/pexels-photo-950835.jpeg?width=617&height=409']
      }
  },
  mounted() {
    const data = 0;
    console.log(data);
  }
}
</script>
