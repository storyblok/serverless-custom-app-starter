<template>
  <div class="bg-white py-6 min-h-screen flex flex-col">
    <Toast ref="toast" :message="errorMessage" type="danger" />

    <div v-if="loading" class="flex flex-1 justify-center items-center">
      <Loading :message="loadingMessage" />
    </div>

    <template v-else>
      <div v-if="hasCurrentUser" class="px-6 mb-6">
        <p>
          Welcome <span class="text-teal-700">{{ userName }}</span> to your
          custom app.
        </p>
      </div>

      <div class="flex-1 px-6 mb-6 flex">
        <div
          v-if="!hasData"
          class="flex justify-center items-center flex-col w-full"
        >
          <Message type="danger" message="The data could not be loaded" />

          <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            @click="loadData"
          >
            Reload data
          </button>
        </div>

        <template v-else>
          <h2>We found {{ stories.length }} stories in this space.</h2>
        </template>
      </div>
    </template>

    <AppFooter />
  </div>
</template>

<script>
import axios from 'axios'
import AppFooter from '@/components/AppFooter'
import Message from '@/components/Message'
import Loading from '@/components/Loading'
import Toast from '@/components/Toast'

export default {
  name: 'IndexPage',
  components: {
    AppFooter,
    Loading,
    Message,
    Toast,
  },
  data: () => ({
    spaceId: null,
    loading: true,
    hasUserError: false,
    hasStoriesError: false,
    stories: [],
    currentUser: {},
    errorMessage: '',
    loadingMessage: 'Loading...',
  }),
  computed: {
    hasData() {
      return this.stories.length > 0 && !this.hasError && !this.loading
    },
    hasError() {
      return this.hasUserError || this.hasStoriesError || this.hasWorkflowError
    },
    hasCurrentUser() {
      return Object.values(this.currentUser).length > 0
    },
    userData() {
      return this.hasCurrentUser ? this.currentUser.user : {}
    },
    userName() {
      if (this.hasCurrentUser) {
        return this.userData ? this.userData.friendly_name : ''
      }

      return ''
    },
  },
  mounted() {
    if (window.top === window.self) {
      window.location.assign('https://app.storyblok.com/oauth/app_redirect')
    } else {
      this.loadSpaceIdFromUrl()

      this.$nextTick(this.loadData)
    }
  },
  methods: {
    loadSpaceIdFromUrl() {
      this.spaceId = this.$route.query.space_id || null
    },
    async loadData() {
      this.clearErrors()
      this.loading = true

      try {
        // load stories data
        this.loadingMessage = 'Loading stories...'
        this.stories = await this.loadStories()

        // load user data
        this.loadingMessage = 'Loading user information...'
        await this.getUserInfo()
        this.loading = false
      } catch (e) {
        console.error(e.message); // eslint-disable-line
        this.errorMessage = 'An error ocurred when load data'
        this.loading = false
        this.$refs.toast.show()
      }
    },
    async loadStories() {
      const perPage = 25
      const url = `/auth/spaces/${this.spaceId}/stories`
      let page = 1

      let res = await axios.get(url, this.getStoriesConfig(page))
      const total = res.data.total
      const lastPage = Math.ceil(total / perPage)
      let all = res.data.stories

      if (total > 1000) {
        this.errorMessage =
          'You have more than 1000 content items with assigned workflow stages. Only the first 1000 will be loaded.'
        this.$refs.toast.show()
      }

      while (page < lastPage && page <= 40) {
        page++
        res = await axios.get(url, this.getStoriesConfig(page))
        all = [...all, ...res.data.stories]
      }

      this.hasUserError = false

      return all
    },
    getUserInfo() {
      return axios
        .get(`/auth/user?space_id=${this.spaceId}`)
        .then((response) => {
          this.hasUserError = false
          this.currentUser = response.data
        })
        .catch((err) => {
          this.hasUserError = true
          console.error(err); // eslint-disable-line
        })
    },
    clearErrors() {
      this.hasUserError = false
      this.hasStoriesError = false
      this.hasWorkflowError = false
    },
    getStoriesConfig(page) {
      const params = {
        page,
        sort_by: 'updated_at:desc',
      }

      return { params }
    },
  },
}
</script>
