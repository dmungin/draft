var express = require('express'),
	fs = require('fs'),
	request = require('request'),
	cheerio = require('cheerio'),
	db = require('mongoskin').db('mongodb://localhost:27017/draft'),
 	bodyParser = require('body-parser'),
 	ObjectID = require('mongodb').ObjectID,
	app = express();
	
/* Set relative paths */
app.use('/css', express.static(__dirname + '/css'));
app.use('/', express.static(__dirname + '/app'));
app.use('/templates', express.static(__dirname + '/templates'));
// parse application/json
app.use(bodyParser.json({limit: '5mb'}));

app.get('/getDrafts', function(req, res) {
	var draftJSON = {};
	db.collection('drafts').find().toArray(function(err, result) {
	    if (err) throw err;
	    draftJSON.drafts = result;
	    res.send(draftJSON);
	});	
});
app.get('/getDraft', function(req, res) {
    var draftJSON = {};
    db.collection('drafts').findById(req.query.currentDraftID, function(err, result) {
        if (err) throw err;
        draftJSON.draft = result;
        res.send(draftJSON);
    });
});
app.post('/addDraft', function(req, res) {
	var draftJSON = {},
		newDraft = new Draft(req.body.draft),
		owners = fillLeague(req.body.draft.size, req.body.draft.leagueName);
	db.collection('drafts').insert(newDraft, function(err, result) {
	    if (err) throw err;
	    if (result) {
	    	console.log('Added Draft!');
	    	draftJSON.draft = result[0];
	    	res.send(draftJSON);
	    }
	});
	db.collection('owners').insert(owners, function(err, result) {
	    if (err) throw err;
	    if (result) {
	    	console.log('Added Owners!');
	    }
	});
});
app.post('/updateDraft', function(req, res) {
	var draftJSON = {},
	setJSON = {'currentPick' : req.body.currentPick};
    if(typeof req.body.updatedPick !== 'undefined') {
        setJSON['pickList.' + req.body.updatedPick.pick] = req.body.updatedPick;
    }
    req.body.draftID = new ObjectID(req.body.draftID);
	db.collection('drafts').update( {_id: req.body.draftID}, {'$set': setJSON}, function(err, result) {
		if (!err) {
				console.log('Updated Draft!');
				draftJSON.draftUpdate = result;
				res.send(draftJSON);
		}
		else {
			throw err;
		}
	});
});
app.post('/getOwners', function(req, res) {
	var draftJSON = {};
	db.collection('owners').find({league: req.body.league}).toArray(function(err, result) {
	    if (err) throw err;
	    draftJSON.owners = result;
	    res.send(draftJSON);
	});	
});
app.post('/saveOwners', function(req, res) {
	var owner, draftJSON = {},
		total = req.body.owners.length,
		results = [];
	function saveAll() {
		owner = req.body.owners.pop();
		owner._id = new ObjectID(owner._id);
		db.collection('owners').update({_id: owner._id}, owner, function(err, result) {
		    if (!err) {
		    	console.log('Updated Owner!');
		    	results.push(result);
		    	if (--total) {
		    		saveAll();
		    	}
			 	else {
					draftJSON.results = results;
		 			res.send(draftJSON);
				}
		    }
		    else {
		    	throw err;
		    }
		});
	}
	saveAll();
});
app.post('/savePick', function(req, res) {
	var draftJSON = {}, 
	ownerID = new ObjectID(req.body.newPick.ownerID),
	setSpot = getSpotQuery(req.body.newPick, false);
    db.collection('owners').update( {_id: ownerID}, {'$set': setSpot}, function(err, result) {
        if (!err) {
                console.log('Updated Owner!');
                draftJSON.pick = req.body.newPick;
                draftJSON.ownerUpdate = setSpot;
                res.send(draftJSON);
        }
        else {
            throw err;
        }
    });
});
app.post('/removePick', function(req, res) {
	var draftJSON = {},
	ownerID = new ObjectID(req.body.oldPick.ownerID),
	setSpot = getSpotQuery(req.body.oldPick, true);
    db.collection('owners').update( {_id: ownerID}, {'$set': setSpot}, function(err, result) {
        if (!err) {
                console.log('Updated Owner!');
                draftJSON.ownerUpdate = setSpot;
                res.send(draftJSON);
        }
        else {
            throw err;
        }
    });
});
app.get('/getPlayers', function(req, res) {
    var playerJSON;
    db.collection('drafts').findById(req.query.currentDraftID, getPlayers.bind(null, res));
});
/* Single Landing Page */
app.get('/', function(req, res) {
    res.sendFile(__dirname+'/app/index.html');
});
app.listen('8082')
console.log('Listening on port: 8082');
exports = module.exports = app;



