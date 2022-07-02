<script>
import axios from "axios";
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      json: [],
      loading: true,
    };
  },
  async created() {
    await axios
      .get(this.url)
      .then((response) => {
        this.json = response.data;
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.loading = true;
      });
  },
  render() {
    return this.$slots.default({
      json: this.json,
      loading: this.loading,
    });
  },
};
</script>
