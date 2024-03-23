[![Web](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_web.yml/badge.svg)](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_web.yml) [![Api](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_api.yml/badge.svg)](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_api.yml)

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
![image](https://github.com/domshyra-s-playground/baseRtkQueryApp/assets/1061957/80a2332c-c2f0-468f-b7c1-925bbfcd7d91)


#### Form for adding a rec
![image](https://github.com/domshyra-s-playground/baseRtkQueryApp/assets/1061957/bc9014bf-870c-4000-b7e8-c75d85126c21)


## Getting Started
I recommend using VS Code and opening the API folder and the Web folder each in seprate vs code instances. 


### API
First navigate to the api folder

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
First navigate to the Web folder

run `npm install`

run `npm start`

in vscode use "Launch Chrome against localhost" to view the website or naviagate to the url webpack outputs in the npm start command 
