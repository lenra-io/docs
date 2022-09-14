# Getting Started

## How to start a new Lenra project

It is very easy to start a new Lenra project. The most important thing for you is to choose your favorite programming language with which you will be developing your application.
Choose one in [the template list](https://github.com/orgs/lenra-io/repositories?q=&type=template&language=&sort=stargazers) that will be used as a starting point for your application. 

You then need to run the following command using the Lenra CLI to create your new project using the template of your choice.

```console
lenra new node my-app
```

or

```console
lenra new rust my-app
```


Now that your app is ready you have the choice between using the Lenra CLI to get started faster, using the devtools or deploy it to the online platform to share it with other users.

Using the Lenra CLI you first need to build your application.

```console
lenra build
```

Then your application can be started.

```console
lenra start
```

The CLI directly uses the devtools so that you do not have to take care of launching it as could be done in the `Start and use the devtools` section.


## Start and use the devtools

The devtools are a way to run and debug your application locally, there is a specific version of the devtools for each language that Lenra supports. In your case if you followed the instructions above, you need to run the `devtools-node12`.

Go to your application folder and use our devtools docker image by running the following command.

```bash
docker run -it --rm -p 4000:4000 -v "${PWD}:/home/app/function" lenra/devtools-node12:beta
```

You can now access the <a href="http://localhost:4000/" target="_blank" rel="noopener">Devtools</a> to test your app.

## Deploy the hello world example to the online platform

When your application is ready to be shared with others you might find interest into deploying it to the online platform.

Create an account on [dev.lenra.io](http://dev.lenra.io). You will be asked for a token to join our developer platform, we will be sending you one as soon as possible. After successfully completing this step you will be redirected to the creation of your first project, just enter a name and the URL of the github repository that you created at the beginning of this documentation.

![New Lenra project](./img/new-lenra-project.png)

Then you will have to click `Publish my application` at the top right corner, your application will be sent to Lenra's servers and deployed to be accessible directly for the Lenra Store. Once your application is fully deployed on our servers, it will be accessible by clicking the `See my application` button. You can share this application by changing its visibility to `public` in the settings and sending the link to people (which should look close to app.lenra.io/#/app/f6279d6a-3b71-4520-a7f8-0f7b28700de9).