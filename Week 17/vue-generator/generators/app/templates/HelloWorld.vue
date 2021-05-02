<template>
    <p>{{ greeting }}</p>
</template>

<script>
    module.exports = {
        name: HelloWorld,
        data() {
            return {
                greeting: 'Hello'
            }
        }
    }
</script>

<style scoped>
    p {
        font-size: 2em;
        text-align: center;
    }
</style>
