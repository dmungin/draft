# Fantasy Football Drafting Tool

*This application is currently in development*

The primary focus of the app is:

1. Scrape a website for player information - Name, Team, Position, Ranking, ADP, etc...
2. Manage the drafting process for one to many leagues by taking the player information and allowing users to:
	* Assign keepers
	* Live draft by picking players from the list
	* View draft results

# Installation

```javascript
npm install
```
```javascript
webpack
```
```javascript
npm start
```

# Current TODO List

1. Move files to module based organization
2. Change DB from Mongo to an SQL DB
3. Update scraping logic to add/update player data in DB instead simply returning to client
	* Create batch to load updated player rankings nightly
4. Change to update player info in DB with XREF to owners when picked
