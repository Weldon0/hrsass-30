<template>
  <div>
    <slot name="title" :node="{}" :data="{name: '黑马'}" />
    <slot />
    <slot name="tile" name="234" />
  </div>
</template>
