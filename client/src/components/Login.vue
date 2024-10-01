<template>
    <div>
        <h1>Login </h1>
        <form @submit.prevent="loginUser">
        <div>
            <label>Email:</label>
            <input type="email" v-model="email" required />
        </div>
        <div>
            <label>Password:</label>
            <input type="password" v-model="password" required />
        </div>
            <button type="submit">Login</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
import { Api } from '@Api';


</script>