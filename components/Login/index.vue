<template lang="pug">
  v-flex(class='text-xs-center')
    v-spacer
    v-container(style="max-width: 500px; min-height: 500px")
      v-card(light style="min-height: 200px")
        v-card-text
          v-form(@submit='login')
            v-text-field.input(placeholder="Tu nombre de usuario" type="email" required v-model="username")
            v-spacer
            v-text-field.input(placeholder="Tu contraseña" type="password" required v-model="password")
            v-spacer
            p.iserror {{ this.error }}
            v-btn(block type='submit') Acceder
          v-btn( block href="register" style="margin-top: 20px") Registrate
</template>

<script>
export default {
  data () {
    return {
      error: '',
      username: '',
      password: ''
    }
  },
  methods: {
    async login () {
      event.preventDefault()
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.username,
            password: this.password
          }
        }).then(this.$router.push('/'))
      } catch (e) {
        this.error = 'Usuario o contraseña incorrectos'
      }
    }
  }
}
</script>
