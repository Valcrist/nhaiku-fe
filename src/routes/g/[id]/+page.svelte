<script lang="ts">
    import { page } from '$app/state'
</script>

<div class="min-h-screen bg-[#0d0f1a] text-white flex items-center justify-center">
    <div class="text-center">
        <p class="text-zinc-400 text-lg">Reader coming soon</p>
        <p class="text-zinc-600 text-sm mt-1">#{page.params.id}</p>
        <a href="/" class="mt-4 inline-block text-zinc-400 hover:text-white text-sm underline">← Back</a>
    </div>
</div>
