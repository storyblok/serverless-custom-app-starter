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

      <div class="px-6 mb-6">
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
          <br />
          <a
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8 inline-block"
            :href="`/refresh?space_id=${spaceId}`"
          >
            Refresh Access Token
          </a>
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
    hasCookieError: false,
    stories: [],
    deployments: [],
    currentUser: {},
    errorMessage: '',
    loadingMessage: 'Loading...',
  }),
  computed: {
    hasData() {
      return this.stories && this.stories.length > 0 && !this.loading
    },
    allowsCookies() {
      return navigator.cookieEnabled
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

      if (!this.allowsCookies) {
        this.errorMessage = 'Cookies need to be enabled for this app to work'
        this.loading = false
        this.$refs.toast.show()
      } else {
        this.$nextTick(this.loadData)
      }
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
        await this.loadStories()

        // load user data
        this.loadingMessage = 'Loading user information...'
        await this.getUserInfo()

        this.loading = false
      } catch (e) {
        console.error(e.message); // eslint-disable-line
        this.errorMessage = 'An error ocurred when loading the data'
        this.loading = false
        this.$refs.toast.show()
      }
    },
    async loadStories() {
      // get the space id from URL and use it in requests
      return await axios
        .get(`/auth/spaces/${this.spaceId}/stories`)
        .then((res) => {
          this.perPage = res.data.perPage
          this.total = res.data.total
          this.stories = res.data.stories
        })
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
      this.hasCookieError = false
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
