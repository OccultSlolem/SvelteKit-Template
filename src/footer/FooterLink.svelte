<script lang="ts">
    import SvgIcon from '@jamescoyle/svelte-icon'

    export let path: string;
    export let link: string;
</script>

<a class="flex pl-2 justify-center items-center" href={link}>
    <!-- {name} -->
    <SvgIcon type="mdi" path={path} />
</a>