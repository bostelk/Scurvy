var Crew = function() {
    this.name = WordSmith.getCrewName();
    this.morale = Crew.MoraleEnum.Happy;
    this.hunger = Crew.HungerEnum.Full;
    this.rank = Crew.RankEnum.DeckHand;
}

Crew.prototype.getValue = function() {
    return 100;
};

Crew.HungerEnum = {
    Starving : 0,
    Hungry : 1,
    Content : 2,
    Full : 3,
}

Crew.HungerValues = {
    0 : "Starving",
    1 : "Hungry",
    2 : "Content",
    3 : "Full",
}

Crew.MoraleEnum = {
    Happy : 0,
    Content : 1,
    UnHappy : 3,
    Mutinous : 4,
}

Crew.MoraleValues = {
    3 : "Happy",
    2 : "Content",
    1 : "Unhappy",
    0 : "Mutinous",
}

Crew.RankEnum = {
    Captain : 0,
    FirstMate : 1,
    Bosun : 2,
    WatchLeader : 3,
    DeckHand : 4,
    Cook : 5,
}


Crew.RankValues =  {
    0 : "Captain",
    1 : "First Mate",
    2 : "Bosun",
    3 : "WatchLeader",
    4 : "DeckHand",
    5 : "Cook",
}
