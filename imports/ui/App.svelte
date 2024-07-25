<script>
  import { setClient } from 'svelte-apollo'
  import apolloClient from './apollo/apollo-client'
  import Router from './router.svelte'

  setClient(apolloClient)
</script>

<Router />
