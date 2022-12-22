<script lang="ts">

    import FooterLink from "./FooterLink.svelte";
    import { mdiGithub, mdiLinkedin, mdiTwitter } from "@mdi/js";

    const footerLinks = [
        {
            path: mdiGithub,
            link: "https://www.github.com/OccultSlolem",
            name: "GitHub"
        },
        {
            path: mdiLinkedin,
            link: "https://www.linkedin.com/in/ethan-hanlon-6688491a6",
            name: "LinkedIn"
        },
        {
            path: mdiTwitter,
            link: "https://www.twitter.com/iam_EthanHanlon",
            name: "Twitter"
        }
    ];
</script>


<footer class="footer border-t border-base-300 p-10 text-base-content">
    <div>
        <span class="footer-title">Lorem</span>
        <a class="link link-hover" href="#">Ipsum</a>
        <a class="link link-hover" href="#">Dolor</a>
        <a class="link link-hover" href="#">Sit</a>
    </div>
    <div>
        <span class="footer-title">Amet</span>
        <a class="link link-hover" href="#">Consectetur</a>
        <a class="link link-hover" href="#">Adipiscing</a>
        <a class="link link-hover" href="#">Elit</a>
    </div>
    <div>
        <span class="footer-title">In</span>
        <a href="#">In</a>
        <a href="#">Lorem</a>
        <a href="#">Odio</a>
</footer>

<footer class="footer flex border-t border-base-300 p-10 items-center self-center">
    <div class="footer-title justify-self-start mb-0 flex items-center">
        <img src="https://via.placeholder.com/50" alt="Logo" />
        <h1 class="text-2xl font-bold">SvelteKit-Template</h1>
    </div>

    <div class="justify-self-end align-middle">
        <!-- GitHub, LinkedIn, an Twitter links. Stack each link vertically, precede with relevant Icon -->
        <div class="footer-links flex items-center align-middle">
            <!-- <div class="justify-self-end"> -->

                {#each footerLinks as { path, link, name }}
                    <FooterLink path={path} link={link} />
                {/each}
            <!-- </div> -->
        </div>
    </div>
</footer>