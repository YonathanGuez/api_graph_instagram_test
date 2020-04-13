# api_graph_instagram_test


# Install Yarn :

## Setting :
```
yarn

```

## Create : .env with 
```
APP_ID_INSTA="APP_ID"
URI_REDIRECTION=https://localhost:3000/auth
APP_SECRET="APP SECRET "

```
Help for configuration .env:
![](image/basic-display-resource.jpg)

## RUN:
```
yarn start
```

## Explanation :

1) we will call in front the authorize request and do it our validation with instagram :

```
https://api.instagram.com/oauth/authorize?client_id={app-id}&redirect_uri={redirect-uri}&scope=user_profile,user_media&response_type=code
```

2) we will request access_token with "code" that autorize give use:

```
curl -X POST \
 https://api.instagram.com/oauth/access_token \
  -F client_id={app-id} \
  -F client_secret={app-secret} \
  -F grant_type=authorization_code \
  -F redirect_uri={redirect-uri} \
  -F code={code}
```

3) In developement:
```
curl -X GET \
  'https://graph.instagram.com/{user-id}?fields=id,username&access_token={access-token}'
```


4) In developement:
```
/{user-id}/media
```
for redirection
"ngrok http localhost:3000"