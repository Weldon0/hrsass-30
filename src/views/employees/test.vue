
<script>
export default {
  name: 'Test',
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  render(createElement, context) {
    const type = this.config.type
    return <type {...this.config.props}></type>
  }
}
</script>

<style scoped>

</style>
