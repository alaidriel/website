---
title: "Nix: An Introduction"
date: 2023/01/05
description: An adventure into the Nix expression language and the Nixpkgs standard library to improve my overlay.
tag: nix,flakes
author: Alaina
---

## Intro

In the [last post](/posts/overlays), I wrote about creating a custom overlay for my personal projects, jumping in straight at the deep end. After adding the ability to use `nix build` and `nix profile` to build and install my packages, respectively, I decided it was time for some refactoring to reduce repetition:

```nix {10-11,16-17}
flake-utils.lib.eachDefaultSystem
    (system: {
        packages =
          let
            pkgs = import nixpkgs {
              inherit system;
            };
          in
          {
            etherea = pkgs.callPackage ./pkgs/etherea.nix { inherit pkgs; };
            athena = pkgs.callPackage ./pkgs/athena.nix { inherit pkgs; };
          };
      }) // {
      overlays.default = final: prev:
        let pkgs = prev; in {
          etherea = pkgs.callPackage ./pkgs/etherea.nix { inherit pkgs; };
          athena = pkgs.callPackage ./pkgs/athena.nix { inherit pkgs; };
        };
    };
```
This isn't a very nice solution because it requires repeating the same `attrset` for both `overlays` and `packages`, which I found pretty cumbersome. If I decide to add more package, I imagine this would get annoying pretty quick. There must be a better way to do this, right? 

There is! Enter `nix repl`: a tool for evaluating Nix expressions (and my best friend for several hours).

## nix repl

Nix has a wide variety of useful builtins and lib functions for a lot of things that I expect from a functional language. 

After delving through the `nixpkgs` source code on GitHub, I found the crucial component: a way to read from the filesystem. **Behold:** `listFilesRecursive`, a function under `lib.filesystem` which forms a flattened list of all the files in a directory, recursively. Sounds like just what I want!

- **Sidenote:** Nix offers a nice reference for the builtins [here](https://nixos.org/manual/nix/stable/language/builtins.html) and the standard library [here](https://nixos.org/manual/nixpkgs/stable/#sec-functions-library). I didn't look quite well enough, and didn't find those until *after* all this.

Time to test it:

```sh
nix repl
```

```nix
nix-repl> with import <nixpkgs> {}; lib.filesystem.listFilesRecursive ./pkgs
[ /Users/aly/Documents/personal/projects.nosync/nix-overlay/pkgs/athena.nix /Users/aly/Documents/personal/projects.nosync/nix-overlay/pkgs/etherea.nix ]
```

Ok, that looks *mostly* like what I want, but all I want is the name of the package; the `<package>` portion of `/.../<package>.nix`. Turns out, `lib` also contains `removePrefix` and `removeSuffix`. With this, we can turn `.../athena.nix` into the string we want. But wait! This is is a `path`, not a `string`. Fortunately, converting the former to the latter is as simple as a `toString`. 

```nix
nix-repl> with import <nixpkgs> {}; lib.removePrefix ((toString ./pkgs) + "/") 
(toString /Users/aly/Documents/personal/projects.nosync/nix-overlay/pkgs/athena.nix)
"athena.nix"
```

Now, with a `lib.removeSuffix ".nix" "athena.nix"{:nix}`, we have `"athena"{:nix}`, which is exactly what we want! But wait, we want to apply this to *every* package in the `pkgs` directory, not just that one. Luckily, `builtins.map` does exactly what we want: takes each element of a list, and applies a transformation to it.

```nix
nix-repl> with import <nixpkgs> {}; (builtins.map (x: lib.removeSuffix ".nix" x)
	(builtins.map
	(x: lib.removePrefix (toString ./pkgs + "/") (toString x))
	(lib.filesystem.listFilesRecursive ./pkgs)))
```

```nix
# output
[ "athena" "etherea" ]
```

Perfect! but how do we convert this into a Nix `attrset`? Fortunately, `lib.genAttrs` provides this very useful utility to generate an attribute set over a list, mapping each item to a value. It looks like this:

```nix
nix-repl> with import <nixpkgs> {}; lib.genAttrs 
	[ "athena" "etherea" ] 
	(name: pkgs.callPackage ./pkgs/${name}.nix { inherit pkgs; })
```

Which produces the following output:

```nix
{ 
	athena = «derivation /nix/store/15ac7nilra0ad9llx26chdjlj3gc96g6-athena-0.1.0.drv»; 
	etherea = «derivation /nix/store/pkss4p0wwz6w57gvd3zqyzdsvq3xcjfn-etherea-0.2.3.drv»; 
}
```

As it turns out, this is exactly what I wanted. Now, I can specify this `attrset` for both the `packages` and `overlays`.

The new flake outputs look like this:

```nix {3-8,18,20}
outputs = { self, nixpkgs, flake-utils, ... }:
    let
      genPkgs = pkgs: with pkgs; lib.genAttrs
        (builtins.map (x: lib.removeSuffix ".nix" x)
          (builtins.map
            (x: lib.removePrefix (toString ./pkgs + "/") (toString x))
            (lib.filesystem.listFilesRecursive ./pkgs)))
        (name: pkgs.callPackage ./pkgs/${name}.nix { inherit pkgs; });
    in
    flake-utils.lib.eachDefaultSystem
      (system: {
        packages =
          let
            pkgs = import nixpkgs {
              inherit system;
            };
          in
          genPkgs pkgs;
      }) // {
      overlays.default = final: prev: genPkgs prev;
    };
```

I've created a function, `genPkgs`, which takes as its sole argument the `pkgs` instance. With this, my overlay should be able to scale to a much larger numbers of packages without cluttering `flake.nix`.

## Conclusion

As I was searching the web trying to figure out how to do this, I was surprised by how *little* information there is about using the expression language on sites like StackOverflow, or even Google, where I'm usually able to figure out everything I need (granted I was asking about my specific problem, not looking for a reference). The Nix reference didn't seem to show up in search results much either. Turns out, https://nixos.org/learn.html had all the information I needed without having to dig through Nixpkgs source code.

This was really fun, though! I ended up learning quite a bit about `nix` and how it integrates with `nixpkgs`, even if it wasn't exactly the easiest way to do so~

That's all I have on Nix for now. Thanks for reading!