---
description: Deploy a Lenra app from a private repository.
---

Do you want to use a private git repository to version your app? 
Using an open-source solution doesn't mean that your app has to be one too.

In this guide we will explain how to create a token and how to use it in our backoffice for the two main plateforms: [GitLab](#gitlab) and [GitHub](#github).

## GitLab

GitLab offers several types of access tokens that can be used to get your app's source code:

{:.list}
- [{:rel="noopener" target="_blank"}Personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html): to give access to all repositories
- [{:rel="noopener" target="_blank"}Group access token](https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html): to give access to every repositories in a specific group
- [{:rel="noopener" target="_blank"}Project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html): to give access to only one repository

We will focus on the first one in this guide since it is the only free solution to use, but you should use project access tokens if possible, as they are more adapted to our needs and more secure.

You can go to your [{:rel="noopener" target="_blank"}personal access token settings by clicking this link](https://gitlab.com/-/profile/personal_access_tokens) or by following these steps:

{:.list}
- In the upper-right corner, select your avatar.
- Select Edit profile.
- On the left sidebar, select Access Tokens.


To create a personal access token follow these steps:

{:.list}
- Enter a name to understand what the token is used for (for example `Lenra app deployment`) and an optional expiry date for the token.
- Select the desired scopes: `read_repository`.
- Select Create personal access token.

Save the personal access token somewhere safe. After you leave the page, you will no longer have access to the token.

Next, we will integrate our access token into the git HTTP URL of our Lenra app.
Here's an example:

```
https://gitlab.com/group/repo.git
becomes
https://oauth2:<access_token>@gitlab.com/group/repo.git
```

## GitHub

GitHub only offers [{:rel="noopener" target="_blank"}personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) so we will use that.
***Actually GitHub also handles [{:rel="noopener" target="_blank"}Fine-grained tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#fine-grained-personal-access-tokens) while I'm writing this guide which are much more secure but they are still in beta version.***

You can go to your [{:rel="noopener" target="_blank"}personal access token settings by clicking this link](https://github.com/settings/tokens) or by following these steps:

{:.list}
- In the upper-right corner, select your avatar.
- Select Settings.
- On the left sidebar, select Developer settings.
- On the left sidebar, select Personal access tokens ***(classic)***.


To create a personal access token, follow these steps:

{:.list}
- Select Generate new token.
- Enter a name to understand what the token is used for (for example `Lenra app deployment`) and optional expiry date for the token.
- Select the desired scopes: `repo`.
- Select Generate token.

```
https://github.com/username/repo.git
becomes
https://oauth2:<oauth-key-goes-here>@github.com/username/repo.git
```
