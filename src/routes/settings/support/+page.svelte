<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div class="flex justify-center align-middle">
  <div class="hero min-h-screen w-4/5 bg-base-200">
    <div class="hero-content">
      <div class="flex flex-col justify-center items-center">
        <button class="btn btn-ghost" on:click={() => { goto("/settings") }}>
          &lt; &lt; Back
        </button>
        <h1 class="text-2xl font-bold">
          I've fallen and I can't get up!
        </h1>
        <h3 class="text-lg italic">
          (You'll have to implement this yourself.)
        </h3>
      </div>
    </div>
  </div>
</div>