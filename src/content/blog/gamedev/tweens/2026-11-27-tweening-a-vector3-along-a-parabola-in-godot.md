---
title: 'Tweening a Vector3 along a parabola in Godot'
description: 'The lerp-plus-bump trick for pretty arcs, explained simply with pictures.'
pubDate: 2026-11-27
tags: ['godot', 'tweens']
draft: true
---

You want a coin, a grenade, or a fireball to lob from A to B in a satisfying
arc. Godot's `Tween` has a whole menu of easing — `TRANS_BOUNCE`,
`TRANS_ELASTIC`, `TRANS_SINE` — but every one of them bends *time*, not
*space*. Your object still travels the straight line from A to B; it just
changes its mind about how fast to travel it.

The fix is one line of math, and it's the same trick in 2D and 3D. We'll plot
it in 2D so you can see it work.

## What a tween actually gives you

A linear tween is a stopwatch: it hands you a number `t` that runs from 0 to
1 over the duration. That's all it does. Position, color, rotation — whatever
you want to change, *you* compute from `t`.

## The straight line

Walking from $\mathbf{a}$ to $\mathbf{b}$ at fraction $t$ of the way:

$$
\mathbf{p}(t) = \mathbf{a} + (\mathbf{b} - \mathbf{a})\,t
$$

In Godot that's `a.lerp(b, t)`. At $t = 0.5$ you're exactly halfway between
the two points. Useful, but it's a diagonal, not a lob.

*(If $p(t)$ or the formula above reads like static, there's a short primer on
decoding exactly this kind of thing: [Reading maths, part
1](/blog/2026-11-27-reading-maths-part-1/).)*

## The bump

So we add a *bump*: a term that's zero at both ends and tallest in the
middle, so the object lifts off and settles back down. The simplest
polynomial that behaves like that is:

$$
b(t) = 4t(1 - t)
$$

Check the ends: $t = 0$ gives $0$ and $t = 1$ gives $0$, so the bump vanishes
wherever the straight line takes over. In the middle, $t = 0.5$ gives
$4 \cdot 0.5 \cdot 0.5 = 1$. Plotted, it's an upside-down parabola with its
peak normalized to exactly 1:

```chart
{
  "type": "line",
  "data": {
    "labels": [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1],
    "datasets": [
      {
        "label": "4t(1−t)",
        "data": [0, 0.19, 0.36, 0.51, 0.64, 0.75, 0.84, 0.91, 0.96, 0.99, 1, 0.99, 0.96, 0.91, 0.84, 0.75, 0.64, 0.51, 0.36, 0.19, 0],
        "borderColor": "#00bf86",
        "backgroundColor": "rgba(0, 191, 134, 0.15)",
        "fill": true,
        "tension": 0.4,
        "pointRadius": 0
      }
    ]
  },
  "options": {
    "scales": { "y": { "min": 0, "max": 1.1 } }
  }
}
```

**Why the 4?** On its own, $t(1-t)$ only reaches $\tfrac{1}{4}$ at its peak —
the bump would top out at 0.25 and your "height" setting would mean a quarter
of what you said. Multiplying by 4 rescales the peak to exactly 1, so the
height you pick means what you want it to mean: `height = 2` lifts the arc
2 units above the line. No asterisks.

## Putting it together

Add the bump, scaled by your peak height $h$, straight up:

$$
\mathbf{p}(t) = \mathbf{a} + (\mathbf{b} - \mathbf{a})\,t \;+\; \hat{y}\,h\,4t(1-t)
$$

Here's the 2D version, plotted from $A = (0, 0)$ to $B = (10, 2)$ with
$h = 3$. The dashed line is the plain lerp; the green arc is where the object
actually flies:

```chart
{
  "type": "scatter",
  "data": {
    "datasets": [
      {
        "label": "lerp(A, B, t) — the straight line",
        "data": [
          {"x": 0, "y": 0}, {"x": 1, "y": 0.2}, {"x": 2, "y": 0.4},
          {"x": 3, "y": 0.6}, {"x": 4, "y": 0.8}, {"x": 5, "y": 1},
          {"x": 6, "y": 1.2}, {"x": 7, "y": 1.4}, {"x": 8, "y": 1.6},
          {"x": 9, "y": 1.8}, {"x": 10, "y": 2}
        ],
        "showLine": true,
        "borderColor": "#9e9a9a",
        "borderDash": [6, 4],
        "pointRadius": 0
      },
      {
        "label": "line + h·4t(1−t) — the arc",
        "data": [
          {"x": 0, "y": 0}, {"x": 0.5, "y": 0.67}, {"x": 1, "y": 1.28},
          {"x": 1.5, "y": 1.83}, {"x": 2, "y": 2.32}, {"x": 2.5, "y": 2.75},
          {"x": 3, "y": 3.12}, {"x": 3.5, "y": 3.43}, {"x": 4, "y": 3.68},
          {"x": 4.5, "y": 3.87}, {"x": 5, "y": 4}, {"x": 5.5, "y": 4.07},
          {"x": 6, "y": 4.08}, {"x": 6.5, "y": 4.03}, {"x": 7, "y": 3.92},
          {"x": 7.5, "y": 3.75}, {"x": 8, "y": 3.52}, {"x": 8.5, "y": 3.23},
          {"x": 9, "y": 2.88}, {"x": 9.5, "y": 2.47}, {"x": 10, "y": 2}
        ],
        "showLine": true,
        "borderColor": "#00bf86",
        "backgroundColor": "rgba(0, 191, 134, 0.12)",
        "fill": "origin",
        "tension": 0.4,
        "pointRadius": 0
      }
    ]
  },
  "options": {
    "scales": {
      "x": { "type": "linear", "min": 0, "max": 10 },
      "y": { "min": 0 }
    }
  }
}
```

One detail worth noticing: the arc's summit isn't exactly halfway across.
The peak lands `height` above the *midpoint of the line* — and since B is
higher than A here, that summit slides a little toward B. If you want the
apex over a specific spot, aim the line, not the bump.

In Godot 4, `Tween.tween_method()` runs your formula every frame:

```gdscript
func lob(target: Vector3, height: float, duration: float) -> void:
    var start := global_position
    var tween := create_tween()
    tween.set_trans(Tween.TRANS_LINEAR)  # the parabola IS the easing
    tween.tween_method(
        func(t: float) -> void:
            global_position = start.lerp(target, t) \
                + Vector3.UP * height * 4.0 * t * (1.0 - t),
        0.0, 1.0, duration
    )
```

`TRANS_LINEAR` matters. The parabola is already your easing — stack
`TRANS_QUAD` on top and the curve gets bent twice: lopsided arc, weird
speed, subtle ick.

## Two details

- **Uneven ground is free.** If B is higher than A, `lerp` carries the climb
  and the bump still adds its symmetric arc on top. No extra math needed.
- **If you need real physics** — the target moves mid-flight, the arc has to
  clear a wall convincingly — skip tweens entirely: launch with a velocity
  and let gravity integrate. The tween version is for the 95% of cases where
  you just want a pretty, deterministic arc from here to there.

That's the whole trick: a linear tween for time, a lerp for space, and a
$4t(1-t)$ for the smile.
