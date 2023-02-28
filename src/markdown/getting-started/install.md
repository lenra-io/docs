---
position: 1
---

## General **requirements**

First of all, you have to install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) (standalone version is prefered) on your computer.

## Install Lenra CLI using **cargo**

Simply install the latest package using the cargo-cli.

```bash
cargo install lenra_cli@version
```

For more installation instructions, you can directly check the CLI repository.

[{:.btn.primary}Check the CLI repository](https://github.com/lenra-io/lenra_cli)

## Install Lenra CLI using **the binary**

<details id="download-linux" open><summary class="lenra-icon-linux">Lenra for Linux</summary>

- [{:.btn.link.lenra-icon-download target="_blank" rel="noopener"}lenra-linux-x86_64.tar.gz](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-linux-x86_64.tar.gz)

- [{:.btn.link.lenra-icon-download target="_blank" rel="noopener"}lenra-linux-aarch64.tar.gz](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-linux-aarch64.tar.gz)

</details>
<details id="download-windows"><summary class="lenra-icon-windows">Lenra for Windows</summary>

- [{:.btn.link.lenra-icon-download target="_blank" rel="noopener"}lenra-windows-x86_64.tar.gz](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-windows-x86_64.tar.gz)
<!-- - [{:.btn.link.lenra-icon-download target="_blank" rel="noopener"}lenra-windows-aarch64.tar.gz](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-windows-aarch64.tar.gz) -->

</details>
<details id="download-macos"><summary class="lenra-icon-apple">Lenra for MacoS</summary>

- [{:.btn.link.lenra-icon-download target="_blank" rel="noopener"}lenra-macos-x86_64.tar.gz](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-macos-x86_64.tar.gz)
- [{:.btn.link.lenra-icon-download target="_blank" rel="noopener"}lenra-macos-aarch64.tar.gz](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-macos-aarch64.tar.gz)

</details>

Download the latest binary, unpack it where you want and update your $PATH

```bash
export PATH="/my/path/to/lenra_cli:$PATH"
```