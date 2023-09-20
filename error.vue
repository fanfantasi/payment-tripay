<script setup>
    defineProps(['error'])
</script>
<template>
    <div class="nuxt-error">
        <main class="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
            <h1 class="text-9xl font-extrabold text-white tracking-widest">404</h1>
            <div class="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
                Error
            </div>
            <ul class="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <button class="mt-5">
            <a class="relative inline-block text-sm font-medium text-white group active:text-orange-500 focus:outline-none focus:ring">
                <span class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>
            </a>
            <span class="relative block px-8 py-3 bg-white border border-current">
                <router-link to="/">Go Home</router-link>
            </span>
            </button>
            
        </main>
        
    </div>
</template>