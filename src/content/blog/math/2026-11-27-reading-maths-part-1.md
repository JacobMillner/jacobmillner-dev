---
title: 'Reading maths, part 1: p(t), subscripts, and the big E'
description: 'A survival guide for reading equations out loud, starting with p(t) = a + (b−a)t.'
pubDate: 2026-11-27
tags: ['math']
draft: true
---

Mathematical notation isn't maths — it's compression. Every symbol is a
sentence with the vowels removed. The trick is to read it out loud: once you
can say it, you can understand it. Part 1 covers the survival kit, using one
equation from the [Godot tweening
post](/blog/2026-11-27-tweening-a-vector3-along-a-parabola-in-godot/) as the
specimen.

## p(t) is "p of t"

$$
p(t) = \mathbf{a} + (\mathbf{b} - \mathbf{a})\,t
$$

Start on the left. $p$ is the name of a machine — a *function*: you feed it
an input, it hands you an output. $t$ is the input. So $p(t)$ reads "p of t",
or "p at t": *the value of p when the input is t*. The parentheses mean "of",
not multiply. That's the single most common misreading in all of maths.

And the `=` here doesn't claim a fact of nature. In a definition it means
"is built as": here's how to compute p for whatever t you hand me.

## Decoding the right side

- $\mathbf{a}$, $\mathbf{b}$ — bold letters are *vectors* (arrows; here, the
  start and end positions). Plain italics like $t$ are ordinary numbers.
- $(\mathbf{b} - \mathbf{a})$ — vector subtraction: "the displacement from a
  to b", the arrow you'd travel to get there.
- $(\mathbf{b} - \mathbf{a})\,t$ — things sitting next to each other are
  multiplied. Scale the displacement by $t$.
- $\mathbf{a} + \ldots$ — add that scaled arrow onto the start.

Read aloud: *the position at t is the start, plus t times the trip.* Sanity
check: $t = 0$ gives $\mathbf{a}$, and $t = 1$ gives
$\mathbf{a} + (\mathbf{b} - \mathbf{a}) = \mathbf{b}$. The formula is a ramp
from start to finish — that's all lerp ever was.

## Subscripts

$x_1, x_2, x_3$ read "x sub one", "x sub two", and so on: numbered copies of
the same thing. The little index is a counter — $x_i$ means "whichever x the
counter $i$ is pointing at". It's not a new variable, it's a slot in a list.

## The big E

That big $\Sigma$ isn't an E at all — it's capital sigma, Greek for S, and it
means **sum**. It's a for-loop:

$$
\sum_{i=1}^{n} x_i \;=\; x_1 + x_2 + \cdots + x_n
$$

Read it like loop header: below the sigma, "$i$ starts at 1"; on top, "runs
to $n$"; to the right, "add up xᵢ on each pass". Micro-example:

$$
\sum_{i=1}^{3} i^2 = 1 + 4 + 9 = 14
$$

Once you know the big E, it's everywhere. The average of a list is literally
"add them up, divide by how many":

$$
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
$$

The bar over the $x$ is "x-bar" — just a name meaning "the averaged one".

## The rest of the squiggles

| You see | You say | It means |
| --- | --- | --- |
| $2t$ | "two t" | multiply — adjacency is times |
| $\mathbf{v}$ | "v bold" | a vector, not a number |
| $f'$ | "f prime" | a derived version of f (slopes — part 2) |
| $\prod$ | "product" | like $\Sigma$, but multiply each pass |
| $x \in S$ | "x in S" | membership — x is one of the things in S |
| $\cdots$ | "dot dot dot" | the pattern continues, you get it |

Rule of thumb: when a symbol freaks you out, find out what it *does* and say
that out loud. It's almost always a small verb wearing a costume.

Homework: read $\mathbf{m} = \frac{\mathbf{a} + \mathbf{b}}{2}$ out loud —
and notice you just decoded the midpoint formula.
