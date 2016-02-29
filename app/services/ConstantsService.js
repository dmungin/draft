(function() {
    'use strict'
    angular.module('draftApp').factory('constantsService', constantsService);
    function constantsService() {
        function getTeams() {
            return [
                {"name" : "Seattle Seahawks" , "abbreviation" : "SEA"},
                {"name" : "St. Louis Rams", "abbreviation" : "STL"},
                {"name" : "Buffalo Bills" , "abbreviation" : "BUF"},
                {"name" : "Houston Texans" , "abbreviation" : "HOU"},
                {"name" : "Arizona Cardinals" , "abbreviation" : "ARI"},
                {"name" : "Denver Broncos", "abbreviation" : "DEN"},
                {"name" : "Carolina Panthers", "abbreviation" : "CAR"},
                {"name" : "New England Patriots", "abbreviation" : "NE"},
                {"name" : "Green Bay Packers", "abbreviation" : "GB"},
                {"name" : "Baltimore Ravens", "abbreviation" : "BAL"},
                {"name" : "New York Jets", "abbreviation" : "NYJ"},
                {"name" : "Miami Dolphins", "abbreviation" : "MIA"},
                {"name" : "Cincinnati Bengals", "abbreviation" : "CIN"},
                {"name" : "Kansas City Chiefs", "abbreviation" : "KC"},
                {"name" : "San Francisco 49ers", "abbreviation" : "SF"},
                {"name" : "Philadelphia Eagles", "abbreviation" : "PHI"},
                {"name" : "Detroit Lions", "abbreviation" : "DET"},
                {"name" : "Cleveland Browns", "abbreviation" : "CLE"},
                {"name" : "Pittsburgh Steelers", "abbreviation" : "PIT"},
                {"name" : "Minnesota Vikings", "abbreviation" : "MIN"},
                {"name" : "Dallas Cowboys", "abbreviation" : "DAL"},
                {"name" : "Indianapolis Colts", "abbreviation" : "IND"},
                {"name" : "Jacksonville Jaguars", "abbreviation" : "JAC"},
                {"name" : "New York Giants", "abbreviation" : "NYG"},
                {"name" : "Tampa Bay Buccaneers", "abbreviation" : "TB"},
                {"name" : "Chicago Bears", "abbreviation" : "CHI"},
                {"name" : "San Diego Chargers", "abbreviation" : "SD"},
                {"name" : "New Orleans Saints", "abbreviation" : "NO"},
                {"name" : "Atlanta Falcons", "abbreviation" : "ATL"},
                {"name" : "Washington Redskins", "abbreviation" : "WAS"},
                {"name" : "Tennessee Titans", "abbreviation" : "TEN"},
                {"name" : "Oakland Raiders", "abbreviation" : "OAK"}
            ];
        }
        function getRosterSpots() {
            var ROSTER_SPOTS = ['QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'FLEX', 'DEF', 'K'];
            //TODO:: Make bench length variable based
            for(var i=1; i <=7; i++) ROSTER_SPOTS.push('BE'+i);
            return ROSTER_SPOTS;
        }
        return  {
            getTeams: getTeams,
            getRosterSpots: getRosterSpots
        };
    }
})();

