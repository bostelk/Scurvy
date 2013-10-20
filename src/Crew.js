var Crew = function() {
    this.name = WordSmith.getCrewName();
    this.morale = Crew.MoraleEnum.Happy;
    this.hunger = Crew.HungerEnum.Full;
    this.rank = Crew.RankEnum.DeckHand;
}

Crew.getCost = function(rank) {
    switch (rank) {
        case Crew.RankEnum.Captain:
            return 10000;
        case Crew.RankEnum.FirstMate:
            return 1000;
        case Crew.RankEnum.WatchLeader:
            return 500;
        case Crew.RankEnum.Cook:
            return 300;
        case Crew.RankEnum.Bosun:
            return 200;
        case Crew.RankEnum.DeckHand:
            return 100;
        default:
            return 0;
    };
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

Crew.RankSymbols = {
    0 : "%c{gold}C%c{}",
    1 : "%c{green}F%c{}",
    2 : "%c{pink}B%c{}",
    3 : "%c{red}%W{}",
    4 : "%c{orange}D%c{}",
    5 : "%c{teal}c%c{}"
}
