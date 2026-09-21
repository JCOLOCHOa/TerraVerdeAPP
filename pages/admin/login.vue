<script setup lang="ts">
useHead({ title: 'Acceso | Terra Verde' })

const supabase = useSupabase()
const email = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref('')

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session) navigateTo('/admin')
})

async function entrar() {
  error.value = ''
  cargando.value = true

  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  cargando.value = false

  if (err) {
    error.value = 'Correo o contraseña incorrectos.'
    return
  }

  navigateTo('/admin')
}
</script>

<template>
  <div class="acceso">
    <form class="acceso__caja" @submit.prevent="entrar">
      <p class="acceso__marca">Terra Verde</p>
      <p class="acceso__sub">Panel de reservaciones</p>

      <div class="campo">
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="username" required />
      </div>

      <div class="campo">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <button class="btn btn--principal acceso__boton" :disabled="cargando">
        {{ cargando ? 'Entrando' : 'Entrar' }}
      </button>

      <p v-if="error" class="acceso__error">
        <AppIcon name="aviso" :size="17" />
        {{ error }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.acceso {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--verde-claro);
  padding: 24px;
}

.acceso__caja {
  width: 100%;
  max-width: 380px;
  background: var(--marfil);
  border: var(--borde);
  border-radius: var(--radio);
  box-shadow: var(--sombra);
  padding: 38px 32px;
}

.acceso__marca {
  font-family: var(--script);
  font-size: 2.2rem;
  color: var(--verde-bosque);
  margin: 0;
  text-align: center;
}

.acceso__sub {
  text-align: center;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--verde-oliva);
  margin: 0 0 28px;
}

.acceso__boton {
  width: 100%;
  margin-top: 10px;
}

.acceso__error {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin: 16px 0 0;
  font-size: 0.86rem;
  color: #a83232;
}
</style>
