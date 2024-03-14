[![Web](https://github.com/domshyra/domshyra/actions/workflows/main_domshyraweb.yml/badge.svg?branch=main)](https://github.com/domshyra/domshyra/actions/workflows/main_domshyraweb.yml) [![Api](https://github.com/domshyra/domshyra/actions/workflows/main_domshyraapi.yml/badge.svg)](https://github.com/domshyra/domshyra/actions/workflows/main_domshyraapi.yml)

# Basic Spa app with RtkQuery, React hook forms, and a .net backend

Grabs spotify playlists based on appsettings `Spotify:Username` value.
Has a form and index page to interact with.
If you don't have a spotfiy dev account go [here](https://developer.spotify.com/documentation/web-api/tutorials/getting-started)

Written in .Net and react

deployed to https://www.domshyra.com

There are a few examples of how this project has progressed or the other technologies that have improved over time

[Here is a sample version in containers](https://github.com/domshyra-s-playground/containersDemo)

[Here is a the upgrade to rtkQuery](https://github.com/domshyra-s-playground/rtkQueryDemo)


## Screen shots 
### Basic spotify api interaction 
![image](https://github.com/domshyra-s-playground/baseRtkQueryApp/assets/1061957/a8793cec-68bb-44fb-8237-6c2dee1e0b2b)

### Form Items
Here are some of the Form items in this application that demo basic CRUD operations. 
![image](https://github.com/domshyra-s-playground/baseRtkQueryApp/assets/1061957/af09992e-464a-4a63-b311-ed4029557910)
#### Form for adding a rec
![image](https://github.com/domshyra-s-playground/baseRtkQueryApp/assets/1061957/2995ed04-e2a6-4640-bcf9-dadffa310392)


## Getting Started

### API

might have to run `dotnet dev-certs https --trust` for api

Spotify will only work with a usersecrets file containing

```json
{
	"Spotify:ClientId": "SpotifyClientId",
	"Spotify:ClientSecret": "SpotifyClientSecret"
}
```

run the following commands to add secrets.

`dotnet user-secrets init`

`dotnet user-secrets set "Spotify:ClientId" "SpotifyClientId"`

`dotnet user-secrets set "Spotify:ClientSecret" "SpotifyClientSecret"`

#### Database

This project uses a local database

Make sure to have the latest version of the dotnet ef tool. See here for more information [here](https://docs.microsoft.com/en-us/ef/core/cli/dotnet)

in order to set up the local db run `dotnet ef database update`

For more information on how to use the database and ef migrations see [here](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli)

#### Running

in vscode use ".NET core launch"

### Web

run `npm install`
in vscode use "Launch Chrome against localhost" or run `npm start`
