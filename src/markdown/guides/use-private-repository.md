---
description: Deploy a Lenra app from a private repository.
---

You want to use a private git repo to version your app ?
Using an open-source solution doesn't mean that your app has to be one two.

In this guide we will explain how create a token and how to use it in our backoffice for the two main plateformes: [GitLab](#gitlab) and [GitHub](#github).

## GitLab

GitLab offers many kinds of access token that could be used to get your app source code:

{:.list}
- [Personnal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html): to give access to every repos
- [Group access token](https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html): to give access to every repos in a specific group
- [Project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html): to give access to only one repo

We will focus on the first one in this guide since it the only free to use solution but you should use project access token if you can, it is more adapted to our need and secure.

Go to your [personnal access token settings by clicking this link](https://gitlab.com/-/profile/personal_access_tokens) or by following the next steps:

{:.list}
- In the upper-right corner, select your avatar.
- Select Edit profile.
- On the left sidebar, select Access Tokens.


To create a personnal access token follow the next steps:

{:.list}
- Enter a name to understand what the token is used for (for example `Lenra app deployment`) and optional expiry date for the token.
- Select the desired scopes: `read_repository`.
- Select Create personal access token.

Save the personal access token somewhere safe. After you leave the page, you no longer have access to the token.

We will then integrate our access token in the git HTTP URL of our Lenra app.
See the next example:

```
https://gitlab.com/group/repo.git
becomes
https://oauth2:<access_token>@gitlab.com/group/repo.git
```

## GitHub

GitHub only offers [Personnal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) so we will use it.
***Actually GitHub also handle [Fine-grained token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#fine-grained-personal-access-tokens) while I'm writing this guide which is much more secured but it's still in beta version.***

Go to your [personnal access token settings by clicking this link](https://github.com/settings/tokens) or by following the next steps:

{:.list}
- In the upper-right corner, select your avatar.
- Select Settings.
- On the left sidebar, select Developer settings.
- On the left sidebar, select Personal access tokens ***(classic)***.


To create a personnal access token follow the next steps:

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
