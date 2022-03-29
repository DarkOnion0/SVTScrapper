# 🧬 SVTScrapper

> *A little overengineered app to make a SVT homework 😅*

I made SVTSCrapper to automate a painful task of one of my SVT homework. Therefore, this app is a more funny script than a real-world app 
that will be useful to anyone. So don't be disappointed if this badly made/optimized because the app was mainly designed to introduce 
myself to typescript and web scrapping.

# 🚀 Main feature
Automatically resolve a graph for simulating the genetic drifting

# 💾 Installation
> *I presume that you are on a [nix compatible system](https://nixos.org/manual/nix/stable/installation/supported-platforms.html), if not (like windows), please install a VM, WSL2 (windows only)...*

1. [Install nix](https://nixos.org/manual/nix/stable/installation/installing-binary.html)
2. [Install direnv](https://github.com/direnv/direnv) to automatically switch inside the nix-shell, mostly for development purpose (OPTIONAL)
3. Run `nix-shell` in the project root and watch the magic append ✨ !

# 🏃 Running
You just need to type `yarn run start`, it will format, lint, compile and run the code. The result of the scrapping will be printed in the console 
at the end of each test.

Currently, if you want to customize the test you need to directly edit the source code and more specifically the `main.ts` file
