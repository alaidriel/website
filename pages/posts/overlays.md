---
title: Creating a Nix Overlay
date: 2023/01/04
description: How I created a custom Nix overlay for distributing my projects.
tag: nix,flakes,overlays
author: Alaina
---

## Intro

Lately I've been working on a couple projects in Rust, and I was wondering how I could package these projects. The obvious option with Rust is hosting it on [crates.io](https://crates.io), which I did, in fact, use to host [etherea](https://github.com/alaidriel/etherea), a CHIP-8 interpreter in Rust.

But since I've also been using Nix, I decided to try packaging the projects with Nix and distributing them using a **Nix overlay** hosted on GitHub. It took a lot of digging to finally figure out how to create one, so I decided that I may as well write this post explaining how to do it in case anyone was curious.

## Creating the Derivation

The first thing I did was figure out how `stdenv.mkDerivation` worked, which is how you create a derivation in Nix. For my purposes, these fields were sufficient:

```nix
with import <nixpkgs> {};

pkgs.stdenv.mkDerivation {
    pname = "";
    version = "";

    src = self;
    
    buildInputs = [];
    
    buildPhase = "";
    
    installPhase = "";
}
```

I'll fill out each of these in turn. First: `pname` and `version`. These are pretty straightforward. Simply replace `pname` and `version` with the name and version of your package.

```nix {3,4}
# --snip--
pkgs.stdenv.mkDerivation {
    pname = "etherea";
    version = "0.2.3";
    # --snip--
}
```

Now, for `src`. This one is slightly more involved. There are a couple of methods here, but the one I'll be using is `fetchFromGitHub`:

```nix {2-7} 
pkgs.stdenv.mkDerivation {
    src = pkgs.fetchFromGitHub {
        owner = "alaidriel";
        repo = "etherea";
        rev = "5f0df4094055a783b35ffcbd514eff4dd1407155";
        sha256 = lib.fakeSha256;
    };
}
```

The owner and repo fields are self-explanatory. `rev` is the commit hash of the latest commit, or the name of a tag. `sha256` is the interesting field here, and represents a SHA-256 hash of the contents of the repository. We use `lib.fakeSha256`, because we don't know the SHA-256 hash yet.

The next field, `buildInputs`, is a list of the necessary dependencies to build the package. For `etherea`, this is `rustc`, `cargo`, and several macOS frameworks.

```nix {3-6}
pkgs.stdenv.mkDerivation {
    #--snip--
    buildInputs = with pkgs; [
        rustc
        cargo
        #--snip--
    ];
}
```

The next two fields are how Nix should build the package.

```nix {3-10}
pkgs.stdenv.mkDerivation {
    #--snip--
    buildPhase = ''
        cargo build --release
    '';

    installPhase = ''
        mkdir -p $out/bin
        cp ./target/release/etherea $out/bin
    '';
}
```

The special part here is the `$out` directory, which simply represents the path of the derivation in the nix store (i.e. `/nix/store/hash-pname-version`).

Now, running `nix-build` should result in an error.

```sh
nix-build default.nix
```

The error can be fixed by replacing `lib.fakeSha256` with the real SHA-256 that Nix provides us with:

```nix /sha256-Ydqfl0SkfhwjQKIsM22MNgY14L9jlJkZzXJyjX4rVGg=/
# sha256 = lib.fakeSha256;
sha256 = "sha256-Ydqfl0SkfhwjQKIsM22MNgY14L9jlJkZzXJyjX4rVGg=";
```

We'll also need to make one more change:

```diff /{ pkgs, ... }:/ 
# with import <nixpkgs> {};
{ pkgs, ... }:
```

This is for using the flake-provided `nixpkgs` that we'll create in the next section.

## Creating the Flake

Now, after storing our `mkDerivation` declaration at `pkgs/etherea.nix`, we can create the following `flake.nix`:

```nix {14}
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-compat = { url = "github:edolstra/flake-compat"; flake = false; };
  };

  outputs = { self, nixpkgs, ... }:
    let
      pkgs = import nixpkgs {
        system = "x86_64-darwin";
      };
    in
    {
      overlay = final: prev: { };
    };
}
```

If you're unfamilar with nix flakes, I recommend checking out https://nixos.wiki/wiki/Flakes. To actually create the overlay, we specify an `overlay` output and declare an attrset of the packages we want to provide with the overlay. We'll add an entry for `etherea`:

```nix {2}
overlay = final: prev: {
    etherea = pkgs.callPackage ./pkgs/etherea.nix { inherit pkgs; };
};
```

Now, we'll add a `flake-compat.nix` and `default.nix`:

```nix
# flake-compat.nix
(import
  (
    let
      lock = builtins.fromJSON (builtins.readFile ./flake.lock);
    in
    fetchTarball {
      url = "https://github.com/edolstra/flake-compat/archive/${lock.nodes.flake-compat.locked.rev}.tar.gz";
      sha256 = lock.nodes.flake-compat.locked.narHash;
    }
  )
  {
    src = ./.;
  }).defaultNix
```

```nix
# default.nix
final: prev:
(import ./flake-compat.nix).overlay final prev
```

The contents aren't *super* important, but note that we read the `flake.lock` file to fetch the correct revision for `flake-compat`. These will provide support for users not using flakes.

## Conclusion

If everything is working properly, after pushing to GitHub, using these packages in a NixOS or `nix-darwin` configuration should be as easy as specifying the overlay as an input: 

```nix
inputs.personal.url = "github:owner/your-overlay";
```

and then specifying it as an overlay:

```nix {2}
nixpkgs.overlays = [
    personal.overlay
];
```

Thanks for reading!

## Resources

- I found a lot of the overlay examples on the internet difficult to parse, so here's my full (simple) overlay example: [https://github.com/alaidriel/nix-overlay](https://github.com/alaidriel/nix-overlay/tree/bc544eeaa7eecb106467151327c34b4225f438fc).
