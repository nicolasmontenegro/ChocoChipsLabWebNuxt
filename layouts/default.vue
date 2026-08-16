<template lang="pug">
#template.container.px-2(:class='containerClass')
  Menu.container-menu
  .container-content.columns.is-desktop.is-gapless.is-justify-content-space-between
    .column.is-12.content.main
      .mb-2(v-if='navegation !== null')
        h1.title.is-1.mb-1.mt-4(v-if='navegation.section.name')
          strong {{ $t(`sections.${navegation.section.name}`) }}
        p.link_back.mb-0(v-if='navegation.back && navegation.back.name')
          nuxt-link(:to='localePath({name: navegation.back.name})')
            strong {{ $t('navigation.back_to', { section: $t(`sections.${navegation.back.name}`) }) }}
      slot
    .column.is-12.content.main
      Footer.mt-6.mb-4
</template>

<script setup>
const navegationStore = useNavegationStore()
const navegation = computed(() => navegationStore.$state)
const containerClass = computed(() => navegationStore.section.style)
const localePath = useLocalePath()

const head = useDefaultHead()
useHead(head)
</script>
