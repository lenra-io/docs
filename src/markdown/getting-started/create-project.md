---
name: Create a project
---
    
## Create a **new Lenra project**

Once the Lenra CLI is downloaded, you can use it to create a new Lenra app from a template.

To create a new Lenra project you can just run the `lenra new` command. This command takes two parameters, the app template name ([see the available templates](#createwithyourfavoritelanguage)) and an optional target directory (if not defined, the project will be created in the current directory).

```bash
# new app from javascript template in a new 'my-app' directory
lenra new javascript my-app
# move to the new app dir
cd my-app
# initialize git versionning
git init
# start your app
lenra dev
```



## Create with your **favorite language**

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