/* Utility Functions */
var TEAM_CROSS_REF = {
"Seattle Seahawks" : "SEA",
"St. Louis Rams": "STL",
"Buffalo Bills" : "BUF",
"Houston Texans" : "HOU",
"Arizona Cardinals" : "ARI",
"Denver Broncos": "DEN",
"Carolina Panthers": "CAR",
"New England Patriots": "NE",
"Green Bay Packers": "GB",
"Baltimore Ravens": "BAL",
"New York Jets": "NYJ",
"Miami Dolphins": "MIA",
"Cincinnati Bengals": "CIN",
"Kansas City Chiefs": "KC",
"San Francisco 49ers": "SF",
"Philadelphia Eagles": "PHI",
"Detroit Lions": "DET",
"Cleveland Browns": "CLE",
"Pittsburgh Steelers": "PIT",
"Minnesota Vikings": "MIN",
"Dallas Cowboys": "DAL",
"Indianapolis Colts": "IND",
"Jacksonville Jaguars": "JAC",
"New York Giants": "NYG",
"Tampa Bay Buccaneers": "TB",
"Chicago Bears": "CHI",
"San Diego Chargers": "SD",
"New Orleans Saints": "NO",
"Atlanta Falcons": "ATL",
"Washington Redskins": "WAS",
"Tennessee Titans": "TEN",
"Oakland Raiders":  "OAK"
}
function getSpotQuery(pick, isRemove) {
	var setSpot = {},
		value;
	if(isRemove) value = {};
	else value = pick;
	if(pick.spot.indexOf('BE') !== -1 || pick.spot.indexOf('RB') !== -1 || pick.spot.indexOf('WR') !== -1) {
		setSpot[pick.spot.substring(0,2)+'.'+(parseInt(pick.spot.substring(2))-1)] =  value;
	}
	else {
		setSpot[pick.spot] =  value;
	}
	return setSpot;
}
/* Player Class */
function Player() {
	return {
		rank: "",
		name: "",
		team: "",
		nameTeam: "",
		bye: "",
		position: "",
		positionRank: "",
		ADP: "",
		vsADP: "",
		points: "",
        depth: "",
		pick: 0
	}
}
/* Draft Class */
function Draft(draft) {
    function createArray(length) {
        var array = [];
        for(var i=0; i<length; i++) {
            array.push({"pick": i});
        }
        return array;
    }
    return {
		leagueName: draft.leagueName,
        isPPR: draft.isPPR,
        flex: draft.flex,
        size: draft.size,
		currentPick: 1,
		onTheClockTeam: {},
		pickList: createArray((draft.size*16)+1)
	}
}
/* Owner Class */
function Owner(league, index) {
	function createArray(length) {
		var array = [];
		for(var i=0; i<length; i++) {
			array.push({});
		}
		return array;
	}
	return {
		league: league,
		ownerName: "New Team "+index,
		nickname: "Nickname "+index,
		draftPosition: index,
		QB: {},
		RB: createArray(2),
		WR: createArray(2),
		TE: {},
		FLEX: {},
		DEF: {},
		K: {},
		BE: createArray(7)
	}
}
function fillLeague(size, league) {
	var owners = [];
	for(var i = 0; i < size; i++) {
		owners.push(new Owner(league, i+1));
	}
	return owners;
}
/* Creates player list JSON */
function getPlayers(res, err, result) {
	var url,
        playerJSON = {players: []};
    if (err) throw err;
    if(result.isPPR) {
        // = 'http://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php';
        url = 'http://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php';
    }
    else
        url = 'http://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php';
	request(url, function(error, response, html) {
		if(!error) {
			var newPlayer, $row, byeText, teamBye;
				$ = cheerio.load(html);

			$('#data tr:not(.table-ad)').each(function(){
		        $row = $(this);
		        newPlayer = new Player();
				newPlayer.rank = $row.find('td').eq(0).text().trim(); 
				
				if($row.find('td').eq(1).find('small').length) {
					newPlayer.name = $row.find('td').eq(1).find('a').first().text().trim();
                    teamBye = $row.find('td').eq(1).find('small').text().split(',');
					newPlayer.team = teamBye[0].trim();
                    if(teamBye.length > 1)
					    newPlayer.bye = $row.find('td').eq(1).find('small').text().split(',')[1].trim();
                    else
                        console.log(newPlayer.name);
				} else {
					newPlayer.name = $row.find('td').eq(1).find('a').text().trim();
					newPlayer.team = TEAM_CROSS_REF[newPlayer.name];
					byeText = $row.find('td').eq(1).find('span.tiny').text();
					newPlayer.bye = byeText.substring(1, byeText.indexOf(')'));
				}
				newPlayer.nameTeam = newPlayer.name+', '+newPlayer.team;
				
				newPlayer.position = $row.find('td').eq(2).text().replace(/\d/g, '').replace('DST', 'DEF').trim();
				newPlayer.positionRank = $row.find('td').eq(2).text().replace('DST', 'DEF').trim();
				newPlayer.ADP = $row.find('td').eq(7).text().trim();
				newPlayer.vsADP = $row.find('td').eq(8).text().trim();

                playerJSON.players.push(newPlayer);
	        });
            console.log('Players Written!');
            url = 'http://fftoolbox.scout.com/football/depth-charts.cfm';
            request(url, function(error, response, html) {
                if(!error) {
                    $ = cheerio.load(html);
                    var playerDepthListing,
                        $playerListings = $('#startcontent');

                    playerJSON.players.forEach(function(player) {
                        playerDepthListing = $playerListings.find('a:contains("'+player.name+'")');
                        if(playerDepthListing.length) {
                            player.depth = playerDepthListing.parent('li').text().split(' ')[0]
                        }
                    });
                    console.log('Player Data Ready!');
                    var playerSetObj = {
                        "players": playerJSON.players,
                        "playerUpdateTime": new Date()
                    };
                    db.collection('drafts').update( {_id: result._id}, {'$set': playerSetObj}, function(err, result) {
                        if (!err) {
                            console.log('Updated Draft Players!');
                            res.send(playerSetObj);
                        }
                        else {
                            throw err;
                        }

                    });
                }
                else {
                    res.send({});
                }

            });
		}
		else {
            res.send({});
		}
	});
}