---
title: An Intro Post
date: 2023/01/03
description: A small introductory post.
tag: meta
author: Alaina
---

in Rust because yes

```sh
cat me.rs
```

```rust
/// hey it's a person
struct Person {
  name: String,
  description: String,
  pronouns: [String; 2],
}

fn main() {
  /// omg it's me
  let me = Person {
    name: "Alaina",
    description: "trans girl enamored with cs with a passion for programming",
    pronouns: ["she", "her"],
  };

  println!("{me:#?}");
}
```
