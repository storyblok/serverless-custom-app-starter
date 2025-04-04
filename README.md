> **⚠️ DEPRECATION NOTICE ⚠️**
>
> This template repository (`serverless-custom-app-starter`) is **deprecated** and no longer actively maintained or recommended.
>
> Please refer to the new central repository, **`storyblok/space-tool-plugins`**, for examples, boilerplates, and the standard approach to developing Space Plugins (or Tool Plugins) for Storyblok. This new location provides updated resources and represents the standard going forward.
>
> *   **➡️ New Space Plugin projects should use the resources found in `storyblok/space-tool-plugins`.**
> *   **➡️ Existing projects based on this template should refer to `storyblok/space-tool-plugins` for updates and best practices.**
>
> Find the new resources here:
> *   **GitHub:** [https://github.com/storyblok/space-tool-plugins](https://github.com/storyblok/space-tool-plugins)
> *   **Space plugins documentation:** [https://www.storyblok.com/docs/plugins/space-plugins](https://www.storyblok.com/docs/plugins/space-plugins/)
>
> Thank you for your understanding.

<p align="center">
  <h1 align="center">Serverless Custom App in Storyblok </h1>
</p>

![App preview image](./screenshot.png)

> Example App to start with in Storyblok.

Based on our [Workflow App](https://github.com/storyblok/storyblok-workflow-app)


## Tutorial

This repository is the end result of following our [How to Build a Serverless Custom App with Storyblok, Grant and Supabase](https://www.storyblok.com/tp/serverless-custom-app-oauth-2) tutorial. 


Firstly, to create an app on Storyblok, you need to enter to the [our partner program](https://www.storyblok.com/partners).

### Installation

``` bash
# clone this repository
$ git clone https://github.com/storyblok/serverless-custom-app-starter.git

# Enter the directory
$ cd serverless-custom-app-starter

# install dependencies
$ npm install
```

### Environment Variables

To run the project you will need to set up a few serverless functions on [vercel](https://vercel.com/).

Rename the file `.env-example` to `.env` and fill out the variables.

~~~text
STORYBLOK_CLIENT_ID=Q...==
STORYBLOK_CLIENT_SECRET=MJ...Q==
STORYBLOK_CLIENT_REDIRECT_URI=https://vercel-dashboard.lisilinhart.vercel.app/connect/storyblok/callback
SUPABASE_DB_URL=https://ig...di.supabase.co
SUPABASE_PUBLIC_KEY=eyJ...Uk
~~~



### Deploy

This app is like any other Nuxt app, so, the deploy is the same ([check the Nuxt documentation about this](https://nuxtjs.org/guide/commands#production-deployment)). Since the tutorial makes use of serverless functions on Vercel, we recommend deploying it to [Vercel](https://vercel.com/) with the following command:

```
$ npm run build
$ npm run generate
$ vercel
```

The functions in the `api` folder will automatically be deployed as serverless functions. Make sure to set all environment variables in the `.env-example` in Vercel as well. See [their docs](https://vercel.com/knowledge/how-to-add-vercel-environment-variables) on how to do this.

---

<p align="center">
  <h5 align="center">Powered by <a href="https://www.storyblok.com/" title="link to the Storyblok website">Storyblok</a></h5>
</p>
