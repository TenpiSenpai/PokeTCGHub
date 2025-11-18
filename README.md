# Poke TCG Hub
Just a unified community supported resource for the Pokemon TCG.

## How to add cards
Cards consist of two pieces. The data and the image. 

### Images 
The images go into public/images/sets. These are split between jp(Japanese) and en(English). They then use the set code (TWM, M2A, etc.) from there. 
- Use the 3 digit card number to name it
- keep the file size less than 60KBs

### Card Data
The card info is based on the following schema
```yaml
name: Name of the card
type: see /app/classes/types.ts
subtype: Used for Trainers: Supporter, Item, Pokemon Tool, Stadium, etc.
hp: number
stage: 0, 1, 2, 3
evolve-from: name of what it evolves from. blank on basics
ability: 
    name: name of ability
    desc: description of ability
attack:
    - energy: energy costs based on the type code e.g.(LLC) for Lightning Lightning Colorless
      name: name of the attack
      damage: damage of the attack (30, 30x, 30+, 30-)
      desc: additional description of the attack
trainer:
    - the lines of text on the trainer card
weak: weakness type code (L for Lightning)
resist: resistance type code
retreat: number
img:
    en: ref to image file e.g. /en/blk/031.jpg
    jp: ref to image file e.g. /jp/m2a/031.jpg
ref:
    set: set name e.g. twm
    num: card number of the referred to card. this card and set must exist
    from: additional text about the reference (Reprinted from Black Bolt, Source from MEGA Dream ex, etc.)
```