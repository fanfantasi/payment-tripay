<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :throttle="0" :color="false" class="bg-blue-600"/>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
useHead({
    title: 'Invoice Billing Internet',
    meta: [
        { name: 'description', content: 'Billing Internet Leleradius' }
    ],
    link: [
        {
            rel: 'icon',
            href: 'icons/favicon.ico'
        }
    ],
    meta: [
        {
            property:'og:site:name',
            name:'Programmer Junior'
        },
        {
            property:'og:title',
            name:'Programmer Junior'
        },
        {
          property:"og:image",
          content:"icons/favicon.ico"
        }
        
    ]
})
</script>