var Crew = function() {
    this.name = GetRandomPerson();
    this.morale = 0;
    this.hunger = 3;
    this.rank = 4;
}

Crew.HungerEnum = {
    "Starving" : 0,
    "Hungry" : 1,
    "Content" : 2,
    "Full" : 3,
}

Crew.MoraleEnum = {
    "Happy" : 0,
    "Content" : 1,
    "UnHappy" : 3,
    "Mutinous" : 4,
}

Crew.RoleEnum = {
    "Captain" = 0,
    "First Mate" = 1,
    "Bosun" = 2,
    "Watch Leader" = 3,
    "DeckHand" = 4,
    "Cook" = 5,
}
