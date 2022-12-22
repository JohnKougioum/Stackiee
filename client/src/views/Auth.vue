<script>
import { h } from 'vue'
import axios from 'axios'
import qs from 'qs'
import SpinnerLoader from '../components/SpinnerLoader.vue'

export default {
  beforeCreate() {
    axios
      .post(
        'https://login.iee.ihu.gr/token',
        qs.stringify({
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_SECRET,
          grant_type: 'authorization_code',
          code: this.$route.query.code,
        }),
      )
      .then((response) => {
        axios
          .get('https://api.iee.ihu.gr/profile', {
            headers: {
              'x-access-token': response.data.access_token,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            axios.defaults.withCredentials = true

            axios
              .post('http://localhost:5000/api/user/', {
                am: response.data.am,
                firstName: response.data.givenName,
                lastName: response.data.sn,
                eduPersonAffiliation: response.data.eduPersonAffiliation,
                eduPersonPrimaryAffiliation:
                  response.data.eduPersonPrimaryAffiliation,
                mail: response.data.mail,
                id: response.data.id,
                uid: response.data.uid,
              })
              .then((response) => {
                sessionStorage.setItem('user', response.data.uid)
                if (response.status === 202)
                  this.$router.push({ path: '/' })
              })
          })
      })
  },
  render() {
    return h('div', { class: 'absolute center' }, [h(SpinnerLoader)])
  },
}
</script>
