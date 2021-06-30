<script>
  import logo from './assets/logo.png';

  export let name;

  const arr = [1, 2, 3];
  const newArr = arr.map((n) => n * 2);
  console.log(newArr);
</script>

<template>
  <h1>Hello {name}!</h1>
  <img src={logo} alt="Svelte Logo" />
</template>

<style lang="scss">
  :global(html) {
    font-size: 10px;
  }
  h1 {
    font-size: 4.8rem;
    color: #ff3e00;
    filter: blur(4px);
  }
  img {
    width: 80px;
    height: auto;
  }
</style>
