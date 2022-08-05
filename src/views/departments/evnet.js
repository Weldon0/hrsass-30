import Vue from 'vue'

export const eventBus = new Vue()

eventBus.$on('update', (status) => {
  console.log(status)
})

setTimeout(() => {
  eventBus.$emit('update', false)
}, 1000)
