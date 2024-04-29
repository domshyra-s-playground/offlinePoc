[![Web](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_web.yml/badge.svg)](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_web.yml) [![Api](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_api.yml/badge.svg)](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_api.yml) [![Db](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_db.yml/badge.svg)](https://github.com/domshyra-s-playground/offlinePoc/actions/workflows/main_db.yml)

# Basic Spa app with RtkQuery, React hook forms, and a .net backend

Grabs spotify playlists based on appsettings `Spotify:Username` value.
Has a form and index page to interact with.
If you don't have a Spotify dev account go [here](https://developer.spotify.com/documentation/web-api/tutorials/getting-started)

Written with a .net core backend and a react frontend. 

This code base shows the transformation of a basic react app with RTKQuery to one with a PWA and offline capabilities. This will alert the user if they are offline and will not allow them to save changes to the form. This will also cache the genres and playlists from spotify so that the user can still interact with the app offline. Note ratings are never cached as an example of how to handle more volatile data that isn't avail offline.

deployed to [offlinepocweb.azurewebsites.net](https://offlinepocweb.azurewebsites.net)

### Next steps
This is NOT READY FOR PRODUCTION. This is a proof of concept and should be treated as such. 

- Installing the PWA still needs some work. 
  - The service worker is not being installed correctly. Data is cached once fetched, but if the PWA is closed and reopened the data is not fetched from the cache. 
- Updates to the deployed PWA are not working at the moment. Thus it needs to be uninstalled and reinstalled to get the latest version.
- PWA has no refresh button, this isn't bad but it would be nice to have and to design this as an App first

### Other versions of this project

There are a few examples of how this project has progressed or the other technologies that have improved over time

[Here is a sample version in containers](https://github.com/domshyra-s-playground/containersDemo)

[Here is a the upgrade to rtkQuery](https://github.com/domshyra-s-playground/rtkQueryDemo)



## Screen shots 
### Basic spotify api interaction 
![image](https://github.com/domshyra-s-playground/baseRtkQueryApp/assets/1061957/a8793cec-68bb-44fb-8237-6c2dee1e0b2b)

### Form Items
Here are some of the Form items in this application that demo basic CRUD operations. 
The edit page should use patches to save changes to the server. If offline it will wait to save until the user is back online.
![image](https://github.com/domshyra-s-playground/baseRtkQueryApp/assets/1061957/80a2332c-c2f0-468f-b7c1-925bbfcd7d91)


#### Form for adding a rec
![image](https://github.com/domshyra-s-playground/baseRtkQueryApp/assets/1061957/bc9014bf-870c-4000-b7e8-c75d85126c21)

#### Offline 
if the app goes offline then the user will get an alert banner. This will disable saving on the form, and if the user has unsaved changes and tries to leave the form they will get a modal alert. This can also be installed as a PWA and will work offline. This caches the genres as well as the playlists from spotify, but will not cache the ratings. [Here is the code](https://github.com/domshyra-s-playground/offlinePoc/pull/4) to make this work offline and add PWA/service worker functionality. Learn more about [PWA's here](https://web.dev/learn/pwa/welcome)
 
<img width="538" alt="image" src="https://github.com/domshyra-s-playground/offlinePoc/assets/1061957/e886ba9a-7ed7-4f56-a5f0-3886c73601ab"> <img width="304" alt="image" src="https://github.com/domshyra-s-playground/offlinePoc/assets/1061957/282b3a22-105a-40c7-a075-85c87a1e4c92">


This is the cache for the genres and playlists from spotify as well as any offline assets and data we need to store for the browser to render an offline instance.

![image](https://github.com/domshyra-s-playground/offlinePoc/assets/1061957/bca4b4b5-7f2b-4cab-a13d-371eb994a99e)



## Getting Started
I recommend using VS Code and opening the API folder and the Web folder each in septate vs code instances. 


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

in vscode use "Launch Chrome against localhost" to view the website or navigate to the url webpack outputs in the npm start command 


#### Service worker testing
In order to test the service worker you will need to build the project and run it in production mode. CRA has a built in service worker that will only work in production mode. use `npm run build` to build the project and then `serve -s build` to run the project in production mode locally. More about the service worker debugging and testing [here](https://web.dev/learn/pwa/tools-and-debug)
