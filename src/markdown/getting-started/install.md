---
position: 1
---

## General **requirements**

First of all, you have to install [{:rel="noopener" target="_blank"}git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [{:rel="noopener" target="_blank"}Docker](https://docs.docker.com/engine/install/) and [{:rel="noopener" target="_blank"}Docker Compose](https://docs.docker.com/compose/install/) (standalone version is prefered) on your computer.

Use the next commands to check if you have the right version installed:
ni
```bash
# Any git version is fine
git --version
# A mimimum of 2.0.0 is required for docker-compose
docker-compose --version
```

You also could have the Docker Compose plugin but there is a [{:rel="noopener" target="_blank"}bug when displaying logs](https://github.com/docker/compose/issues/10179), so we recommend you to use the standalone version.

```bash
# A mimimum of 2.0.0 is required
docker compose --version
```

## Install Lenra CLI

{:.or}
- ### using **cargo**
    Simply install the latest package using the [{:rel="noopener" target="_blank"}cargo CLI](https://doc.rust-lang.org/cargo/getting-started/installation.html):

    ```bash
    cargo install lenra_cli
    ```

    For more installation instructions, you can directly check the CLI repository.

    [{:.btn.link.lenra-icon-arrow-right rel="noopener" target="_blank"}Check the CLI repository](https://github.com/lenra-io/lenra_cli)
- ### using **the binary**
    <details id="download-linux" open><summary class="lenra-icon-linux">Lenra for Linux</summary>

    - [{:.btn.link.lenra-icon-download target="_blank" rel="noopener" target="_blank"}lenra-linux-x86_64](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-linux-x86_64)

    - [{:.btn.link.lenra-icon-download target="_blank" rel="noopener" target="_blank"}lenra-linux-aarch64](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-linux-aarch64)

    </details>
    <details id="download-windows"><summary class="lenra-icon-windows">Lenra for Windows</summary>

    - [{:.btn.link.lenra-icon-download target="_blank" rel="noopener" target="_blank"}lenra-windows-x86_64.exe](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-windows-x86_64.exe)
    <!-- - [{:.btn.link.lenra-icon-download target="_blank" rel="noopener" target="_blank"}lenra-windows-aarch64.exe](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-windows-aarch64.exe) -->

    </details>
    <details id="download-macos"><summary class="lenra-icon-apple">Lenra for MacoS</summary>

    - [{:.btn.link.lenra-icon-download target="_blank" rel="noopener" target="_blank"}lenra-macos-x86_64](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-macos-x86_64)
    - [{:.btn.link.lenra-icon-download target="_blank" rel="noopener" target="_blank"}lenra-macos-aarch64](https://github.com/lenra-io/lenra_cli/releases/latest/download/lenra-macos-aarch64)

    </details>

    Download the latest binary, save it where you want and update your $PATH environment variable to use it as `lenra` (or `lenra.exe` for Windows).

    For unix based system users, you can use the next command to add it to your $PATH temporarily:

    ```bash
    export PATH="/my/path/to/lenra_cli:$PATH"
    ```

    For windows users, you can use the next command to add it to your $PATH temporarily:

    ```bash
    set PATH="C:\my\path\to\lenra_cli;%PATH%"
    ```

Check your installation using the next command:

```bash
lenra --version
```
