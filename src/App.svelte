<template>
  <h1>Hello {name}!</h1>
</template>

<script>
export let name

const arr = [1, 2, 3]
const newArr = arr.map((n) => n * 2)
console.log(newArr)
</script>

<style lang="scss">
:global(html) {
  font-size: 10px;
}
h1 {
  font-size: 2.4rem;
  box-shadow: 1px 1px 4px #000;
}
</style>
