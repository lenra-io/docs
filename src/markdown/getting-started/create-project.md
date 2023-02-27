---
name: Create a project
---

## Create with your **favorite language**

Once the Lenra client is downloaded, you can set your preferred language to start your application with by downloading a template.

{:#templates}
- [![JavaScript](/img/languages/javascript.svg)](https://github.com/lenra-io/template-javascript)
- [![TypeScript](/img/languages/typescript.svg)](https://github.com/lenra-io/template-typescript)
- [![Rust](/img/languages/rust.svg)](https://github.com/lenra-io/template-rust)
- [![Python](/img/languages/python.svg)](https://github.com/lenra-io/template-python)
- [![V-lang](/img/languages/v-lang.svg)](https://github.com/lenra-io/template-v)
- {:.soon}
    [![Java SpringBoot](/img/languages/spring.svg)](https://github.com/lenra-io/template-java-springboot)
- {:.soon}
    [![PHP](/img/languages/php.svg)](https://github.com/lenra-io/template-php)
- {:.soon}
    [![Elixir](/img/languages/elixir.svg)](https://github.com/lenra-io/template-elixir)
- {:.soon}
    [![Ruby on Rails](/img/languages/ruby-on-rails.svg)](https://github.com/lenra-io/template-ruby-on-rails)
- {:.soon}
    [![Swift](/img/languages/swift.svg)](https://github.com/lenra-io/template-swift)
- {:.soon}
    [![Go](/img/languages/go-lang.svg)](https://github.com/lenra-io/template-go)
- {:.soon}
    [![C#](/img/languages/c-sharp.svg)](https://github.com/lenra-io/template-csharp)
    
## Create a **new lenra project**

To create a new lenra project you can just run the lenra `new command`. This command takes two parameters: 

{:.list}
- The template name 
- The project name

```bash
lenra new javascript my-app
cd my-app
```

{:.info.lenra-icon-info}
All the guides in this documentation will focus on the JavaScript template.
**Other languages work about the same and main principles remain the same too. Don't be afraid to follow these guides using another language !**

## Directory structure

First of all, we can see that this project is already versioned with git. This is a usually a good idea to commit your changes early on. This new project is a simple app that showcases a simple counter app.

About the different files :

{:.list}
- `package.json` Add your project dependency in this file like any other node project are the listeners of this project. A listener is a piece of code that will be executed when a specific action occurs. More on this later.
- `services/*.js` are modules that take care of sending API calls to Lenra. This will be helpful to create/update/delete data from the database.
- `views/*.js` are the UI parts of the application. These views can be combined to create complex UI.
- `resources/*.js` are the images and other resources you need to access from the UI.
- `index.js` is the manifest where you will register your views and listeners, create your routes etc..
- `server.js` is the webserver that will take care of the interactions with the lenra back-end. Do not update this file if you don’t know what you are doing !
- `lenra.yml` is a file that explains to the lenra CLI how to build your app. If you create a complex app that needs other steps to be built and/or started, you will need to edit this file.