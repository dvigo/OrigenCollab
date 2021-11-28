<template lang="pug">
  v-flex(class='text-xs-center')
    v-spacer
    v-container(style="max-width: 500px; min-height: 500px") 
      v-card(light style="min-height: 200px")
        v-card-text
          v-form(@submit='signup')
            v-text-field.input(placeholder="Nombre" type="text" required v-model="firstName")
            v-text-field.input(placeholder="Apellidos" type="text" required v-model="lastName")
            v-text-field.input(placeholder="Email" type="email" required v-model="email")
            v-text-field.input(placeholder="Contraseña" type="password" required v-model="password")
            v-spacer
            v-text-field.input(placeholder="Repite la contraseña" type="password" required v-model="password2")
            v-spacer
            v-btn(block type='submit') Sign up
          p.iserror {{ this.error }}
</template>

<script>
export default {
  data () {
    return {
      error: '',
      firstName: '',
      password: '',
      password2: '',
      lastName: '',
      email: ''
    }
  },
  methods: {
    async signup () {
      event.preventDefault()
      this.error = ''
      try {
        let user = {
            email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            password: this.password,
        }
        if(this.password == this.password2){
            await this.$axios.$post('/user', user).then((res) => {
                if (res.message == "User created.") {
                    this.$router.push('/login')
                }
            })
        }else{
            this.error = 'Usuario o contraseña incorrectos'
        }
        
      } catch (e) {
        this.error = 'Usuario o contraseña incorrectos'
      }
    },
  }
}
</script>